import React, { useState, useCallback, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radii, Spacing } from '../theme';
import { socketService, SessionData, FileRecord } from '../services/socketService';
import { fileStore, SavedFile } from '../storage/fileStore';
import Card from '../components/Card';
import Button from '../components/Button';
import FileItem from '../components/FileItem';
import Toast, { useToast } from '../components/Toast';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';

type SendScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Send'>;
type SendScreenRouteProp = RouteProp<RootStackParamList, 'Send'>;

interface SendScreenProps {
  navigation: SendScreenNavigationProp;
  route: SendScreenRouteProp;
}

interface UploadState {
  status: 'idle' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
}

export default function SendScreen({ navigation, route }: SendScreenProps) {
  const { session, serverUrl } = route.params;
  const [savedFiles, setSavedFiles] = useState<SavedFile[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [uploadStates, setUploadStates] = useState<Record<string, UploadState>>({});
  const [isSending, setIsSending] = useState(false);
  const [timeLeft, setTimeLeft] = useState('');
  const [isConnected, setIsConnected] = useState(true);
  const { toasts, addToast, dismissToast } = useToast();
  const pulseAnim = useRef(new Animated.Value(1)).current;

  // Pulse for the status dot
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.4, duration: 900, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 900, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  // Load saved files
  useEffect(() => {
    fileStore.getFiles().then((files) => {
      setSavedFiles(files);
      // Select all by default
      setSelected(new Set(files.map((f) => f.id)));
    });
  }, []);

  // Session timer
  useEffect(() => {
    const update = () => {
      const left = session.expiresAt - Date.now();
      if (left <= 0) { setTimeLeft('Expired'); return; }
      const m = Math.floor(left / 60000);
      const s = Math.floor((left % 60000) / 1000);
      setTimeLeft(`${m}:${s.toString().padStart(2, '0')}`);
    };
    update();
    const t = setInterval(update, 1000);
    return () => clearInterval(t);
  }, [session.expiresAt]);

  // Socket reconnect listeners
  useEffect(() => {
    socketService.connect(serverUrl, {
      onStatusChange: (status) => {
        if (status === 'disconnected' || status === 'expired') {
          setIsConnected(false);
        }
      },
      onSessionClosed: () => {
        addToast('Session closed by desktop', 'info');
        setTimeout(() => navigation.navigate('Home'), 1500);
      },
      onSessionExpired: () => {
        addToast('Session expired', 'warning');
        setTimeout(() => navigation.navigate('Home'), 1500);
      },
    });
  }, []);

  const toggleFile = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) { next.delete(id); } else { next.add(id); }
      return next;
    });
  }, []);

  const selectAll = useCallback(() => {
    setSelected(new Set(savedFiles.map((f) => f.id)));
  }, [savedFiles]);

  const selectNone = useCallback(() => {
    setSelected(new Set());
  }, []);

  const handleSend = useCallback(async () => {
    const filesToSend = savedFiles.filter((f) => selected.has(f.id));
    if (filesToSend.length === 0) {
      addToast('Select at least one file', 'warning');
      return;
    }

    setIsSending(true);

    for (const file of filesToSend) {
      setUploadStates((prev) => ({
        ...prev,
        [file.id]: { status: 'uploading', progress: 5 },
      }));

      const formData = new FormData();
      formData.append('files', {
        uri: file.uri,
        name: file.name,
        type: file.mimeType,
      } as any);

      try {
        // Simulate incremental progress
        const progressInterval = setInterval(() => {
          setUploadStates((prev) => {
            const cur = prev[file.id];
            if (!cur || cur.progress >= 85) { clearInterval(progressInterval); return prev; }
            return { ...prev, [file.id]: { ...cur, progress: Math.min(cur.progress + 15, 85) } };
          });
        }, 400);

        const res = await fetch(`${serverUrl}/api/upload`, {
          method: 'POST',
          headers: {
            'x-session-id': session.sessionId,
            'x-session-token': session.token,
          },
          body: formData,
        });

        clearInterval(progressInterval);
        const data = await res.json();

        if (!res.ok) {
          setUploadStates((prev) => ({
            ...prev,
            [file.id]: { status: 'error', progress: 0, error: data.error || 'Upload failed' },
          }));
          addToast(`❌ ${file.name}: ${data.error || 'failed'}`, 'error');
        } else {
          const fileResult: FileRecord = data.files?.[0];
          setUploadStates((prev) => ({
            ...prev,
            [file.id]: { status: 'done', progress: 100 },
          }));
          addToast(`✓  ${file.name} sent!`, 'success');

          if (fileResult?.status === 'ready') {
            socketService.notifyFile(session.sessionId, session.token, fileResult);
          }
        }
      } catch {
        setUploadStates((prev) => ({
          ...prev,
          [file.id]: { status: 'error', progress: 0, error: 'Network error' },
        }));
        addToast(`❌ Failed to send ${file.name}`, 'error');
      }
    }

    setIsSending(false);
  }, [savedFiles, selected, session, serverUrl, addToast]);

  const handleCloseSession = useCallback(() => {
    Alert.alert(
      'Close Session',
      'This will disconnect the desktop too.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Close',
          style: 'destructive',
          onPress: () => {
            socketService.closeSession(session.token);
            navigation.navigate('Home');
          },
        },
      ]
    );
  }, [session.token, navigation]);

  const sentCount = Object.values(uploadStates).filter((s) => s.status === 'done').length;
  const pendingCount = savedFiles.filter((f) => selected.has(f.id)).length;

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* Status Bar */}
        <Card style={styles.statusCard}>
          <View style={styles.statusLeft}>
            <Animated.View style={[styles.dot, { transform: [{ scale: pulseAnim }] }]} />
            <View>
              <Text style={styles.connectedText}>
                {isConnected ? 'Connected to Desktop' : 'Disconnected'}
              </Text>
              <Text style={styles.expiresText}>Session expires in {timeLeft}</Text>
            </View>
          </View>
          <Button
            title="End"
            onPress={handleCloseSession}
            variant="danger"
            style={{ paddingVertical: 8, paddingHorizontal: 16 }}
          />
        </Card>

        {/* File Selection */}
        {savedFiles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Your Files ({selected.size}/{savedFiles.length} selected)
              </Text>
              <View style={styles.selectBtns}>
                <Text style={styles.selectLink} onPress={selectAll}>All</Text>
                <Text style={styles.selectDivider}>·</Text>
                <Text style={styles.selectLink} onPress={selectNone}>None</Text>
              </View>
            </View>
            <View style={styles.fileList}>
              {savedFiles.map((file) => {
                const us = uploadStates[file.id];
                return (
                  <FileItem
                    key={file.id}
                    file={file}
                    selectable
                    selected={selected.has(file.id)}
                    onToggle={toggleFile}
                    uploadStatus={us?.status ?? 'idle'}
                    progress={us?.progress ?? 0}
                  />
                );
              })}
            </View>
          </View>
        )}

        {savedFiles.length === 0 && (
          <Card style={styles.emptyCard}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>No files in library</Text>
            <Text style={styles.emptySubtitle}>
              Go to File Manager to add files before sending
            </Text>
            <Button
              title="Open File Manager"
              onPress={() => navigation.navigate('FileManager')}
              variant="secondary"
              style={{ marginTop: Spacing.base }}
            />
          </Card>
        )}

        {/* Send progress summary */}
        {sentCount > 0 && (
          <Card style={styles.summaryCard}>
            <Text style={styles.summaryText}>
              🎉  {sentCount} file{sentCount > 1 ? 's' : ''} sent to desktop!
            </Text>
          </Card>
        )}

        {/* Send Button */}
        {savedFiles.length > 0 && (
          <Button
            title={isSending ? `Sending… (${sentCount}/${pendingCount})` : `📤  Send ${selected.size} File${selected.size !== 1 ? 's' : ''}`}
            onPress={handleSend}
            loading={isSending}
            disabled={selected.size === 0 || isSending}
            fullWidth
            style={{ marginTop: Spacing.sm }}
          />
        )}
      </ScrollView>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxxl, gap: Spacing.base, paddingTop: Spacing.base },
  statusCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  statusLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm + 2, flex: 1 },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.success,
  },
  connectedText: { fontSize: 14, fontWeight: '700', color: Colors.successText },
  expiresText: { fontSize: 12, color: Colors.muted, marginTop: 1 },
  section: { gap: Spacing.sm },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  sectionTitle: { fontSize: 15, fontWeight: '700', color: Colors.text },
  selectBtns: { flexDirection: 'row', alignItems: 'center', gap: Spacing.xs },
  selectLink: { fontSize: 13, color: Colors.accent, fontWeight: '600' },
  selectDivider: { fontSize: 13, color: Colors.muted },
  fileList: { gap: Spacing.sm },
  emptyCard: { alignItems: 'center', paddingVertical: Spacing.xxxl, gap: Spacing.sm },
  emptyEmoji: { fontSize: 48, opacity: 0.4 },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: Colors.text },
  emptySubtitle: { fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 21 },
  summaryCard: {
    backgroundColor: Colors.successBg,
    borderColor: `${Colors.success}30`,
    alignItems: 'center',
  },
  summaryText: { fontSize: 15, fontWeight: '600', color: Colors.successText },
});

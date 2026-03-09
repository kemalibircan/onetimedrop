import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import * as DocumentPicker from 'expo-document-picker';
import { Colors, Radii, Spacing } from '../theme';
import { fileStore, SavedFile } from '../storage/fileStore';
import Card from '../components/Card';
import Button from '../components/Button';
import FileItem from '../components/FileItem';
import Toast, { useToast } from '../components/Toast';
import i18n from '../i18n';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

type FileManagerNavigationProp = StackNavigationProp<RootStackParamList, 'FileManager'>;

interface FileManagerScreenProps {
  navigation: FileManagerNavigationProp;
}

const MAX_FILE_SIZE = 250 * 1024 * 1024; // 250MB

export default function FileManagerScreen({ navigation }: FileManagerScreenProps) {
  const [files, setFiles] = useState<SavedFile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isPicking, setIsPicking] = useState(false);
  const { toasts, addToast, dismissToast } = useToast();

  const loadFiles = useCallback(async () => {
    setIsLoading(true);
    const saved = await fileStore.getFiles();
    setFiles(saved);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadFiles();
  }, []);

  const handlePickFiles = useCallback(async () => {
    setIsPicking(true);
    try {
      const result = await DocumentPicker.getDocumentAsync({
        multiple: true,
        copyToCacheDirectory: true,
      });

      if (result.canceled) {
        setIsPicking(false);
        return;
      }

      let added = 0;
      for (const asset of result.assets) {
        if (asset.size && asset.size > MAX_FILE_SIZE) {
          addToast(`${asset.name} > 250MB`, 'error');
          continue;
        }
        await fileStore.addFile({
          name: asset.name,
          size: asset.size ?? 0,
          mimeType: asset.mimeType ?? 'application/octet-stream',
          uri: asset.uri,
        });
        added++;
      }

      if (added > 0) {
        addToast(`${added} ${i18n.t('common.success')}`, 'success');
        await loadFiles();
      }
    } catch (e) {
      addToast(i18n.t('common.error'), 'error');
    }
    setIsPicking(false);
  }, [addToast, loadFiles]);

  const handleRemoveFile = useCallback(async (id: string) => {
    await fileStore.removeFile(id);
    await loadFiles();
    addToast(i18n.t('common.success'), 'info');
  }, [addToast, loadFiles]);

  const handleClearAll = useCallback(() => {
    Alert.alert(
      i18n.t('fileManager.clearAll'),
      i18n.t('fileManager.emptySub'),
      [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        {
          text: i18n.t('common.clear'),
          style: 'destructive',
          onPress: async () => {
            await fileStore.clearFiles();
            setFiles([]);
            addToast(i18n.t('common.success'), 'info');
          },
        },
      ]
    );
  }, [addToast]);

  const totalSize = files.reduce((sum, f) => sum + f.size, 0);
  const formatBytes = (bytes: number) => {
    if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / 1048576).toFixed(1)} MB`;
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadFiles} tintColor={Colors.accent} />}
      >
        {/* Header info */}
        <Card style={styles.statsCard}>
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={styles.statNum}>{files.length}</Text>
              <Text style={styles.statLabel}>{i18n.t('fileManager.filesSaved')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>{files.length > 0 ? formatBytes(totalSize) : '—'}</Text>
              <Text style={styles.statLabel}>{i18n.t('fileManager.totalSize')}</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.stat}>
              <Text style={styles.statNum}>250MB</Text>
              <Text style={styles.statLabel}>{i18n.t('fileManager.maxPerFile')}</Text>
            </View>
          </View>
        </Card>

        {/* Add files button */}
        <TouchableOpacity
          onPress={handlePickFiles}
          activeOpacity={0.85}
          style={[styles.dropzone, isPicking && styles.dropzoneActive]}
          disabled={isPicking}
        >
          {isPicking ? (
            <View style={{ alignItems: 'center', gap: Spacing.sm }}>
              <Text style={styles.dropzoneEmoji}>⏳</Text>
              <Text style={styles.dropzoneTitle}>{i18n.t('fileManager.selecting')}</Text>
            </View>
          ) : (
            <View style={{ alignItems: 'center', gap: Spacing.sm }}>
              <Text style={styles.dropzoneEmoji}>📁</Text>
              <Text style={styles.dropzoneTitle}>{i18n.t('fileManager.addFilesText')}</Text>
              <Text style={styles.dropzoneSubtitle}>
                {i18n.t('fileManager.addFilesSub')}
              </Text>
              <View style={styles.addBtnInner}>
                <Text style={styles.addBtnText}>{i18n.t('fileManager.chooseFilesBtn')}</Text>
              </View>
            </View>
          )}
        </TouchableOpacity>

        {/* File list */}
        {files.length > 0 && (
          <View style={styles.listContainer}>
            <View style={styles.listHeader}>
              <Text style={styles.listTitle}>{i18n.t('fileManager.savedTitle')}</Text>
              <TouchableOpacity onPress={handleClearAll}>
                <Text style={styles.clearBtn}>{i18n.t('fileManager.clearAll')}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.fileList}>
              {files.map((file) => (
                <FileItem
                  key={file.id}
                  file={file}
                  onRemove={handleRemoveFile}
                />
              ))}
            </View>
          </View>
        )}

        {files.length === 0 && !isLoading && (
          <View style={styles.emptyState}>
            <Text style={styles.emptyEmoji}>📭</Text>
            <Text style={styles.emptyTitle}>{i18n.t('fileManager.emptyTitle')}</Text>
            <Text style={styles.emptySubtitle}>
              {i18n.t('fileManager.emptySub')}
            </Text>
          </View>
        )}

        {/* CTA */}
        {files.length > 0 && (
          <Button
            title={i18n.t('fileManager.goConnect')}
            onPress={() => navigation.navigate('Home')}
            variant="primary"
            fullWidth
            style={{ marginTop: Spacing.md }}
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
  statsCard: {},
  statsRow: { flexDirection: 'row', alignItems: 'center' },
  stat: { flex: 1, alignItems: 'center', gap: 2 },
  statNum: { fontSize: 20, fontWeight: '800', color: Colors.accent },
  statLabel: { fontSize: 11, color: Colors.muted, textAlign: 'center' },
  statDivider: { width: 1, height: 36, backgroundColor: Colors.border },
  dropzone: {
    borderRadius: Radii.xxl,
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
    backgroundColor: Colors.card,
    padding: Spacing.xxxl,
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  dropzoneActive: {
    borderColor: Colors.accent,
    backgroundColor: `${Colors.accent}06`,
  },
  dropzoneEmoji: { fontSize: 44, marginBottom: Spacing.xs },
  dropzoneTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  dropzoneSubtitle: { fontSize: 13, color: Colors.muted, textAlign: 'center', lineHeight: 18, paddingHorizontal: Spacing.md },
  addBtnInner: {
    marginTop: Spacing.md,
    backgroundColor: Colors.accent,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.md,
    borderRadius: Radii.xl,
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  addBtnText: { color: Colors.white, fontSize: 15, fontWeight: '700' },
  listContainer: { gap: Spacing.sm },
  listHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  listTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  clearBtn: { fontSize: 13, color: Colors.error, fontWeight: '600' },
  fileList: { gap: Spacing.sm },
  emptyState: { alignItems: 'center', paddingVertical: Spacing.xxl, gap: Spacing.sm },
  emptyEmoji: { fontSize: 48, opacity: 0.4 },
  emptyTitle: { fontSize: 17, fontWeight: '600', color: Colors.text },
  emptySubtitle: { fontSize: 14, color: Colors.muted, textAlign: 'center', lineHeight: 21 },
});

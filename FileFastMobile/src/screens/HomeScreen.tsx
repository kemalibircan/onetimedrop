import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radii, Spacing } from '../theme';
import { socketService, SessionData } from '../services/socketService';
import { fileStore } from '../storage/fileStore';
import Button from '../components/Button';
import Card from '../components/Card';
import Toast, { useToast } from '../components/Toast';
import i18n from '../i18n';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

const { width } = Dimensions.get('window');

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [code, setCode] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [serverUrl, setServerUrl] = useState('https://onetimedrop.com');
  const { toasts, addToast, dismissToast } = useToast();

  // Animations
  const pulseAnim = useRef(new Animated.Value(1)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    fileStore.getServerUrl().then(setServerUrl);

    // Entrance fade
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();

    // Pulse animation for the logo
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, { toValue: 1.05, duration: 2000, useNativeDriver: true }),
        Animated.timing(pulseAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
      ])
    ).start();

    // Subtle float animation for the hero section
    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, { toValue: -8, duration: 3000, useNativeDriver: true }),
        Animated.timing(floatAnim, { toValue: 0, duration: 3000, useNativeDriver: true }),
      ])
    ).start();
  }, []);

  const formatCode = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 8);
    return digits.length > 4 ? `${digits.slice(0, 4)} ${digits.slice(4)}` : digits;
  };

  const handleConnect = useCallback(() => {
    const digits = code.replace(/\D/g, '');
    if (digits.length !== 8) {
      addToast(i18n.t('common.error'), 'error');
      return;
    }
    setIsConnecting(true);

    socketService.connect(serverUrl, {
      onSessionJoined: (session: SessionData) => {
        setIsConnecting(false);
        addToast(i18n.t('common.success'), 'success');
        navigation.navigate('Send', { session, serverUrl });
      },
      onError: (message: string) => {
        setIsConnecting(false);
        addToast(message || i18n.t('common.error'), 'error');
      },
      onSessionExpired: () => {
        setIsConnecting(false);
        addToast(i18n.t('common.error'), 'warning');
      },
    });

    setTimeout(() => {
      socketService.joinSession(digits);
    }, 800);
  }, [code, serverUrl, navigation, addToast]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
      <Animated.View style={{ flex: 1, opacity: fadeAnim }}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Modern Hero */}
            <Animated.View style={[styles.hero, { transform: [{ translateY: floatAnim }] }]}>
              <View style={styles.logoContainer}>
                <Text style={styles.logo}>🍊</Text>
              </View>
              <Text style={styles.appName}>FileFast</Text>
              <Text style={styles.tagline}>{i18n.t('home.heroTagline')}</Text>
            </Animated.View>

            {/* Main Action Card */}
            <Card style={styles.card} padding={Spacing.xl}>
              <Text style={styles.cardTitle}>{i18n.t('home.enterCode')}</Text>
              <Text style={styles.cardSubtitle}>
                {i18n.t('home.openDesktop')}
              </Text>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.codeInput}
                  value={code}
                  onChangeText={(t) => setCode(formatCode(t))}
                  placeholder="1234 5678"
                  placeholderTextColor={Colors.muted}
                  keyboardType="number-pad"
                  maxLength={9}
                  textAlign="center"
                  returnKeyType="go"
                  onSubmitEditing={handleConnect}
                  autoCorrect={false}
                />
              </View>

              <Button
                title={isConnecting ? i18n.t('home.connecting') : i18n.t('home.connect')}
                onPress={handleConnect}
                loading={isConnecting}
                disabled={code.replace(/\D/g, '').length !== 8}
                fullWidth
                style={styles.connectBtn}
              />

              <View style={styles.divider}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>{i18n.t('home.or')}</Text>
                <View style={styles.dividerLine} />
              </View>

              <Button
                title={i18n.t('home.manageFiles')}
                onPress={() => navigation.navigate('FileManager')}
                variant="secondary"
                fullWidth
              />
            </Card>

            {/* How it works (Subtle design) */}
            <View style={styles.howWrapper}>
              <Text style={styles.howTitle}>{i18n.t('home.howItWorks')}</Text>
              <View style={styles.stepsGrid}>
                {[
                  { icon: '📁', text: i18n.t('home.step1') },
                  { icon: '💻', text: i18n.t('home.step2') },
                  { icon: '🔢', text: i18n.t('home.step3') },
                  { icon: '🚀', text: i18n.t('home.step4') },
                ].map((item, i) => (
                  <View key={i} style={styles.stepItem}>
                    <View style={styles.stepIconBox}>
                      <Text style={styles.stepIcon}>{item.icon}</Text>
                    </View>
                    <Text style={styles.stepText}>{item.text}</Text>
                  </View>
                ))}
              </View>
            </View>

            {/* Settings link */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              style={styles.settingsBtn}
            >
              <Text style={styles.settingsText}>⚙️  {i18n.t('settings.title')}</Text>
            </TouchableOpacity>

          </ScrollView>
        </KeyboardAvoidingView>
      </Animated.View>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxxl, gap: Spacing.xl },
  hero: {
    alignItems: 'center',
    paddingTop: Spacing.xxl + 10,
    paddingBottom: Spacing.lg,
  },
  logoContainer: {
    width: 100,
    height: 100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  logo: { fontSize: 64, zIndex: 2 },
  logoGlow: {
    position: 'absolute',
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    opacity: 0.3,
    transform: [{ scale: 1.5 }],
    zIndex: 1,
  },
  appName: {
    fontSize: 40,
    fontWeight: '800',
    color: Colors.text,
    letterSpacing: -1.5,
  },
  tagline: {
    fontSize: 16,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 24,
    marginTop: Spacing.xs,
    fontWeight: '500',
  },
  card: { gap: Spacing.sm, backgroundColor: Colors.card, borderWidth: 0, elevation: 8, shadowOpacity: 0.12, shadowRadius: 24 },
  cardTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.text,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Colors.muted,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
    marginBottom: Spacing.sm,
  },
  inputContainer: {
    backgroundColor: `${Colors.primary}10`,
    borderRadius: Radii.xl,
    padding: 4,
  },
  codeInput: {
    height: 72,
    borderRadius: Radii.lg,
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: `${Colors.primary}30`,
    fontSize: 34,
    fontWeight: '800',
    fontFamily: Platform.OS === 'ios' ? 'Courier New' : 'monospace',
    letterSpacing: 8,
    color: Colors.accent,
    textAlign: 'center',
  },
  connectBtn: {
    marginTop: Spacing.md,
    height: 56,
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginVertical: Spacing.md,
  },
  dividerLine: { flex: 1, height: 1, backgroundColor: Colors.border },
  dividerText: { fontSize: 13, color: Colors.muted, fontWeight: '600', textTransform: 'uppercase' },
  howWrapper: {
    paddingHorizontal: Spacing.sm,
  },
  howTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.muted,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.md,
    textAlign: 'center',
  },
  stepsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.base,
    justifyContent: 'space-between',
  },
  stepItem: {
    width: (width - Spacing.base * 2 - Spacing.base - Spacing.sm * 2) / 2, // 2 columns
    backgroundColor: Colors.white,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    alignItems: 'center',
    gap: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepIconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: `${Colors.primary}15`,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepIcon: { fontSize: 20 },
  stepText: {
    fontSize: 13,
    color: Colors.text,
    textAlign: 'center',
    lineHeight: 18,
    fontWeight: '500',
  },
  settingsBtn: {
    alignSelf: 'center',
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.base,
    marginTop: Spacing.xl,
  },
  settingsText: { fontSize: 14, color: Colors.muted, fontWeight: '600' },
});

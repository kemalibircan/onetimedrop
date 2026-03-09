import React, { useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radii, Spacing } from '../theme';
import { fileStore } from '../storage/fileStore';
import Card from '../components/Card';
import Button from '../components/Button';
import Toast, { useToast } from '../components/Toast';
import i18n from '../i18n';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

const APP_VERSION = '1.0.0';

interface SettingsScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Settings'>;
}

export default function SettingsScreen({ navigation }: SettingsScreenProps) {
  const { toasts, addToast, dismissToast } = useToast();

  const handleClearFiles = useCallback(() => {
    Alert.alert(
      i18n.t('settings.clearFilesBtn'),
      i18n.t('settings.librarySub'),
      [
        { text: i18n.t('common.cancel'), style: 'cancel' },
        {
          text: i18n.t('common.clear'),
          style: 'destructive',
          onPress: async () => {
            await fileStore.clearFiles();
            addToast(i18n.t('common.success'), 'info');
          },
        },
      ]
    );
  }, [addToast]);

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        {/* File Library */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('settings.library')}</Text>
          <Text style={styles.sectionSubtitle}>
            {i18n.t('settings.librarySub')}
          </Text>
          <Button
            title={i18n.t('settings.clearFilesBtn')}
            onPress={handleClearFiles}
            variant="danger"
            fullWidth
            style={{ marginTop: Spacing.sm }}
          />
        </Card>

        {/* FAQ Link */}
        <Button
          title={i18n.t('settings.faq')}
          onPress={() => navigation.navigate('FAQ')}
          variant="secondary"
          fullWidth
          style={{ justifyContent: 'flex-start', paddingHorizontal: Spacing.md }}
        />

        {/* About */}
        <Card style={styles.section}>
          <Text style={styles.sectionTitle}>{i18n.t('settings.about')}</Text>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{i18n.t('settings.version')}</Text>
            <Text style={styles.aboutValue}>{APP_VERSION}</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{i18n.t('settings.service')}</Text>
            <Text style={styles.aboutValue}>onetimedrop.com</Text>
          </View>
          <View style={styles.aboutRow}>
            <Text style={styles.aboutLabel}>{i18n.t('settings.limit')}</Text>
            <Text style={styles.aboutValue}>250 MB</Text>
          </View>
          <Text style={styles.disclaimer}>
            {i18n.t('settings.disclaimer')}
          </Text>
        </Card>
      </ScrollView>

      <Toast toasts={toasts} onDismiss={dismissToast} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxxl, gap: Spacing.base, paddingTop: Spacing.base },
  section: { gap: 2 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  sectionSubtitle: { fontSize: 13, color: Colors.muted, marginTop: 2, lineHeight: 19 },
  aboutRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginTop: Spacing.xs,
  },
  aboutLabel: { fontSize: 14, color: Colors.muted },
  aboutValue: { fontSize: 14, fontWeight: '600', color: Colors.text },
  disclaimer: {
    fontSize: 12,
    color: Colors.muted,
    lineHeight: 18,
    marginTop: Spacing.md,
  },
});

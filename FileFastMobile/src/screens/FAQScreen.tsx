import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors, Radii, Spacing } from '../theme';
import Card from '../components/Card';
import i18n from '../i18n';

export default function FAQScreen() {
  const faqs = [
    { q: i18n.t('faq.q1'), a: i18n.t('faq.a1') },
    { q: i18n.t('faq.q2'), a: i18n.t('faq.a2') },
    { q: i18n.t('faq.q3'), a: i18n.t('faq.a3') },
  ];

  return (
    <SafeAreaView style={styles.safeArea} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {faqs.map((faq, index) => (
          <Card key={index} style={styles.card}>
            <Text style={styles.question}>{faq.q}</Text>
            <Text style={styles.answer}>{faq.a}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: Colors.bg },
  scroll: { paddingHorizontal: Spacing.base, paddingBottom: Spacing.xxxl, paddingTop: Spacing.base, gap: Spacing.md },
  card: { gap: Spacing.sm },
  question: { fontSize: 16, fontWeight: '700', color: Colors.text },
  answer: { fontSize: 14, color: Colors.muted, lineHeight: 22 },
});

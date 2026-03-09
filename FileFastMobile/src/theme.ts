// FileFast Design Tokens — matches the web app palette
export const Colors = {
  bg: '#FFF7EF',
  card: '#FFFFFF',
  primary: '#FFB86B',
  accent: '#FF8A3D',
  accentDark: '#E06A1A',
  text: '#111827',
  muted: '#6B7280',
  border: '#F0E6D9',
  success: '#10B981',
  successBg: '#D1FAE5',
  successText: '#065F46',
  error: '#EF4444',
  errorBg: '#FEE2E2',
  errorText: '#991B1B',
  warning: '#F59E0B',
  warningBg: '#FEF3C7',
  warningText: '#92400E',
  info: '#3B82F6',
  infoBg: '#DBEAFE',
  infoText: '#1E40AF',
  white: '#FFFFFF',
  overlay: 'rgba(0,0,0,0.4)',
};

export const Radii = {
  sm: 10,
  md: 14,
  lg: 20,
  xl: 24,
  xxl: 32,
  full: 9999,
};

export const Shadows = {
  card: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  cardHover: {
    shadowColor: Colors.accent,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 20,
    elevation: 8,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  base: 16,
  lg: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
};

export const Typography = {
  h1: { fontSize: 28, fontWeight: '800' as const, color: Colors.text, letterSpacing: -0.5 },
  h2: { fontSize: 22, fontWeight: '700' as const, color: Colors.text, letterSpacing: -0.3 },
  h3: { fontSize: 18, fontWeight: '600' as const, color: Colors.text },
  body: { fontSize: 15, fontWeight: '400' as const, color: Colors.text },
  bodyMd: { fontSize: 15, fontWeight: '500' as const, color: Colors.text },
  small: { fontSize: 13, fontWeight: '400' as const, color: Colors.muted },
  smallMd: { fontSize: 13, fontWeight: '500' as const, color: Colors.muted },
  mono: { fontSize: 15, fontFamily: 'monospace' as const },
  code: { fontSize: 32, fontFamily: 'monospace' as const, fontWeight: '700' as const, letterSpacing: 8, color: Colors.accent },
};

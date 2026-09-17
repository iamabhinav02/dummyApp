import { THEME_TYPE } from '../enums/common';

export const COLORS = {
  [THEME_TYPE.LIGHT]: {
    SURFACE: {
      PRIMARY: '#FFFFFF',
      SECONDARY: '#F5F5F7',
      TERTIARY: '#EAEAED',
      SCRIM: 'rgba(0, 0, 0, 0.35)',
    },
    BUTTONS: {
      PRIMARY: '#2563EB',
      SECONDARY: '#6B7280',
      TERTIARY: '#E5E7EB',
    },
    TEXT: {
      PRIMARY: '#111827',
      SECONDARY: '#4B5563',
      TERTIARY: '#9CA3AF',
      INVERSE: '#FFFFFF',
    },
    STATUS: {
      DANGER: '#DC2626',
    },
    ACCENT: {
      BLUE: '#2563EB',
      VIOLET: '#7C3AED',
      GREEN: '#059669',
      AMBER: '#D97706',
      ROSE: '#E11D48',
      TEAL: '#0D9488',
      INDIGO: '#4F46E5',
      SLATE: '#64748B',
    },
  },

  [THEME_TYPE.DARK]: {
    SURFACE: {
      PRIMARY: '#0F172A',
      SECONDARY: '#1E293B',
      TERTIARY: '#334155',
      SCRIM: 'rgba(0, 0, 0, 0.6)',
    },
    BUTTONS: {
      PRIMARY: '#3B82F6',
      SECONDARY: '#94A3B8',
      TERTIARY: '#1F2937',
    },
    TEXT: {
      PRIMARY: '#F9FAFB',
      SECONDARY: '#CBD5E1',
      TERTIARY: '#94A3B8',
      INVERSE: '#FFFFFF',
    },
    STATUS: {
      DANGER: '#F87171',
    },
    ACCENT: {
      BLUE: '#60A5FA',
      VIOLET: '#A78BFA',
      GREEN: '#34D399',
      AMBER: '#FBBF24',
      ROSE: '#FB7185',
      TEAL: '#2DD4BF',
      INDIGO: '#818CF8',
      SLATE: '#94A3B8',
    },
  },
};

export type IColors = typeof COLORS[THEME_TYPE.LIGHT];
export type AccentColor = keyof IColors['ACCENT'];

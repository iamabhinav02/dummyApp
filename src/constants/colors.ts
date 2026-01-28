import { THEME_TYPE } from '../enums/common';

export const COLORS = {
  [THEME_TYPE.LIGHT]: {
    SURFACE: {
      PRIMARY: '#FFFFFF',
      SECONDARY: '#F5F5F7',
      TERTIARY: '#EAEAED',
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
    },
  },

  [THEME_TYPE.DARK]: {
    SURFACE: {
      PRIMARY: '#0F172A',
      SECONDARY: '#1E293B',
      TERTIARY: '#334155',
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
    },
  },
};

export type IColors = typeof COLORS[THEME_TYPE.LIGHT]

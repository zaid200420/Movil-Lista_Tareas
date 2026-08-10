export type ThemeName = 'light' | 'dark' | 'system' | 'blue' | 'green' | 'purple' | 'orange';

export interface ThemeColors {
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  primary: string;
  primaryLight: string;
  border: string;
  icon: string;
}

export const themes: Record<Exclude<ThemeName, 'system'>, ThemeColors> = {
  light: {
    background: '#F3F4F6',
    card: '#FFFFFF',
    text: '#111827',
    textSecondary: '#6B7280',
    primary: '#8B5CF6',
    primaryLight: '#F3E8FF',
    border: '#E5E7EB',
    icon: '#8B5CF6',
  },
  dark: {
    background: '#111827',
    card: '#1F2937',
    text: '#F9FAFB',
    textSecondary: '#9CA3AF',
    primary: '#A78BFA',
    primaryLight: '#312E81',
    border: '#374151',
    icon: '#A78BFA',
  },
  blue: {
    background: '#EFF6FF',
    card: '#FFFFFF',
    text: '#1E3A8A',
    textSecondary: '#64748B',
    primary: '#3B82F6',
    primaryLight: '#DBEAFE',
    border: '#BFDBFE',
    icon: '#3B82F6',
  },
  green: {
    background: '#F0FDF4',
    card: '#FFFFFF',
    text: '#064E3B',
    textSecondary: '#64748B',
    primary: '#10B981',
    primaryLight: '#D1FAE5',
    border: '#A7F3D0',
    icon: '#10B981',
  },
  purple: {
    background: '#FAF5FF',
    card: '#FFFFFF',
    text: '#4C1D95',
    textSecondary: '#7C3AED',
    primary: '#8B5CF6',
    primaryLight: '#F3E8FF',
    border: '#DDD6FE',
    icon: '#8B5CF6',
  },
  orange: {
    background: '#FFF7ED',
    card: '#FFFFFF',
    text: '#7C2D12',
    textSecondary: '#EA580C',
    primary: '#F97316',
    primaryLight: '#FFEDD5',
    border: '#FED7AA',
    icon: '#F97316',
  },
};

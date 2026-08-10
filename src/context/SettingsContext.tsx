import React, { createContext, useContext, useState, useEffect, useRef, useMemo } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useRNColorScheme } from 'react-native';
import { ThemeName, ThemeColors, themes } from '../constants/themes';
import { translations, Language } from '../constants/translations';

export type AppIconName = 'default' | 'dark' | 'blue' | 'green' | 'orange';

export interface AppIconOption {
  id: AppIconName;
  labelKey: keyof typeof translations.es;
  bgColor: string;
  fgColor: string;
  icon: string;
}

export const APP_ICONS: AppIconOption[] = [
  { id: 'default', labelKey: 'appIconDefault', bgColor: '#8B5CF6', fgColor: '#FFFFFF', icon: '✨' },
  { id: 'dark',    labelKey: 'appIconDark',    bgColor: '#111827', fgColor: '#A78BFA', icon: '🌙' },
  { id: 'blue',    labelKey: 'appIconBlue',    bgColor: '#3B82F6', fgColor: '#FFFFFF', icon: '🔷' },
  { id: 'green',   labelKey: 'appIconGreen',   bgColor: '#10B981', fgColor: '#FFFFFF', icon: '🌿' },
  { id: 'orange',  labelKey: 'appIconOrange',  bgColor: '#F97316', fgColor: '#FFFFFF', icon: '🍊' },
];

interface SettingsContextType {
  theme: ThemeName;
  language: Language;
  appIcon: AppIconName;
  resolvedTheme: Exclude<ThemeName, 'system'>;
  colors: ThemeColors;
  t: typeof translations.es;
  setTheme: (t: ThemeName) => Promise<void>;
  setLanguage: (l: Language) => Promise<void>;
  setAppIcon: (icon: AppIconName) => Promise<void>;
  languageOptions: Language[];
  themeOptions: ThemeName[];
  isLoading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

const STORAGE_KEYS = {
  THEME: '@todoapp:settings:theme',
  LANGUAGE: '@todoapp:settings:language',
  APP_ICON: '@todoapp:settings:appIcon',
} as const;

export const SettingsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeName>('system');
  const [language, setLanguageState] = useState<Language>('es');
  const [appIcon, setAppIconState] = useState<AppIconName>('default');
  const [isLoading, setIsLoading] = useState(true);
  const hasInit = useRef(false);
  const systemColorScheme = useRNColorScheme();

  useEffect(() => {
    if (hasInit.current) return;
    hasInit.current = true;
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const [storedTheme, storedLang, storedIcon] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEYS.THEME),
        AsyncStorage.getItem(STORAGE_KEYS.LANGUAGE),
        AsyncStorage.getItem(STORAGE_KEYS.APP_ICON),
      ]);

      if (storedTheme && ['light','dark','system','blue','green','purple','orange'].includes(storedTheme)) {
        setThemeState(storedTheme as ThemeName);
      }
      if (storedLang && storedLang in translations) {
        setLanguageState(storedLang as Language);
      }
      if (storedIcon && ['default','dark','blue','green','orange'].includes(storedIcon)) {
        setAppIconState(storedIcon as AppIconName);
      }
    } catch (e) {
      console.error('Error loading settings:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const resolvedTheme: Exclude<ThemeName, 'system'> = useMemo(() => {
    if (theme === 'system') {
      return (systemColorScheme === 'dark') ? 'dark' : 'light';
    }
    return theme;
  }, [theme, systemColorScheme]);

  const colors: ThemeColors = useMemo(() => themes[resolvedTheme], [resolvedTheme]);
  const t = useMemo(() => translations[language], [language]);

  const setTheme = async (newTheme: ThemeName) => {
    setThemeState(newTheme);
    try { await AsyncStorage.setItem(STORAGE_KEYS.THEME, newTheme); } catch {}
  };

  const setLanguage = async (newLang: Language) => {
    setLanguageState(newLang);
    try { await AsyncStorage.setItem(STORAGE_KEYS.LANGUAGE, newLang); } catch {}
  };

  const setAppIcon = async (newIcon: AppIconName) => {
    setAppIconState(newIcon);
    try { await AsyncStorage.setItem(STORAGE_KEYS.APP_ICON, newIcon); } catch {}
  };

  const languageOptions: Language[] = ['es','en','fr','de','it','pt','zh','ja'];
  const themeOptions: ThemeName[] = ['system','light','dark','blue','green','purple','orange'];

  return (
    <SettingsContext.Provider value={{
      theme,
      language,
      appIcon,
      resolvedTheme,
      colors,
      t,
      setTheme,
      setLanguage,
      setAppIcon,
      languageOptions,
      themeOptions,
      isLoading,
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};

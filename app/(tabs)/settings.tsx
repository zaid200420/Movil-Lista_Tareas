import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity, Alert,
  ScrollView, Modal, ActionSheetIOS, Platform, Image
} from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { MaterialCommunityIcons, Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useAuth } from '../../src/context/AuthContext';
import { useTodo } from '../../src/context/TodoContext';
import { useSettings, APP_ICONS } from '../../src/context/SettingsContext';
import { ThemeName } from '../../src/constants/themes';
import { Language } from '../../src/constants/translations';

const LANGUAGE_DISPLAY: Record<Language, { label: string; flag: string; native: string }> = {
  es: { label: 'Español',  flag: '🇪🇸', native: 'Español' },
  en: { label: 'English',  flag: '🇺🇸', native: 'English' },
  fr: { label: 'Français', flag: '🇫🇷', native: 'Français' },
  de: { label: 'Deutsch',  flag: '🇩🇪', native: 'Deutsch' },
  it: { label: 'Italiano', flag: '🇮🇹', native: 'Italiano' },
  pt: { label: 'Português',flag: '🇧🇷', native: 'Português' },
  zh: { label: '中文',     flag: '🇨🇳', native: '中文' },
  ja: { label: '日本語',   flag: '🇯🇵', native: '日本語' },
};

const THEME_DISPLAY: { id: ThemeName; icon: string; color: string }[] = [
  { id: 'system', icon: '💻', color: '#9CA3AF' },
  { id: 'light',  icon: '☀️', color: '#F59E0B' },
  { id: 'dark',   icon: '🌙', color: '#1F2937' },
  { id: 'blue',   icon: '🔷', color: '#3B82F6' },
  { id: 'green',  icon: '🌿', color: '#10B981' },
  { id: 'purple', icon: '💜', color: '#8B5CF6' },
  { id: 'orange', icon: '🍊', color: '#F97316' },
];

type ModalType = null | 'theme' | 'language' | 'appIcon' | 'photo';

export default function Settings() {
  const router = useRouter();
  const {
    currentUser, logout, takeProfilePhoto, pickProfilePhotoFromGallery, removeProfilePhoto,
  } = useAuth();
  const { todos, isSyncing } = useTodo();
  const {
    colors, t, language, theme, appIcon,
    setLanguage, setTheme, setAppIcon,
    languageOptions, themeOptions,
  } = useSettings();

  const [modalType, setModalType] = useState<ModalType>(null);
  const [selectedPhoto, setSelectedPhoto] = useState<string | null>(currentUser?.photoUrl ?? null);

  const closeModal = () => setModalType(null);

  const handleLogout = async () => {
    await logout();
    router.replace('/login');
  };

  const handleProfilePhoto = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [
            t.cancel,
            t.takePhotoBtn,
            t.chooseFromGalleryBtn,
            ...(selectedPhoto ? [t.removePhotoBtn] : []),
          ],
          cancelButtonIndex: 0,
          destructiveButtonIndex: selectedPhoto ? 3 : -1,
          title: t.selectPhotoTitle,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            const uri = await takeProfilePhoto();
            if (uri) setSelectedPhoto(uri);
          } else if (buttonIndex === 2) {
            const uri = await pickProfilePhotoFromGallery();
            if (uri) setSelectedPhoto(uri);
          } else if (buttonIndex === 3 && selectedPhoto) {
            await removeProfilePhoto();
            setSelectedPhoto(null);
          }
        },
      );
    } else {
      setModalType('photo');
    }
  };

  const renderAvatar = () => (
    <TouchableOpacity onPress={handleProfilePhoto} activeOpacity={0.8} style={styles.avatarWrapper}>
      <View style={[styles.avatarOuter, { borderColor: colors.primary, backgroundColor: colors.card }]}>
        {selectedPhoto ? (
          <Image source={{ uri: selectedPhoto }} style={styles.avatarImage} />
        ) : (
          <View style={[styles.avatarPlaceholder, { backgroundColor: colors.primaryLight }]}>
            <MaterialCommunityIcons name="account" size={52} color={colors.primary} />
          </View>
        )}
        <View style={[styles.avatarBadge, { backgroundColor: colors.primary, borderColor: colors.card }]}>
          <Ionicons name="camera" size={14} color="#fff" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const themeLabelFor = (th: ThemeName): string => {
    const map: Record<ThemeName, keyof typeof t> = {
      system: 'themeSystem', light: 'themeLight', dark: 'themeDark',
      blue: 'themeBlue', green: 'themeGreen', purple: 'themePurple', orange: 'themeOrange',
    };
    return (t[map[th]] as string) ?? th;
  };

  const renderSettingRow = (
    icon: string,
    title: string,
    value: string,
    onPress: () => void,
    extra?: React.ReactNode,
  ) => (
    <TouchableOpacity
      style={[styles.row, { backgroundColor: colors.card, borderBottomColor: colors.border }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.rowIconBox, { backgroundColor: colors.primaryLight }]}>
        <Ionicons name={icon as any} size={20} color={colors.primary} />
      </View>
      <View style={styles.rowContent}>
        <Text style={[styles.rowTitle, { color: colors.text }]}>{title}</Text>
        <Text style={[styles.rowValue, { color: colors.textSecondary }]} numberOfLines={1}>
          {value}
        </Text>
      </View>
      {extra}
      <Ionicons name="chevron-forward" size={20} color={colors.textSecondary} />
    </TouchableOpacity>
  );

  const renderSection = (title: string, children: React.ReactNode) => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: colors.textSecondary }]}>{title}</Text>
      <View style={[styles.sectionCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {children}
      </View>
    </View>
  );

  const selectedThemeObj = THEME_DISPLAY.find(x => x.id === theme) ?? THEME_DISPLAY[0];
  const selectedLang = LANGUAGE_DISPLAY[language];
  const selectedAppIcon = APP_ICONS.find(i => i.id === appIcon) ?? APP_ICONS[0];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.background }]} edges={['top']}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: 60 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <Text style={[styles.headerTitle, { color: '#fff' }]}>{t.settingsTitle}</Text>
        </View>

        <View style={[styles.profileHeader, { backgroundColor: colors.card }]}>
          {renderAvatar()}
          <Text style={[styles.userName, { color: colors.text }]}>{currentUser?.name ?? 'Usuario'}</Text>
          <Text style={[styles.userSub, { color: colors.textSecondary }]}>
            {currentUser?.email ?? currentUser?.username}
          </Text>
          <View style={styles.profileActions}>
            <TouchableOpacity
              style={[styles.outlineBtn, { borderColor: colors.primary }]}
              onPress={handleProfilePhoto}
            >
              <Ionicons name="image" size={16} color={colors.primary} />
              <Text style={[styles.outlineBtnText, { color: colors.primary }]}>{t.changePhotoBtn}</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <MaterialCommunityIcons name="clipboard-list-outline" size={26} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>{todos.length}</Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>{t.statsMyTasks}</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Ionicons name={isSyncing ? 'sync' : 'cloud-done'} size={26} color={colors.primary} />
            <Text style={[styles.statValue, { color: colors.text }]}>
              {isSyncing ? '…' : '✓'}
            </Text>
            <Text style={[styles.statLabel, { color: colors.textSecondary }]}>
              {isSyncing ? t.statsSyncInProgress : t.statsSyncAuto}
            </Text>
          </View>
        </View>

        {renderSection(
          t.appearanceSection,
          <>
            {renderSettingRow(
              'color-palette-outline',
              t.themeLabel,
              `${selectedThemeObj.icon}  ${themeLabelFor(theme)}`,
              () => setModalType('theme'),
              <View style={[styles.colorDotPreview, { backgroundColor: selectedThemeObj.color }]} />,
            )}
            {renderSettingRow(
              'language-outline',
              t.appLanguageLabel,
              `${selectedLang.flag}  ${selectedLang.native}`,
              () => setModalType('language'),
            )}
            {renderSettingRow(
              'apps-outline',
              t.appIconLabel,
              `${selectedAppIcon.icon}  ${t[selectedAppIcon.labelKey] as string}`,
              () => setModalType('appIcon'),
              <View
                style={[
                  styles.appIconPreview,
                  { backgroundColor: selectedAppIcon.bgColor },
                ]}
              >
                <Text style={{ fontSize: 14 }}>{selectedAppIcon.icon}</Text>
              </View>,
            )}
          </>,
        )}

        {renderSection(
          t.profileSection,
          renderSettingRow(
            'person-circle-outline',
            t.profilePhotoLabel,
            selectedPhoto ? '✓' : t.chooseFromGalleryBtn,
            handleProfilePhoto,
            selectedPhoto ? (
              <Image source={{ uri: selectedPhoto }} style={styles.photoThumb} />
            ) : (
              <View style={[styles.photoThumbPlaceholder, { backgroundColor: colors.primaryLight }]}>
                <Ionicons name="image" size={16} color={colors.primary} />
              </View>
            ),
          ),
        )}

        <View style={styles.section}>
          <TouchableOpacity
            style={[styles.logoutBtn, { backgroundColor: '#EF4444' }]}
            onPress={() =>
              Alert.alert(t.logoutBtn, '¿Estás seguro de que deseas cerrar sesión?', [
                { text: t.cancel, style: 'cancel' },
                { text: t.logoutBtn, style: 'destructive', onPress: handleLogout },
              ])
            }
          >
            <MaterialCommunityIcons name="logout" size={20} color="#fff" />
            <Text style={styles.logoutText}>{t.logoutBtn}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.helpBtn}
            onPress={() => Alert.alert('Perfil', t.profileDetailsBtn + `\n\nID: ${currentUser?.id ?? '—'}\nRol: ${currentUser?.role ?? '—'}`)}
          >
            <Text style={[styles.helpText, { color: colors.primary }]}>{t.profileDetailsBtn}</Text>
          </TouchableOpacity>

          <View style={styles.versionContainer}>
            <MaterialCommunityIcons name="information-outline" size={16} color={colors.textSecondary} />
            <Text style={[styles.versionText, { color: colors.textSecondary }]}>
              {t.appName} · Versión {Constants.expoConfig?.version ?? '1.0'}
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={modalType !== null}
        transparent
        animationType="slide"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalCard, { backgroundColor: colors.card }]}>
            <View style={styles.modalHeader}>
              <Text style={[styles.modalTitle, { color: colors.text }]}>
                {modalType === 'theme' ? t.selectTheme :
                 modalType === 'language' ? t.selectLanguage :
                 modalType === 'appIcon' ? t.selectAppIcon :
                 t.selectPhotoTitle}
              </Text>
              <TouchableOpacity onPress={closeModal} hitSlop={10}>
                <Ionicons name="close" size={24} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {modalType === 'theme' && (
              <View style={styles.optionsGrid}>
                {themeOptions.map((th) => {
                  const obj = THEME_DISPLAY.find(x => x.id === th)!;
                  const selected = th === theme;
                  return (
                    <TouchableOpacity
                      key={th}
                      style={[
                        styles.themeChip,
                        { backgroundColor: colors.background, borderColor: selected ? colors.primary : colors.border },
                        selected && { borderWidth: 2 },
                      ]}
                      onPress={async () => { await setTheme(th); closeModal(); }}
                    >
                      <View style={[styles.themeSwatch, { backgroundColor: obj.color }]}>
                        <Text style={{ fontSize: 16 }}>{obj.icon}</Text>
                      </View>
                      <Text style={[styles.themeChipLabel, { color: colors.text }]}>{themeLabelFor(th)}</Text>
                      {selected && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {modalType === 'language' && (
              <View style={styles.optionsList}>
                {languageOptions.map((lang) => {
                  const info = LANGUAGE_DISPLAY[lang];
                  const selected = lang === language;
                  return (
                    <TouchableOpacity
                      key={lang}
                      style={[
                        styles.optionRow,
                        { borderBottomColor: colors.border },
                      ]}
                      onPress={async () => { await setLanguage(lang); closeModal(); }}
                    >
                      <Text style={styles.langFlag}>{info.flag}</Text>
                      <View style={{ flex: 1 }}>
                        <Text style={[styles.optionRowTitle, { color: colors.text }]}>{info.native}</Text>
                        <Text style={[styles.optionRowSub, { color: colors.textSecondary }]}>{info.label}</Text>
                      </View>
                      {selected && <Ionicons name="checkmark" size={22} color={colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {modalType === 'appIcon' && (
              <View style={styles.optionsGrid}>
                {APP_ICONS.map((ic) => {
                  const selected = ic.id === appIcon;
                  return (
                    <TouchableOpacity
                      key={ic.id}
                      style={[
                        styles.themeChip,
                        { backgroundColor: colors.background, borderColor: selected ? colors.primary : colors.border },
                        selected && { borderWidth: 2 },
                      ]}
                      onPress={async () => { await setAppIcon(ic.id); closeModal(); }}
                    >
                      <View style={[styles.themeSwatch, { backgroundColor: ic.bgColor }]}>
                        <Text style={{ fontSize: 18 }}>{ic.icon}</Text>
                      </View>
                      <Text style={[styles.themeChipLabel, { color: colors.text }]}>
                        {t[ic.labelKey] as string}
                      </Text>
                      {selected && <Ionicons name="checkmark-circle" size={18} color={colors.primary} />}
                    </TouchableOpacity>
                  );
                })}
              </View>
            )}

            {modalType === 'photo' && (
              <View style={styles.photoActions}>
                <TouchableOpacity
                  style={[styles.photoActionBtn, { backgroundColor: colors.primaryLight }]}
                  onPress={async () => {
                    const uri = await takeProfilePhoto();
                    if (uri) setSelectedPhoto(uri);
                    closeModal();
                  }}
                >
                  <Ionicons name="camera" size={28} color={colors.primary} />
                  <Text style={[styles.photoActionText, { color: colors.text }]}>{t.takePhotoBtn}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.photoActionBtn, { backgroundColor: colors.primaryLight }]}
                  onPress={async () => {
                    const uri = await pickProfilePhotoFromGallery();
                    if (uri) setSelectedPhoto(uri);
                    closeModal();
                  }}
                >
                  <Ionicons name="images" size={28} color={colors.primary} />
                  <Text style={[styles.photoActionText, { color: colors.text }]}>{t.chooseFromGalleryBtn}</Text>
                </TouchableOpacity>
                {selectedPhoto && (
                  <TouchableOpacity
                    style={[styles.photoActionBtn, { backgroundColor: '#FEE2E2' }]}
                    onPress={async () => {
                      await removeProfilePhoto();
                      setSelectedPhoto(null);
                      closeModal();
                    }}
                  >
                    <Ionicons name="trash" size={28} color="#EF4444" />
                    <Text style={[styles.photoActionText, { color: '#B91C1C' }]}>{t.removePhotoBtn}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  scroll: { flex: 1 },
  scrollContent: { paddingTop: 0 },
  header: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 70,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  profileHeader: {
    marginTop: -50,
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 18,
    elevation: 4,
  },
  avatarWrapper: { alignItems: 'center', justifyContent: 'center' },
  avatarOuter: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  avatarImage: { width: 88, height: 88, borderRadius: 44 },
  avatarPlaceholder: {
    width: 88,
    height: 88,
    borderRadius: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarBadge: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 3,
    alignItems: 'center',
    justifyContent: 'center',
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 8,
  },
  userSub: { fontSize: 14 },
  profileActions: { flexDirection: 'row', gap: 10, marginTop: 6 },
  outlineBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1.3,
  },
  outlineBtnText: { fontWeight: '700', fontSize: 13 },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    marginTop: 16,
  },
  statCard: {
    flex: 1,
    borderRadius: 16,
    padding: 14,
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
  },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12, textAlign: 'center' },
  section: { paddingHorizontal: 16, marginTop: 20 },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: 8,
    marginLeft: 4,
  },
  sectionCard: {
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowContent: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 15, fontWeight: '600' },
  rowValue: { fontSize: 13 },
  colorDotPreview: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 4,
  },
  appIconPreview: {
    width: 26,
    height: 26,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  photoThumb: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 2,
  },
  photoThumbPlaceholder: {
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 16,
    borderRadius: 16,
    marginTop: 8,
  },
  logoutText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  helpBtn: { marginTop: 14, alignItems: 'center' },
  helpText: { fontSize: 14, textDecorationLine: 'underline', fontWeight: '600' },
  versionContainer: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  versionText: { fontSize: 12, fontWeight: '600', opacity: 0.85 },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.45)',
    justifyContent: 'flex-end',
  },
  modalCard: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 34,
    maxHeight: '80%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: { fontSize: 18, fontWeight: '800' },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  themeChip: {
    width: '30%',
    alignItems: 'center',
    padding: 10,
    borderRadius: 14,
    borderWidth: 1,
    gap: 6,
  },
  themeSwatch: {
    width: 46,
    height: 46,
    borderRadius: 23,
    alignItems: 'center',
    justifyContent: 'center',
  },
  themeChipLabel: { fontSize: 12, fontWeight: '600', textAlign: 'center' },
  optionsList: { gap: 0 },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  langFlag: { fontSize: 24, width: 40, textAlign: 'center' },
  optionRowTitle: { fontSize: 15, fontWeight: '700' },
  optionRowSub: { fontSize: 12 },
  photoActions: {
    flexDirection: 'column',
    gap: 12,
  },
  photoActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 14,
  },
  photoActionText: { fontSize: 16, fontWeight: '700' },
});

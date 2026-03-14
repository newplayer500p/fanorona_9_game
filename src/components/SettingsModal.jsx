import Ionicons from '@expo/vector-icons/Ionicons';
import {
    Modal,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { FIRST_MOVER_AI, FIRST_MOVER_HUMAN } from '../constants';
import { THEMES, THEME_KEYS } from '../themes';

function OptionButton({ label, icon, isSelected, onPress, theme }) {
  return (
    <TouchableOpacity
      style={[
        styles.optionButton,
        {
          backgroundColor: isSelected
            ? theme.selectedOptionBackground
            : theme.unselectedOptionBackground,
          borderColor: isSelected
            ? theme.selectedOptionBorderColor
            : theme.unselectedOptionBorderColor,
        },
      ]}
      onPress={onPress}
    >
      <Ionicons
        name={icon}
        size={20}
        color={isSelected ? theme.selectedOptionBorderColor : theme.optionTextColor}
      />
      <Text style={[styles.optionLabel, { color: theme.optionTextColor }]}>{label}</Text>
      {isSelected && (
        <Ionicons name="checkmark-circle" size={16} color={theme.selectedOptionBorderColor} />
      )}
    </TouchableOpacity>
  );
}

export default function SettingsModal({
  visible,
  activeTheme,
  firstMover,
  onThemeChange,
  onFirstMoverChange,
  onClose,
}) {
  const theme = THEMES[activeTheme];

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <SafeAreaView style={[
          styles.panel,
          { backgroundColor: theme.settingsBackground, borderColor: theme.settingsBorderColor }
        ]}>
          <View style={[styles.header, { borderBottomColor: theme.settingsBorderColor }]}>
            <Ionicons name="settings-outline" size={20} color={theme.headerTitleColor} />
            <Text style={[styles.headerTitle, { color: theme.headerTitleColor }]}>Reglages</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={22} color={theme.headerTitleColor} />
            </TouchableOpacity>
          </View>

          <ScrollView contentContainerStyle={styles.scrollContent}>
            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="color-palette-outline" size={16} color={theme.scoreLabelColor} />
                <Text style={[styles.sectionTitle, { color: theme.scoreLabelColor }]}>Theme</Text>
              </View>
              {THEME_KEYS.map((key) => (
                <OptionButton
                  key={key}
                  label={THEMES[key].label}
                  icon="contrast-outline"
                  isSelected={activeTheme === key}
                  onPress={() => onThemeChange(key)}
                  theme={theme}
                />
              ))}
            </View>

            <View style={[styles.divider, { backgroundColor: theme.settingsBorderColor }]} />

            <View style={styles.section}>
              <View style={styles.sectionTitleRow}>
                <Ionicons name="play-circle-outline" size={16} color={theme.scoreLabelColor} />
                <Text style={[styles.sectionTitle, { color: theme.scoreLabelColor }]}>
                  Premier joueur (mode vs IA)
                </Text>
              </View>
              <OptionButton
                label="Humain commence"
                icon="person-outline"
                isSelected={firstMover === FIRST_MOVER_HUMAN}
                onPress={() => onFirstMoverChange(FIRST_MOVER_HUMAN)}
                theme={theme}
              />
              <OptionButton
                label="IA commence"
                icon="hardware-chip-outline"
                isSelected={firstMover === FIRST_MOVER_AI}
                onPress={() => onFirstMoverChange(FIRST_MOVER_AI)}
                theme={theme}
              />
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.6)',
  },
  panel: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    borderTopWidth: 1,
    borderLeftWidth: 1,
    borderRightWidth: 1,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  closeButton: {
    padding: 4,
  },
  scrollContent: {
    padding: 20,
    gap: 8,
  },
  section: {
    gap: 8,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
  },
  optionLabel: {
    flex: 1,
    fontSize: 15,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});
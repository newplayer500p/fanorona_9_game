import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  Switch,
  ScrollView,
  StyleSheet,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { THEMES, THEME_KEYS } from '../themes';
import { FIRST_MOVER_HUMAN, FIRST_MOVER_AI } from '../constants';

function SectionTitle({ icon, label, theme }) {
  return (
    <View style={styles.sectionTitleRow}>
      <Ionicons name={icon} size={16} color={theme.scoreLabelColor} />
      <Text style={[styles.sectionTitle, { color: theme.scoreLabelColor }]}>{label}</Text>
    </View>
  );
}

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

function RuleToggle({ label, description, value, onToggle, theme }) {
  return (
    <View style={[styles.ruleRow, { backgroundColor: theme.unselectedOptionBackground, borderColor: theme.unselectedOptionBorderColor }]}>
      <View style={styles.ruleLabelGroup}>
        <Text style={[styles.ruleLabel, { color: theme.optionTextColor }]}>{label}</Text>
        {description ? (
          <Text style={[styles.ruleDescription, { color: theme.scoreLabelColor }]}>{description}</Text>
        ) : null}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: theme.unselectedOptionBorderColor, true: theme.selectedOptionBorderColor }}
        thumbColor={value ? theme.selectedOptionBorderColor : theme.optionTextColor}
      />
    </View>
  );
}

export default function SettingsModal({
  visible,
  activeTheme,
  firstMover,
  gameRules,
  onThemeChange,
  onFirstMoverChange,
  onRulesChange,
  onClose,
}) {
  const theme = THEMES[activeTheme];

  const toggleRule = (key) => {
    onRulesChange({ ...gameRules, [key]: !gameRules[key] });
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.overlay}>
        <View style={[
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
              <SectionTitle icon="book-outline" label="Regles du jeu" theme={theme} />

              <RuleToggle
                label="Capture obligatoire"
                description="Tsy akanda homana — si desactive, le paika est toujours autorise"
                value={gameRules.captureIsMandatory}
                onToggle={() => toggleRule('captureIsMandatory')}
                theme={theme}
              />

              <RuleToggle
                label="Continuation obligatoire"
                description="Apres une capture, doit continuer si possible"
                value={gameRules.continuationIsMandatory}
                onToggle={() => toggleRule('continuationIsMandatory')}
                theme={theme}
              />

              <RuleToggle
                label="Paika interdit apres capture"
                description="Ne peut pas faire un deplacement simple le tour suivant une capture"
                value={gameRules.paikaForbiddenAfterCapture}
                onToggle={() => toggleRule('paikaForbiddenAfterCapture')}
                theme={theme}
              />
            </View>

            <View style={[styles.divider, { backgroundColor: theme.settingsBorderColor }]} />

            <View style={styles.section}>
              <SectionTitle icon="color-palette-outline" label="Theme" theme={theme} />
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
              <SectionTitle icon="play-circle-outline" label="Premier joueur (vs IA)" theme={theme} />
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
        </View>
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
    maxHeight: '85%',
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
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    gap: 12,
  },
  ruleLabelGroup: {
    flex: 1,
    gap: 2,
  },
  ruleLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  ruleDescription: {
    fontSize: 11,
    lineHeight: 15,
  },
  divider: {
    height: 1,
    marginVertical: 8,
  },
});
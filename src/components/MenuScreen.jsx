import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import SettingsModal from './SettingsModal';

export default function MenuScreen({
  activeTheme,
  firstMover,
  onStartHvH,
  onStartHvA,
  onThemeChange,
  onFirstMoverChange,
  theme,
}) {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.cardBorderColor }]}>

          <View style={styles.titleRow}>
            <Ionicons name="grid-outline" size={28} color={theme.titleColor} />
            <TouchableOpacity
              style={styles.settingsButton}
              onPress={() => setSettingsVisible(true)}
            >
              <Ionicons name="settings-outline" size={22} color={theme.subtitleColor} />
            </TouchableOpacity>
          </View>

          <Text style={[styles.gameTitle, { color: theme.titleColor }]}>Fanorona Tsivy</Text>
          <Text style={[styles.tagline, { color: theme.subtitleColor }]}>
            Jeu traditionnel malgache  •  Plateau 9 x 5
          </Text>

          <View style={[styles.divider, { backgroundColor: theme.dividerColor }]} />

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.primaryButtonBackground }]}
            onPress={onStartHvH}
            activeOpacity={0.8}
          >
            <Ionicons name="people-outline" size={20} color={theme.primaryButtonText} />
            <Text style={[styles.buttonLabel, { color: theme.primaryButtonText }]}>
              Humain vs Humain
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.primaryButton, { backgroundColor: theme.secondaryButtonBackground }]}
            onPress={onStartHvA}
            activeOpacity={0.8}
          >
            <Ionicons name="hardware-chip-outline" size={20} color={theme.primaryButtonText} />
            <Text style={[styles.buttonLabel, { color: theme.primaryButtonText }]}>
              Humain vs IA
            </Text>
          </TouchableOpacity>

          <View style={[styles.rulesBox, { backgroundColor: theme.ruleBoxBackground }]}>
            <Text style={[styles.rulesTitle, { color: theme.titleColor }]}>Regles du jeu</Text>
            <Text style={[styles.rulesBody, { color: theme.ruleTextColor }]}>
              Deplacez vos pieces le long des lignes. Capturez les pieces adverses par{' '}
              <Text style={{ fontWeight: 'bold' }}>approche</Text> (avancer vers elles) ou par{' '}
              <Text style={{ fontWeight: 'bold' }}>retrait</Text> (s'eloigner). Toutes les pieces
              en ligne sont capturees. Une capture peut se poursuivre avec la meme piece. Le joueur
              sans pieces perd.
            </Text>
          </View>
        </View>
      </ScrollView>

      <SettingsModal
        visible={settingsVisible}
        activeTheme={activeTheme}
        firstMover={firstMover}
        onThemeChange={onThemeChange}
        onFirstMoverChange={onFirstMoverChange}
        onClose={() => setSettingsVisible(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 20,
    padding: 28,
    width: '100%',
    maxWidth: 400,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  settingsButton: {
    marginLeft: 'auto',
    padding: 4,
  },
  gameTitle: {
    fontSize: 30,
    fontWeight: 'bold',
    letterSpacing: 1,
    marginBottom: 4,
  },
  tagline: {
    fontSize: 13,
    marginBottom: 20,
  },
  divider: {
    height: 1.5,
    marginBottom: 20,
    opacity: 0.6,
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  buttonLabel: {
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  rulesBox: {
    borderRadius: 10,
    padding: 16,
    marginTop: 4,
  },
  rulesTitle: {
    fontWeight: 'bold',
    fontSize: 13,
    marginBottom: 6,
  },
  rulesBody: {
    fontSize: 13,
    lineHeight: 20,
  },
});
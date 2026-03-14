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
import BoardSvg from './BoardSvg';
import ScoreRow from './ScoreRow';
import StatusBar from './StatusBar';
import ChoiceBar from './ChoiceBar';
import SettingsModal from './SettingsModal';

export default function GameScreen({

  board,
  currentPlayer,
  gameMode,
  selectedCell,
  captureChain,
  pendingCaptureChoice,
  setPendingCaptureChoice,
  winner,
  statusMessage,
  isAiAnimating,
  aiMoveArrow,
  validDestinationSet,
  recentlyRemovedSet,
  activeTheme,
  firstMover,
  handleCellPress,
  endCurrentTurn,
  executePlayerMove,
  startNewGame,
  onThemeChange,
  onFirstMoverChange,
  onBackToMenu,
  theme,
}) {
  const [settingsVisible, setSettingsVisible] = useState(false);
  const insets = useSafeAreaInsets();

  const modeBadgeLabel = gameMode === 'hva' ? 'vs IA' : 'H vs H';

  const handleApproachChoice = () => {
    if (pendingCaptureChoice?.approach) {
      executePlayerMove(pendingCaptureChoice.approach);
      setPendingCaptureChoice(null);
    }
  };

  const handleWithdrawalChoice = () => {
    if (pendingCaptureChoice?.withdrawal) {
      executePlayerMove(pendingCaptureChoice.withdrawal);
      setPendingCaptureChoice(null);
    }
  };

  const handleCancelChoice = () => setPendingCaptureChoice(null);

  const hintText = isAiAnimating
    ? "L'IA joue..."
    : captureChain
    ? 'Cases dorees = continuation possible  •  Ailleurs ou Passer = fin du tour'
    : selectedCell
    ? 'Cases dorees = destinations valides'
    : !winner
    ? `Selectionnez une piece ${currentPlayer === 1 ? 'blanche' : 'noire'}`
    : '';

  return (
    <View style={[styles.screen, { backgroundColor: theme.background, paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity
          style={[styles.headerButton, { borderColor: theme.backButtonBorderColor }]}
          onPress={onBackToMenu}
        >
          <Ionicons name="chevron-back" size={16} color={theme.backButtonTextColor} />
          <Text style={[styles.headerButtonText, { color: theme.backButtonTextColor }]}>Menu</Text>
        </TouchableOpacity>

        <Text style={[styles.headerTitle, { color: theme.headerTitleColor }]}>Fanorona Tsivy</Text>

        <View style={styles.headerRightGroup}>
          <View style={[styles.modeBadge, { backgroundColor: theme.modeBadgeBackground, borderColor: theme.modeBadgeBackground }]}>
            <Text style={[styles.modeBadgeText, { color: theme.modeBadgeTextColor }]}>
              {modeBadgeLabel}
            </Text>
          </View>
          <TouchableOpacity
            style={[styles.headerButton, { borderColor: theme.backButtonBorderColor }]}
            onPress={() => setSettingsVisible(true)}
          >
            <Ionicons name="settings-outline" size={16} color={theme.backButtonTextColor} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentInsetAdjustmentBehavior="automatic"
      >
        <ScoreRow
          board={board}
          currentPlayer={currentPlayer}
          winner={winner}
          gameMode={gameMode}
          theme={theme}
        />

        <StatusBar
          winner={winner}
          currentPlayer={currentPlayer}
          captureChain={captureChain}
          isAiAnimating={isAiAnimating}
          statusMessage={statusMessage}
          gameMode={gameMode}
          theme={theme}
          onPassTurn={endCurrentTurn}
          onRematch={() => startNewGame(gameMode)}
        />

        <ChoiceBar
          pendingCaptureChoice={pendingCaptureChoice}
          onApproach={handleApproachChoice}
          onWithdrawal={handleWithdrawalChoice}
          onCancel={handleCancelChoice}
          theme={theme}
        />

        <BoardSvg
          board={board}
          selectedCell={selectedCell}
          validDestinationSet={validDestinationSet}
          recentlyRemovedSet={recentlyRemovedSet}
          aiMoveArrow={aiMoveArrow}
          isAiAnimating={isAiAnimating}
          handleCellPress={handleCellPress}
          theme={theme}
        />

        {hintText ? (
          <Text style={[styles.hintText, { color: theme.hintTextColor }]}>{hintText}</Text>
        ) : null}
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  headerButtonText: {
    fontSize: 13,
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  headerRightGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  modeBadge: {
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  modeBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  hintText: {
    fontSize: 12,
    marginTop: 10,
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 18,
  },
});
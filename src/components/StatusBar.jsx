import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { GAME_MODE_HVA, WHITE } from '../constants';

const playerLabel = (player, gameMode) => {
  if (player === WHITE) return 'Blanc';
  return gameMode === GAME_MODE_HVA ? 'IA' : 'Noir';
};

export default function StatusBar({
  winner,
  currentPlayer,
  captureChain,
  isAiAnimating,
  statusMessage,
  gameMode,
  theme,
  onPassTurn,
  onRematch,
}) {
  if (winner) {
    return (
      <View style={[styles.winBanner, { backgroundColor: theme.winBackground, borderColor: theme.winBorderColor }]}>
        <Ionicons name="trophy-outline" size={22} color={theme.winTextColor} />
        <Text style={[styles.winText, { color: theme.winTextColor }]}>
          {playerLabel(winner, gameMode)} gagne !
        </Text>
        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: theme.primaryButtonBackground }]}
          onPress={onRematch}
        >
          <Ionicons name="refresh-outline" size={14} color={theme.primaryButtonText} />
          <Text style={[styles.smallButtonText, { color: theme.primaryButtonText }]}>Rejouer</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const displayMessage =
    statusMessage ||
    (captureChain
      ? `${playerLabel(currentPlayer, gameMode)} — Continuer ou Passer`
      : `Tour : ${playerLabel(currentPlayer, gameMode)}`);

  return (
    <View style={[styles.statusBar, { backgroundColor: theme.statusBackground }]}>
      <Text style={[styles.statusText, { color: theme.statusTextColor }]} numberOfLines={2}>
        {displayMessage}
      </Text>
      {captureChain && !isAiAnimating && (
        <TouchableOpacity
          style={[styles.smallButton, { backgroundColor: theme.primaryButtonBackground }]}
          onPress={onPassTurn}
        >
          <Ionicons name="play-skip-forward-outline" size={14} color={theme.primaryButtonText} />
          <Text style={[styles.smallButtonText, { color: theme.primaryButtonText }]}>Passer</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
    width: '100%',
  },
  statusText: {
    flex: 1,
    fontSize: 14,
  },
  winBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 8,
    width: '100%',
  },
  winText: {
    flex: 1,
    fontWeight: 'bold',
    fontSize: 17,
  },
  smallButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  smallButtonText: {
    fontSize: 13,
    fontWeight: '500',
  },
});
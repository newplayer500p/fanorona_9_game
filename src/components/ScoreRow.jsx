import { StyleSheet, Text, View } from 'react-native';
import { countPieces } from '../boardLogic';
import { BLACK, WHITE } from '../constants';

export default function ScoreRow({ board, currentPlayer, winner, gameMode, theme }) {
  const whitePieceCount = countPieces(board, WHITE);
  const blackPieceCount = countPieces(board, BLACK);

  const isWhiteActive = currentPlayer === WHITE && !winner;
  const isBlackActive = currentPlayer === BLACK && !winner;

  const activeCardStyle = {
    backgroundColor: theme.activeCardBackground,
    borderColor: theme.activeCardBorderColor,
    borderWidth: 2,
  };

  const inactiveCardStyle = {
    backgroundColor: theme.scoreCardBackground,
    borderColor: theme.scoreCardBorderColor,
    borderWidth: 2,
  };

  return (
    <View style={styles.row}>
      <View style={[styles.card, isWhiteActive ? activeCardStyle : inactiveCardStyle]}>
        <View style={[styles.pieceIndicator, { backgroundColor: '#F0EDE0', borderColor: '#999' }]} />
        <Text style={[styles.countText, { color: theme.scoreNumberColor }]}>{whitePieceCount}</Text>
        <Text style={[styles.labelText, { color: theme.scoreLabelColor }]}>Blanc</Text>
      </View>

      <Text style={[styles.vsText, { color: theme.vsTextColor }]}>VS</Text>

      <View style={[styles.card, isBlackActive ? activeCardStyle : inactiveCardStyle]}>
        <View style={[styles.pieceIndicator, { backgroundColor: '#1A1008', borderColor: '#555' }]} />
        <Text style={[styles.countText, { color: theme.scoreNumberColor }]}>{blackPieceCount}</Text>
        <Text style={[styles.labelText, { color: theme.scoreLabelColor }]}>
          {gameMode === 'hva' ? 'IA' : 'Noir'}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    marginBottom: 10,
  },
  card: {
    alignItems: 'center',
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
    minWidth: 80,
  },
  pieceIndicator: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    marginBottom: 4,
  },
  countText: {
    fontSize: 22,
    fontWeight: 'bold',
    lineHeight: 26,
  },
  labelText: {
    fontSize: 11,
    marginTop: 2,
  },
  vsText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
});
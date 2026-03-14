import GameScreen from './components/GameScreen';
import MenuScreen from './components/MenuScreen';
import { THEMES } from './themes';
import { useGameState } from './useGameState';

export default function FanoronaGame() {
  const gameState = useGameState();
  const theme = THEMES[gameState.activeTheme];

  if (gameState.activeScreen === 'menu') {
    return (
      <MenuScreen
        activeTheme={gameState.activeTheme}
        firstMover={gameState.firstMover}
        onStartHvH={() => gameState.startNewGame('hvh')}
        onStartHvA={() => gameState.startNewGame('hva')}
        onThemeChange={gameState.setActiveTheme}
        onFirstMoverChange={gameState.setFirstMover}
        theme={theme}
      />
    );
  }

  return (
    <GameScreen
      board={gameState.board}
      currentPlayer={gameState.currentPlayer}
      gameMode={gameState.gameMode}
      selectedCell={gameState.selectedCell}
      captureChain={gameState.captureChain}
      pendingCaptureChoice={gameState.pendingCaptureChoice}
      setPendingCaptureChoice={gameState.setPendingCaptureChoice}
      winner={gameState.winner}
      statusMessage={gameState.statusMessage}
      isAiAnimating={gameState.isAiAnimating}
      aiMoveArrow={gameState.aiMoveArrow}
      validDestinationSet={gameState.validDestinationSet}
      recentlyRemovedSet={gameState.recentlyRemovedSet}
      activeTheme={gameState.activeTheme}
      firstMover={gameState.firstMover}
      handleCellPress={gameState.handleCellPress}
      endCurrentTurn={gameState.endCurrentTurn}
      executePlayerMove={gameState.executePlayerMove}
      startNewGame={gameState.startNewGame}
      onThemeChange={gameState.setActiveTheme}
      onFirstMoverChange={gameState.setFirstMover}
      onBackToMenu={() => gameState.setActiveScreen('menu')}
      theme={theme}
    />
  );
}
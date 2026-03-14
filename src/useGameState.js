import { useState, useEffect, useRef } from 'react';
import { WHITE, BLACK, GAME_MODE_HVA, FIRST_MOVER_HUMAN, DEFAULT_RULES } from './constants';
import { initBoard, generateMoves, getContinuations, applyMove, countPieces, opponent } from './boardLogic';
import { calculateAITurnSequence } from './aiEngine';

export const useGameState = () => {
  const [activeScreen, setActiveScreen] = useState('menu');
  const [gameMode, setGameMode] = useState('hvh');
  const [firstMover, setFirstMover] = useState(FIRST_MOVER_HUMAN);
  const [activeTheme, setActiveTheme] = useState('wood');
  const [gameRules, setGameRules] = useState(DEFAULT_RULES);

  const [board, setBoard] = useState(initBoard);
  const [currentPlayer, setCurrentPlayer] = useState(WHITE);
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedPieceMoves, setSelectedPieceMoves] = useState([]);
  const [captureChain, setCaptureChain] = useState(null);
  const [lastCaptureWasMade, setLastCaptureWasMade] = useState(false);
  const [pendingCaptureChoice, setPendingCaptureChoice] = useState(null);
  const [winner, setWinner] = useState(null);
  const [statusMessage, setStatusMessage] = useState('');
  const [recentlyRemovedPieces, setRecentlyRemovedPieces] = useState([]);

  const [isAiAnimating, setIsAiAnimating] = useState(false);
  const [aiMoveArrow, setAiMoveArrow] = useState(null);
  const activeTimeoutRef = useRef(null);

  const humanPlayer = firstMover === FIRST_MOVER_HUMAN ? WHITE : BLACK;
  const aiPlayer = firstMover === FIRST_MOVER_HUMAN ? BLACK : WHITE;
  const isAiTurn = activeScreen === 'game' && gameMode === GAME_MODE_HVA && currentPlayer === aiPlayer;

  const allValidMoves = activeScreen === 'game' && !winner
    ? generateMoves(board, currentPlayer, gameRules)
    : [];

  useEffect(() => {
    if (activeScreen !== 'game') return;
    const whiteCount = countPieces(board, WHITE);
    const blackCount = countPieces(board, BLACK);
    if (whiteCount === 0) setWinner(BLACK);
    else if (blackCount === 0) setWinner(WHITE);
    else {
      const remainingMoves = generateMoves(board, currentPlayer, gameRules);
      if (!remainingMoves.length) setWinner(opponent(currentPlayer));
    }
  }, [board, currentPlayer, activeScreen]);

  useEffect(() => {
    if (!isAiTurn || winner || isAiAnimating) return;

    setIsAiAnimating(true);
    setStatusMessage('IA en train de reflechir...');

    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }

    const thinkingDelay = setTimeout(() => {
      const moveSequence = calculateAITurnSequence(board, aiPlayer);

      if (!moveSequence.length) {
        setStatusMessage('');
        setIsAiAnimating(false);
        setCurrentPlayer(humanPlayer);
        return;
      }

      let workingBoard = board;
      let moveIndex = 0;

      const playNextMoveInSequence = () => {
        if (moveIndex >= moveSequence.length) {
          setAiMoveArrow(null);
          setStatusMessage('');
          setIsAiAnimating(false);
          setCurrentPlayer(humanPlayer);
          return;
        }

        const move = moveSequence[moveIndex];
        setAiMoveArrow({ fr: move.fr, fc: move.fc, tr: move.tr, tc: move.tc });

        const moveTypeLabel =
          move.type === 'approach' ? 'Approche'
          : move.type === 'withdrawal' ? 'Retrait'
          : 'Deplacement';

        setStatusMessage(
          `IA: ${moveTypeLabel}${move.captures.length ? ` (${move.captures.length} captures)` : ''}`
        );

        activeTimeoutRef.current = setTimeout(() => {
          workingBoard = applyMove(workingBoard, move);
          setBoard(workingBoard);
          setRecentlyRemovedPieces(move.captures);

          activeTimeoutRef.current = setTimeout(() => {
            setRecentlyRemovedPieces([]);
            moveIndex++;
            activeTimeoutRef.current = setTimeout(playNextMoveInSequence, 200);
          }, 400);
        }, 600);
      };

      playNextMoveInSequence();
    }, 800);

    return () => {
      clearTimeout(thinkingDelay);
      if (activeTimeoutRef.current) {
        clearTimeout(activeTimeoutRef.current);
        activeTimeoutRef.current = null;
      }
    };
  }, [isAiTurn, winner]);

  const startNewGame = (mode) => {
    if (activeTimeoutRef.current) {
      clearTimeout(activeTimeoutRef.current);
      activeTimeoutRef.current = null;
    }
    setGameMode(mode);
    setBoard(initBoard());
    setCurrentPlayer(WHITE);
    setSelectedCell(null);
    setSelectedPieceMoves([]);
    setCaptureChain(null);
    setLastCaptureWasMade(false);
    setPendingCaptureChoice(null);
    setWinner(null);
    setStatusMessage('');
    setRecentlyRemovedPieces([]);
    setIsAiAnimating(false);
    setAiMoveArrow(null);
    setActiveScreen('game');
  };

  const endCurrentTurn = () => {
    setCaptureChain(null);
    setSelectedCell(null);
    setSelectedPieceMoves([]);
    setPendingCaptureChoice(null);
    setCurrentPlayer((p) => opponent(p));
  };

  const executePlayerMove = (move) => {
    const newBoard = applyMove(board, move);
    setBoard(newBoard);
    setRecentlyRemovedPieces(move.captures);
    setTimeout(() => setRecentlyRemovedPieces([]), 500);

    const { tr, tc, dr, dc } = move;
    const didCapture = move.captures.length > 0;

    if (didCapture && gameRules.continuationIsMandatory) {
      const updatedBlockedDirs = captureChain
        ? new Set([...captureChain.blockedDirs, `${dr},${dc}`, `${-dr},${-dc}`])
        : new Set([`${dr},${dc}`, `${-dr},${-dc}`]);
      const updatedVisitedCells = captureChain
        ? new Set([...captureChain.visitedCells, `${tr},${tc}`])
        : new Set([`${tr},${tc}`]);
      const continuations = getContinuations(newBoard, tr, tc, currentPlayer, updatedBlockedDirs, updatedVisitedCells, gameRules);

      if (continuations.length > 0) {
        setCaptureChain({ row: tr, col: tc, blockedDirs: updatedBlockedDirs, visitedCells: updatedVisitedCells });
        setSelectedCell([tr, tc]);
        setSelectedPieceMoves(continuations);
        setPendingCaptureChoice(null);
        return;
      }
    }

    setLastCaptureWasMade(didCapture);
    setCaptureChain(null);
    setSelectedCell(null);
    setSelectedPieceMoves([]);
    setPendingCaptureChoice(null);
    setCurrentPlayer((p) => opponent(p));
  };

  const handleCellPress = (row, col) => {
    if (winner || isAiAnimating) return;
    if (gameMode === GAME_MODE_HVA && currentPlayer === aiPlayer) return;
    if (pendingCaptureChoice) return;

    if (captureChain) {
      const continuations = getContinuations(
        board,
        captureChain.row,
        captureChain.col,
        currentPlayer,
        captureChain.blockedDirs,
        captureChain.visitedCells,
        gameRules
      );
      const movesToTarget = continuations.filter((m) => m.tr === row && m.tc === col);

      if (movesToTarget.length === 2) {
        setPendingCaptureChoice({
          approach: movesToTarget.find((m) => m.type === 'approach'),
          withdrawal: movesToTarget.find((m) => m.type === 'withdrawal'),
        });
      } else if (movesToTarget.length === 1) {
        executePlayerMove(movesToTarget[0]);
      } else {
        endCurrentTurn();
      }
      return;
    }

    if (board[row][col] === currentPlayer) {
      const pieceMoves = allValidMoves.filter((m) => m.fr === row && m.fc === col);
      setSelectedCell([row, col]);
      setSelectedPieceMoves(pieceMoves);
      setPendingCaptureChoice(null);
      return;
    }

    if (selectedCell && board[row][col] === 0) {
      const movesToTarget = selectedPieceMoves.filter((m) => m.tr === row && m.tc === col);
      if (movesToTarget.length === 2) {
        setPendingCaptureChoice({
          approach: movesToTarget.find((m) => m.type === 'approach'),
          withdrawal: movesToTarget.find((m) => m.type === 'withdrawal'),
        });
      } else if (movesToTarget.length === 1) {
        executePlayerMove(movesToTarget[0]);
      }
    }
  };

  const validDestinationSet = new Set(
    (captureChain
      ? getContinuations(board, captureChain.row, captureChain.col, currentPlayer, captureChain.blockedDirs, captureChain.visitedCells, gameRules)
      : selectedPieceMoves
    ).map((m) => `${m.tr},${m.tc}`)
  );

  const recentlyRemovedSet = new Set(recentlyRemovedPieces.map(([r, c]) => `${r},${c}`));

  return {
    activeScreen,
    setActiveScreen,
    gameMode,
    firstMover,
    setFirstMover,
    activeTheme,
    setActiveTheme,
    gameRules,
    setGameRules,
    board,
    currentPlayer,
    humanPlayer,
    aiPlayer,
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
    startNewGame,
    endCurrentTurn,
    executePlayerMove,
    handleCellPress,
  };
};
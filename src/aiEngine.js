import { applyMove, countPieces, generateMoves, getContinuations, opponent } from './boardLogic';
import { AI_MAX_CONTINUATION_STEPS, AI_MAX_DEPTH, AI_ROOT_MOVE_LIMIT, COLS, EMPTY, ROWS } from './constants';

const buildZobristTable = () => {
  const randomInt = () => Math.floor(Math.random() * 0xffffffff);
  return Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => [0, randomInt(), randomInt()])
  );
};

const ZOBRIST_TABLE = buildZobristTable();
const transpositionCache = new Map();

const computeBoardHash = (board) => {
  let hash = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++) {
      const piece = board[r][c];
      if (piece !== EMPTY) hash ^= ZOBRIST_TABLE[r][c][piece];
    }
  return hash.toString();
};

const evaluateBoard = (board, aiPlayer) => {
  const aiPieceCount = countPieces(board, aiPlayer);
  const opponentPieceCount = countPieces(board, opponent(aiPlayer));
  let score = (aiPieceCount - opponentPieceCount) * 100;

  const centerRow = (ROWS - 1) / 2;
  const centerCol = (COLS - 1) / 2;
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const distanceFromCenter = Math.abs(r - centerRow) + Math.abs(c - centerCol);
      if (board[r][c] === aiPlayer) score += (8 - distanceFromCenter) * 2;
      if (board[r][c] === opponent(aiPlayer)) score -= (8 - distanceFromCenter) * 2;
    }
  }

  const aiMobility = generateMoves(board, aiPlayer).length;
  const opponentMobility = generateMoves(board, opponent(aiPlayer)).length;
  score += (aiMobility - opponentMobility) * 3;

  return score;
};

const negamax = (board, depth, alpha, beta, currentPlayer, aiPlayer) => {
  const cacheKey = computeBoardHash(board);
  const cached = transpositionCache.get(cacheKey);
  if (cached && cached.depth >= depth) {
    if (cached.flag === 'EXACT') return cached.value;
    if (cached.flag === 'LOWER') alpha = Math.max(alpha, cached.value);
    if (cached.flag === 'UPPER') beta = Math.min(beta, cached.value);
    if (alpha >= beta) return cached.value;
  }

  if (countPieces(board, aiPlayer) === 0) return -10000;
  if (countPieces(board, opponent(aiPlayer)) === 0) return 10000;
  if (depth === 0) return evaluateBoard(board, aiPlayer);

  const moves = generateMoves(board, currentPlayer);
  if (!moves.length) return currentPlayer === aiPlayer ? -10000 : 10000;

  const centerRow = (ROWS - 1) / 2;
  const centerCol = (COLS - 1) / 2;
  moves.sort((a, b) => {
    if (b.captures.length !== a.captures.length) return b.captures.length - a.captures.length;
    const distA = Math.abs(a.tr - centerRow) + Math.abs(a.tc - centerCol);
    const distB = Math.abs(b.tr - centerRow) + Math.abs(b.tc - centerCol);
    return distA - distB;
  });

  let bestScore = -Infinity;
  const alphaAtEntry = alpha;

  for (const move of moves) {
    const childBoard = applyMove(board, move);
    const childScore = -negamax(childBoard, depth - 1, -beta, -alpha, opponent(currentPlayer), aiPlayer);
    if (childScore > bestScore) bestScore = childScore;
    alpha = Math.max(alpha, childScore);
    if (alpha >= beta) break;
  }

  let cacheFlag = 'EXACT';
  if (bestScore <= alphaAtEntry) cacheFlag = 'UPPER';
  else if (bestScore >= beta) cacheFlag = 'LOWER';
  transpositionCache.set(cacheKey, { value: bestScore, depth, flag: cacheFlag });

  return bestScore;
};

const findBestFirstMove = (board, player) => {
  const moves = generateMoves(board, player);
  if (!moves.length) return null;

  moves.sort((a, b) => b.captures.length - a.captures.length);
  const rootMoves = moves.slice(0, AI_ROOT_MOVE_LIMIT);

  let bestMove = null;
  let bestScore = -Infinity;

  for (const move of rootMoves) {
    const childBoard = applyMove(board, move);
    const score = -negamax(childBoard, AI_MAX_DEPTH - 1, -Infinity, Infinity, opponent(player), player);
    if (score > bestScore) {
      bestScore = score;
      bestMove = move;
    }
  }
  return bestMove;
};

export const calculateAITurnSequence = (board, player) => {
  if (transpositionCache.size > 200000) transpositionCache.clear();

  const firstMove = findBestFirstMove(board, player);
  if (!firstMove) return [];

  const sequence = [firstMove];
  if (!firstMove.captures.length) return sequence;

  let workingBoard = applyMove(board, firstMove);
  let blockedDirs = new Set([`${firstMove.dr},${firstMove.dc}`, `${-firstMove.dr},${-firstMove.dc}`]);
  let visitedCells = new Set([`${firstMove.tr},${firstMove.tc}`]);
  let currentRow = firstMove.tr;
  let currentCol = firstMove.tc;

  for (let step = 0; step < AI_MAX_CONTINUATION_STEPS; step++) {
    const continuations = getContinuations(workingBoard, currentRow, currentCol, player, blockedDirs, visitedCells);
    if (!continuations.length) break;

    continuations.sort((a, b) => {
      if (b.captures.length !== a.captures.length) return b.captures.length - a.captures.length;
      const distA = Math.abs(a.tr - (ROWS - 1) / 2) + Math.abs(a.tc - (COLS - 1) / 2);
      const distB = Math.abs(b.tr - (ROWS - 1) / 2) + Math.abs(b.tc - (COLS - 1) / 2);
      return distA - distB;
    });

    const chosen = continuations[0];
    sequence.push(chosen);
    workingBoard = applyMove(workingBoard, chosen);
    blockedDirs.add(`${chosen.dr},${chosen.dc}`);
    blockedDirs.add(`${-chosen.dr},${-chosen.dc}`);
    currentRow = chosen.tr;
    currentCol = chosen.tc;
    visitedCells.add(`${currentRow},${currentCol}`);
  }

  return sequence;
};
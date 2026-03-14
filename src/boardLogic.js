import { ROWS, COLS, EMPTY, WHITE, BLACK } from './constants';

export const hasDiagonals = (row, col) => (row + col) % 2 === 0;

export const isInBounds = (row, col) =>
  row >= 0 && row < ROWS && col >= 0 && col < COLS;

export const opponent = (player) => (player === WHITE ? BLACK : WHITE);

export const getDirections = (row, col) => {
  const cardinal = [[-1, 0], [1, 0], [0, -1], [0, 1]];
  if (hasDiagonals(row, col)) {
    cardinal.push([-1, -1], [-1, 1], [1, -1], [1, 1]);
  }
  return cardinal;
};

export const cloneBoard = (board) => board.map((row) => [...row]);

export const countPieces = (board, player) => {
  let total = 0;
  for (let r = 0; r < ROWS; r++)
    for (let c = 0; c < COLS; c++)
      if (board[r][c] === player) total++;
  return total;
};

export const capturedPiecesInLine = (board, row, col, dr, dc, player) => {
  const captured = [];
  let nr = row + dr;
  let nc = col + dc;
  while (isInBounds(nr, nc) && board[nr][nc] === opponent(player)) {
    captured.push([nr, nc]);
    nr += dr;
    nc += dc;
  }
  return captured;
};

export const initBoard = () => {
  const board = Array.from({ length: ROWS }, () => Array(COLS).fill(EMPTY));
  for (let c = 0; c < COLS; c++) {
    board[0][c] = WHITE;
    board[1][c] = WHITE;
  }
  [WHITE, BLACK, WHITE, BLACK, EMPTY, BLACK, WHITE, BLACK, WHITE].forEach((value, c) => {
    board[2][c] = value;
  });
  for (let c = 0; c < COLS; c++) {
    board[3][c] = BLACK;
    board[4][c] = BLACK;
  }
  return board;
};

export const generateMoves = (board, player, rules = { captureIsMandatory: true }) => {
  const captureMoves = [];
  const paikaMoves = [];

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] !== player) continue;
      for (const [dr, dc] of getDirections(r, c)) {
        const tr = r + dr;
        const tc = c + dc;
        if (!isInBounds(tr, tc) || board[tr][tc] !== EMPTY) continue;

        const approachCaptures = capturedPiecesInLine(board, tr, tc, dr, dc, player);
        const withdrawCaptures = capturedPiecesInLine(board, r, c, -dr, -dc, player);

        if (approachCaptures.length) {
          captureMoves.push({ fr: r, fc: c, tr, tc, dr, dc, type: 'approach', captures: approachCaptures });
        }
        if (withdrawCaptures.length) {
          captureMoves.push({ fr: r, fc: c, tr, tc, dr, dc, type: 'withdrawal', captures: withdrawCaptures });
        }
        if (!approachCaptures.length && !withdrawCaptures.length) {
          paikaMoves.push({ fr: r, fc: c, tr, tc, dr, dc, type: 'paika', captures: [] });
        }
      }
    }
  }

  if (rules.captureIsMandatory && captureMoves.length) {
    return captureMoves;
  }
  return [...captureMoves, ...paikaMoves];
};

export const getContinuations = (board, row, col, player, blockedDirs, visitedCells, rules = { continuationIsMandatory: true }) => {
  const result = [];
  for (const [dr, dc] of getDirections(row, col)) {
    if (blockedDirs.has(`${dr},${dc}`)) continue;
    const tr = row + dr;
    const tc = col + dc;
    if (!isInBounds(tr, tc) || board[tr][tc] !== EMPTY) continue;
    if (visitedCells.has(`${tr},${tc}`)) continue;

    const approachCaptures = capturedPiecesInLine(board, tr, tc, dr, dc, player);
    const withdrawCaptures = capturedPiecesInLine(board, row, col, -dr, -dc, player);

    if (approachCaptures.length) {
      result.push({ fr: row, fc: col, tr, tc, dr, dc, type: 'approach', captures: approachCaptures });
    }
    if (withdrawCaptures.length) {
      result.push({ fr: row, fc: col, tr, tc, dr, dc, type: 'withdrawal', captures: withdrawCaptures });
    }
  }
  return result;
};

export const applyMove = (board, move) => {
  const newBoard = cloneBoard(board);
  newBoard[move.fr][move.fc] = EMPTY;
  newBoard[move.tr][move.tc] = board[move.fr][move.fc];
  for (const [cr, cc] of move.captures) newBoard[cr][cc] = EMPTY;
  return newBoard;
};
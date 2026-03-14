import React, { useEffect, useRef } from 'react';
import { Dimensions, Animated, View, Pressable } from 'react-native';
import Svg, {
  Rect,
  Line,
  Circle,
  G,
  Defs,
  RadialGradient,
  Stop,
  Marker,
  Polygon,
} from 'react-native-svg';
import { ROWS, COLS, EMPTY, WHITE, BLACK } from '../constants';
import { hasDiagonals, isInBounds, getDirections } from '../boardLogic';

const SCREEN_WIDTH = Dimensions.get('window').width;
const BOARD_HORIZONTAL_MARGIN = 16;
const CELL_SIZE = Math.floor((SCREEN_WIDTH - BOARD_HORIZONTAL_MARGIN * 2) / (COLS + 0.6));
const BOARD_PAD = Math.floor(CELL_SIZE * 0.85);
const BOARD_WIDTH = (COLS - 1) * CELL_SIZE + BOARD_PAD * 2;
const BOARD_HEIGHT = (ROWS - 1) * CELL_SIZE + BOARD_PAD * 2;
const PIECE_RADIUS = Math.floor(CELL_SIZE * 0.38);
const DOT_RADIUS = Math.max(3, Math.floor(CELL_SIZE * 0.1));

const posX = (col) => BOARD_PAD + col * CELL_SIZE;
const posY = (row) => BOARD_PAD + row * CELL_SIZE;

const buildBoardLines = () => {
  const lineElements = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      for (const [dr, dc] of getDirections(r, c)) {
        const nr = r + dr;
        const nc = c + dc;
        if (!isInBounds(nr, nc)) continue;
        if (nr < r || (nr === r && nc < c)) continue;
        lineElements.push({ r1: r, c1: c, r2: nr, c2: nc, key: `${r}-${c}-${dr}-${dc}` });
      }
    }
  }
  return lineElements;
};

const BOARD_LINES = buildBoardLines();

function PulsingCircle({ cx, cy, radius, fillColor, strokeColor }) {
  const opacity = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 500, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.5, duration: 500, useNativeDriver: true }),
      ])
    );
    animation.start();
    return () => animation.stop();
  }, []);

  return (
    <Animated.View style={{ position: 'absolute', opacity }}>
      <Svg width={BOARD_WIDTH} height={BOARD_HEIGHT} style={{ position: 'absolute' }}>
        <Circle
          cx={cx}
          cy={cy}
          r={radius}
          fill={fillColor}
          stroke={strokeColor}
          strokeWidth={2}
        />
      </Svg>
    </Animated.View>
  );
}

export default function BoardSvg({
  board,
  selectedCell,
  validDestinationSet,
  recentlyRemovedSet,
  aiMoveArrow,
  isAiAnimating,
  handleCellPress,
  theme,
}) {
  const pulsingDestinations = [];
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      if (validDestinationSet.has(`${r},${c}`)) {
        pulsingDestinations.push({ r, c, key: `dest-${r}-${c}` });
      }
    }
  }

  const handleSvgPress = (event) => {
    const { locationX, locationY } = event.nativeEvent;
    const col = Math.round((locationX - BOARD_PAD) / CELL_SIZE);
    const row = Math.round((locationY - BOARD_PAD) / CELL_SIZE);
    if (isInBounds(row, col)) {
      handleCellPress(row, col);
    }
  };

  return (
    <View style={{ width: BOARD_WIDTH, height: BOARD_HEIGHT }}>
      <Svg
        width={BOARD_WIDTH}
        height={BOARD_HEIGHT}
        style={{ borderRadius: 12 }}
      >
        <Defs>
          <RadialGradient id="boardGrad" cx="50%" cy="50%" rx="70%" ry="70%">
            <Stop offset="0%" stopColor={theme.boardGradientStart} />
            <Stop offset="100%" stopColor={theme.boardGradientEnd} />
          </RadialGradient>
          <Marker
            id="arrowTip"
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <Polygon points="0 0, 10 3, 0 6" fill={theme.aiSourceRingColor} />
          </Marker>
        </Defs>

        <Rect x={0} y={0} width={BOARD_WIDTH} height={BOARD_HEIGHT} fill="url(#boardGrad)" rx={12} />

        {BOARD_LINES.map((ln) => (
          <Line
            key={ln.key}
            x1={posX(ln.c1)} y1={posY(ln.r1)}
            x2={posX(ln.c2)} y2={posY(ln.r2)}
            stroke={theme.boardLineColor}
            strokeWidth={2}
            strokeLinecap="round"
          />
        ))}

        {aiMoveArrow && (
          <Line
            x1={posX(aiMoveArrow.fc)} y1={posY(aiMoveArrow.fr)}
            x2={posX(aiMoveArrow.tc)} y2={posY(aiMoveArrow.tr)}
            stroke={theme.aiSourceRingColor}
            strokeWidth={3}
            strokeLinecap="round"
            markerEnd="url(#arrowTip)"
          />
        )}

        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => {
            const x = posX(c);
            const y = posY(r);
            const piece = board[r][c];
            const isSelected = selectedCell && selectedCell[0] === r && selectedCell[1] === c;
            const isValidDestination = validDestinationSet.has(`${r},${c}`);
            const isCaptured = recentlyRemovedSet.has(`${r},${c}`);
            const isAiSource = aiMoveArrow && aiMoveArrow.fr === r && aiMoveArrow.fc === c;
            const isAiDest = aiMoveArrow && aiMoveArrow.tr === r && aiMoveArrow.tc === c;

            return (
              <G key={`cell-${r}-${c}`}>
                {isValidDestination && (
                  <Circle
                    cx={x} cy={y}
                    r={PIECE_RADIUS + 6}
                    fill={theme.destinationFillColor}
                    stroke={theme.destinationRingColor}
                    strokeWidth={2}
                  />
                )}

                {isAiSource && (
                  <Circle
                    cx={x} cy={y}
                    r={PIECE_RADIUS + 7}
                    fill="rgba(255,107,53,0.15)"
                    stroke={theme.aiSourceRingColor}
                    strokeWidth={2.5}
                  />
                )}

                {isAiDest && (
                  <Circle
                    cx={x} cy={y}
                    r={PIECE_RADIUS + 7}
                    fill="rgba(76,201,240,0.15)"
                    stroke={theme.aiDestRingColor}
                    strokeWidth={2.5}
                  />
                )}

                {isCaptured && (
                  <Circle cx={x} cy={y} r={PIECE_RADIUS + 2} fill={theme.captureFlashColor} />
                )}

                {piece === EMPTY && (
                  <Circle cx={x} cy={y} r={DOT_RADIUS} fill={theme.emptyDotColor} opacity={0.6} />
                )}

                {piece !== EMPTY && (
                  <>
                    <Circle
                      cx={x + 2} cy={y + 3}
                      r={PIECE_RADIUS}
                      fill="rgba(0,0,0,0.25)"
                    />
                    <Circle
                      cx={x} cy={y}
                      r={PIECE_RADIUS}
                      fill={piece === WHITE ? theme.whitePieceColor : theme.blackPieceColor}
                      stroke={
                        isSelected || isAiSource
                          ? theme.destinationRingColor
                          : piece === WHITE
                          ? theme.whitePieceStroke
                          : theme.blackPieceStroke
                      }
                      strokeWidth={isSelected || isAiSource ? 3 : 1.5}
                    />
                    <Circle
                      cx={x - PIECE_RADIUS * 0.28}
                      cy={y - PIECE_RADIUS * 0.32}
                      r={PIECE_RADIUS * 0.3}
                      fill={
                        piece === WHITE
                          ? 'rgba(255,255,255,0.55)'
                          : 'rgba(255,255,255,0.12)'
                      }
                    />
                  </>
                )}
              </G>
            );
          })
        )}
      </Svg>

      {pulsingDestinations.map(({ r, c, key }) => (
        <PulsingCircle
          key={key}
          cx={posX(c)}
          cy={posY(r)}
          radius={PIECE_RADIUS + 6}
          fillColor={theme.destinationFillColor}
          strokeColor={theme.destinationRingColor}
        />
      ))}

      <View style={{ position: 'absolute', top: 0, left: 0, width: BOARD_WIDTH, height: BOARD_HEIGHT }}>
        {Array.from({ length: ROWS }, (_, r) =>
          Array.from({ length: COLS }, (_, c) => (
            <Pressable
              key={`press-${r}-${c}`}
              style={{
                position: 'absolute',
                left: posX(c) - CELL_SIZE / 2,
                top: posY(r) - CELL_SIZE / 2,
                width: CELL_SIZE,
                height: CELL_SIZE,
              }}
              onPress={() => handleCellPress(r, c)}
            />
          ))
        )}
      </View>
    </View>
  );
}
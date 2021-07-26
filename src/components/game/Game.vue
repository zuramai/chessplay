<template>
  <div class="game">
    <div class="chessboard | w-full max-h-0">
      <svg
        ref="svg"
        :viewBox="`0 0 ${viewbox.x} ${viewbox.y}`"
        @mousemove="onMouseMove"
      >
        <!-- Base Color -->
        <rect
          x="0"
          y="0"
          :width="viewbox.x"
          :height="viewbox.y"
          :fill="boardSettings.baseColor"
        ></rect>

        <!-- Square group -->
        <g class="squares">
          <g
            v-for="(squareRow, squareRowIndex) in squares"
            :key="squareRowIndex"
            class="square-row"
          >
            <g
              v-for="(square, squareColIndex) in squareRow"
              :key="square.code"
              :ref="square.code"
              :class="{ square: true, [`square-${square.code}`]: true }"
              @click="squareClick($event, squareRowIndex, squareColIndex)"
              @mouseenter="
                squareMouseEnter($event, squareRowIndex, squareColIndex)
              "
              @mouseleave="
                squareMouseLeave($event, squareRowIndex, squareColIndex)
              "
            >
              <rect
                :x="square.x"
                :y="square.y"
                :width="square.width"
                :height="square.height"
                :fill="
                  square.isPossibleMove
                    ? color['possibleMove']
                    : color[square.color]
                "
              ></rect>
              <g v-if="square.content.piece">
                <Piece
                  v-show="square.visible"
                  :key="square.code"
                  :name="square.content.piece"
                  :x="square.content.x"
                  :y="square.content.y + 10"
                  :width="square.content.width"
                  :height="square.content.height"
                  :color="square.content.color"
                />
              </g>
            </g>
          </g>
        </g>
        <g class="notations">
          <text
            v-for="i in 8"
            :key="i"
            class="notation"
            x="20"
            :y="15 + 110 * i"
          >
            {{ 9 - i }}
          </text>
          <text
            v-for="(i, n) in ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']"
            :key="i"
            class="notation"
            :x="110 + 110 * n"
            :y="viewbox.y - 20"
          >
            {{ i }}
          </text>
        </g>
        <g class="holding-piece">
          <Piece
            v-if="isHoldingChessPiece"
            :name="isHoldingChessPiece.content.piece"
            :x="mouseLocation.x - isHoldingChessPiece.content.width / 2"
            :y="mouseLocation.y - isHoldingChessPiece.content.height / 2"
            :width="isHoldingChessPiece.content.width"
            :color="isHoldingChessPiece.content.color"
            :height="isHoldingChessPiece.content.height"
          />
        </g>
      </svg>
    </div>
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref, toRefs } from "vue";
import { useStore } from "vuex";
import helper from "@/components/Game/GameHelper";
import Piece from "@/components/Game/Piece.vue";

const store = useStore();

const viewbox = { x: 1000, y: 1000 };
/*eslint no-unused-vars: "off"*/
let playerColor = ref("white");
let turn = computed({
  set(val) {
    return store.commit("CHANGE_TURN", val);
  },
  get() {
    return store.state.turn;
  },
});
let oppositeTurn = computed(() => (turn.value == "black" ? "white" : "black"));
let turnNumber = ref(1);
let squares = reactive([]);
let possibleMoves = reactive([]);
let svg = ref(null);

/*eslint no-undef: "off"*/
const props = defineProps({
  boardSettings: {
    required: false,
    type: Object,
    default: () => ({
      padding: 60,
      showNotation: true,
      baseColor: "#2B2B2B",
      square: {
        width: 110,
        height: 110,
      },
    }),
  },
  color: {
    type: Object,
    default: () => ({
      light: "#eee",
      dark: "#555",
      possibleMove: "#FFE194",
      possibleStroke: "#b59f67",
    }),
  },
});

const { color } = toRefs(props);

/**
 * Init chessboard squares
 * @returns void
 */
function initSquares() {
  for (let i = 0; i < 8; i++) {
    squares.push([]);
    for (let j = 0; j < 8; j++) {
      let squarePosition = helper.getSquarePosition(i, j, props.boardSettings);
      let code = helper.getSquareCode(i, j);
      let squareContent = helper.getSquareContent(code);
      let pieceSize = {
        width: props.boardSettings.square.width,
        height: (props.boardSettings.square.height * 3) / 4,
      };

      squares[i].push({
        isPossibleMove: false,
        code,
        visible: true,
        color: helper.getSquareColor(i, j),
        content: {
          stepNumber: 1,
          color: i < 2 ? "black" : i > 5 ? "white" : null,
          piece: squareContent,
          ...squarePosition,
          ...pieceSize,
        },
        ...squarePosition,
        ...props.boardSettings.square,
      });
    }
  }
}

let isHoldingChessPiece = ref(false);
let holding = reactive({ row: null, col: null });

/**
 * Event fire on square click
 * @returns {void}
 */
function squareClick($event, rowIndex, colIndex) {
  /*eslint no-unused-vars: "off"*/
  let square = squares[rowIndex][colIndex];
  if (isHoldingChessPiece.value) {
    // If user is holding a chess piece, then release it.
    releasePiece($event, square);
  } else {
    // If user is holding not holding chess piece, then hold it.
    holding.row = rowIndex;
    holding.col = colIndex;
    holdPiece($event, square);
  }
  console.log(isHoldingChessPiece.value);
}

/*eslint no-unused-vars: "off"*/
function playAgain() {
  initSquares();
  turn.value = "white";
  store.commit("RESET_MOVES_HISTORY");
}

function isCheckmate(squareTo) {
  const isKingEaten = () =>
    squareTo.content.piece == "king"
      ? squareTo.content.color == "white"
        ? "black"
        : "white"
      : null;

  let winner = null;

  if ((winner = isKingEaten())) {
    alert(`${winner} win!`);
  }

  if (winner) {
    let playAgain = confirm("Want to play again?");
    if (playAgain) playAgain();
  }

  // if (squareTo.content.piece == "king") {
  // }
}

function addMoveHistory(fromSquare, toSquare) {
  store.commit("ADD_MOVE_HISTORY", {
    color: fromSquare.content.color,
    from: fromSquare.code,
    to: toSquare.code,
    piece: fromSquare.content.piece,
  });
}

/**
 * Release a chess piece to a square
 * @returns {void}
 */
function releasePiece($event, toSquare) {
  let fromSquare = squares[holding.row][holding.col];
  if (!toSquare.isPossibleMove) {
    isHoldingChessPiece.value = null;
    fromSquare.visible = true;
    return clearPossibleMoves();
  }

  addMoveHistory(fromSquare, toSquare);
  isCheckmate(toSquare);

  console.log("release from ", squares[holding.row][holding.col]);
  console.log("to ", toSquare);

  toSquare.content.piece = fromSquare.content.piece;
  toSquare.content.color = fromSquare.content.color;
  toSquare.content.stepNumber++;
  toSquare.visible = true;
  fromSquare.content.piece = null;
  fromSquare.content.color = null;

  isHoldingChessPiece.value = false;

  turnNumber.value++;

  clearPossibleMoves();

  turn.value = turn.value == "black" ? "white" : "black";
}

/**
 * Event trigerred on square onmouseenter
 * @param {MouseEvent} $event
 * @param {Number} squareRowIndex
 * @param {Number} squareColIndex
 * @returns {void}
 */
function squareMouseEnter($event, squareRowIndex, squareColIndex) {
  // If hover on a piece and the color is the current turn, show possible moves
  let square = squares[squareRowIndex][squareColIndex];
  if (
    square.content.piece &&
    square.content.color == turn.value &&
    !isHoldingChessPiece.value
  ) {
    showPossibleMoves(squareRowIndex, squareColIndex);
    document.body.style.cursor = "pointer";
  }
}

function makeItPossible(square) {
  square.isPossibleMove = true;
  possibleMoves.push(square);
}

function pawnPossibleMoves(squareRowIndex, squareColIndex) {
  let square = squares[squareRowIndex][squareColIndex];
  let stepForward = 1;
  if (square.content.stepNumber === 1) stepForward = 2;
  if (square.content.color == "white") stepForward *= -1;

  let nextSquare;

  let i = 0;
  do {
    i += square.content.color == "white" ? -1 : 1;

    nextSquare = squares[squareRowIndex + i][squareColIndex];
    // console.log('pawn possible moves', nextSquare)
    if (nextSquare.content.piece) break;
    makeItPossible(nextSquare);
  } while (i !== stepForward);

  // check for topleft and topright
  if (square.content.color == "white") {
    nextSquare = squares[squareRowIndex - 1][squareColIndex - 1];
    if (
      nextSquare &&
      nextSquare.content.piece &&
      nextSquare.content.color == "black"
    )
      makeItPossible(nextSquare);
    nextSquare = squares[squareRowIndex - 1][squareColIndex + 1];
    if (
      nextSquare &&
      nextSquare.content.piece &&
      nextSquare.content.color == "black"
    )
      makeItPossible(nextSquare);
  } else if (square.content.color == "black") {
    nextSquare = squares[squareRowIndex + 1][squareColIndex - 1];
    if (
      nextSquare &&
      nextSquare.content.piece &&
      nextSquare.content.color == "white"
    )
      makeItPossible(nextSquare);
    nextSquare = squares[squareRowIndex + 1][squareColIndex + 1];
    if (
      nextSquare &&
      nextSquare.content.piece &&
      nextSquare.content.color == "white"
    )
      makeItPossible(nextSquare);
  }
}

/**
 * Show rook possible moves by row and column index
 * @param {Number} squareRowIndex
 * @param {Number} squareColIndex
 * @returns {void}
 */
function rookPossibleMoves(squareRowIndex, squareColIndex) {
  let moveTargets = [];
  let directionMapping = {
    top: { row: "min" },
    bottom: { row: "plus" },
    left: { col: "min" },
    right: { col: "plus" },
  };

  for (let directionName in directionMapping) {
    let direction = directionMapping[directionName];
    for (let i = 1; i <= 8; i++) {
      let getOffset = (direction, value) => {
        if (direction == "row") return value == "min" ? -i : i;
        else return value == "min" ? -i : i;
      };

      let targetRow = !direction.row
        ? squareRowIndex
        : squareRowIndex + getOffset("row", direction.row);
      let targetCol = !direction.col
        ? squareColIndex
        : squareColIndex + getOffset("col", direction.col);

      if (targetRow < 0 || targetCol < 0 || targetRow > 7 || targetCol > 7)
        break;
      let currSquare = squares[targetRow][targetCol];

      if (currSquare.content.color == turn.value) break;
      else if (currSquare.content.color == oppositeTurn.value) {
        moveTargets.push({ rowIndex: targetRow, colIndex: targetCol });
        break;
      } else {
        moveTargets.push({ rowIndex: targetRow, colIndex: targetCol });
      }
    }
  }

  moveTargets.forEach((target) => {
    let { rowIndex, colIndex } = target;
    let targetSquare = squares[rowIndex][colIndex];

    if (targetSquare.content.piece && targetSquare.content.color == turn.value)
      return;
    else makeItPossible(targetSquare);
  });
}

/**
 * Show king's possible moves by row and column index
 * @param {Number} squareRowIndex
 * @param {Number} squareColIndex
 * @returns {void}
 */
function kingPossibleMoves(squareRowIndex, squareColIndex) {
  let possibleMovesIndex = helper.getKingPossibleMoves(
    squareRowIndex,
    squareColIndex
  );

  possibleMovesIndex.forEach((possible) => {
    let { targetRow, targetCol } = possible;

    if (targetRow < 0 || targetCol < 0 || targetRow > 7 || targetCol > 7)
      return;

    let square = squares[targetRow][targetCol];

    if (square.content.color == turn.value) return;
    else if (
      !square.content.color ||
      square.content.color == oppositeTurn.value
    )
      makeItPossible(square);
  });
}

/**
 * Show queen's possible moves by row and column index
 * @param {Number} squareRowIndex
 * @param {Number} squareColIndex
 * @returns {void}
 */
function queenPossibleMoves(squareRowIndex, squareColIndex) {
  bishopPossibleMoves(squareRowIndex, squareColIndex);
  rookPossibleMoves(squareRowIndex, squareColIndex);
}

/**
 * Show knight's possible moves by row and column index
 * @param {Number} squareRowIndex
 * @param {Number} squareColIndex
 * @returns {void}
 */
function knightPossibleMoves(squareRowIndex, squareColIndex) {
  let moveTargets = helper.getKnightPossibleMoves(
    squareRowIndex,
    squareColIndex
  );

  moveTargets.forEach((target) => {
    let { rowIndex, colIndex } = target;
    if (rowIndex < 0 || colIndex < 0 || rowIndex > 7 || colIndex > 7) return;

    let targetSquare = squares[rowIndex][colIndex];

    if (targetSquare.content.piece && targetSquare.content.color == turn.value)
      return;
    else makeItPossible(targetSquare);
  });
}

/**
 * Show bishop's possible moves by row and column index
 * @param {Number} squareRowIndex
 * @param {Number} squareColIndex
 * @returns {void}
 */
function bishopPossibleMoves(squareRowIndex, squareColIndex) {
  /*eslint no-unused-vars: "off"*/
  let square = squares[squareRowIndex][squareColIndex];

  let moveTargets = [];
  let directionMapping = {
    topleft: { row: "min", col: "min" },
    topright: { row: "min", col: "plus" },
    bottomleft: { row: "plus", col: "min" },
    bottomright: { row: "plus", col: "plus" },
  };

  // Check diagonally for every direction
  for (let directionName in directionMapping) {
    let direction = directionMapping[directionName];
    for (let i = 1; i <= 8; i++) {
      let targetRow =
        direction.row == "min" ? squareRowIndex - i : squareRowIndex + i;
      let targetCol =
        direction.col == "min" ? squareColIndex - i : squareColIndex + i;

      if (targetRow < 0 || targetCol < 0 || targetRow > 7 || targetCol > 7)
        break;
      let currSquare = squares[targetRow][targetCol];

      if (currSquare.content.color == turn.value) break;
      else if (currSquare.content.color == oppositeTurn.value) {
        moveTargets.push({ rowIndex: targetRow, colIndex: targetCol });
        break;
      } else {
        moveTargets.push({ rowIndex: targetRow, colIndex: targetCol });
      }
    }
  }

  console.log("Bishop possible:", moveTargets);

  moveTargets.forEach((target) => {
    let { rowIndex, colIndex } = target;
    let targetSquare = squares[rowIndex][colIndex];
    console.log("target", targetSquare);

    if (targetSquare.content.piece && targetSquare.content.color == turn.value)
      return;
    else makeItPossible(targetSquare);
  });
}

const possibleMovesMapping = {
  pawn: pawnPossibleMoves,
  rook: rookPossibleMoves,
  king: kingPossibleMoves,
  queen: queenPossibleMoves,
  knight: knightPossibleMoves,
  bishop: bishopPossibleMoves,
};

/**
 * Show possible moves from a square
 * @param {Object} square
 * @returns {void}
 */
function showPossibleMoves(squareRowIndex, squareColIndex) {
  /*eslint no-unused-vars: "off"*/
  let square = squares[squareRowIndex][squareColIndex];
  return possibleMovesMapping[square.content.piece](
    squareRowIndex,
    squareColIndex
  );
}

/**
 * Remove all possible moves
 */
function clearPossibleMoves() {
  for (let i = 0; i < possibleMoves.length; i++) {
    possibleMoves[i].isPossibleMove = false;
  }
  possibleMoves = reactive([]);
}

/**
 * Event trigerred on square onmouseleave
 * @param {MouseEvent} $event
 * @param {Object} square
 * @returns {void}
 */
function squareMouseLeave($event, square) {
  document.body.style.cursor = "initial";
  if (!isHoldingChessPiece.value) clearPossibleMoves();
}

/**
 * Cancel current turn move
 */
function cancelTurn(squareTo) {}

/**
 * Hold a chess piece to a square
 */
function holdPiece($event, square) {
  if (
    !square.content.piece ||
    square.content.color !== turn.value ||
    possibleMoves.length == 0
  )
    return;
  isHoldingChessPiece.value = square;
  square.visible = false;
}

let mouseLocation = reactive({ x: 0, y: 0 });

/**
 * onMouseMove fired when the mouse moving
 * @param {Event} e
 */
function onMouseMove(e) {
  let rect = svg.value.getBoundingClientRect();
  mouseLocation.x = ((e.clientX - rect.x) * viewbox.x) / rect.width;
  mouseLocation.y = ((e.clientY - rect.y) * viewbox.y) / rect.height;
}

onMounted(() => {
  initSquares();
});
</script>
<style lang="scss">
.chessboard {
  padding-bottom: 97.5%;
}
.holding-piece {
  pointer-events: none;
}
.notation {
  fill: #ccc;
  font-size: 1.5rem;
}
</style>

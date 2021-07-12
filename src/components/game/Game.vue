<template>
    <div class="game px-32">
        <div class="chessboard | w-full max-h-0" >
            <p class='text-lg text-center'><b>{{ turn }}</b> turn</p>
            <svg :viewBox="`0 0 ${viewbox.x} ${viewbox.y}`" ref="svg" @mousemove="onMouseMove">
                <!-- Base Color -->
                <rect x="0" y="0" :width="viewbox.x" :height="viewbox.y" :fill="boardSettings.baseColor"></rect>

                <!-- Square group -->
                <g class="squares">
                    <g class="square-row"  v-for="(squareRow,squareRowIndex) in squares" :key="squareRowIndex">
                        <g @click="squareClick($event, squareRowIndex, squareColIndex)" 
                            :class="{'square':true, [`square-${square.code}`]:true}" 
                            v-for="(square, squareColIndex) in squareRow" 
                            @mouseenter="squareMouseEnter($event,squareRowIndex, squareColIndex)" 
                            @mouseleave="squareMouseLeave($event,squareRowIndex, squareColIndex)" 
                            :key="square.code" 
                            :ref="square.code">
                            <rect :x="square.x"
                                :y="square.y" 
                                :width="square.width" 
                                :height="square.height" 
                                :fill="square.isPossibleMove ? color['possibleMove'] : color[square.color]">
                            </rect>
                            <g v-if="square.content.piece">
                                <Piece v-show="square.visible"
                                    :name="square.content.piece"
                                    :x="square.content.x"
                                    :key="square.code" 
                                    :y="square.content.y+10"
                                    :width="square.content.width"
                                    :height="square.content.height"
                                    :color="square.content.color"
                                />
                            </g>
                        </g>
                    </g>
                </g>
                <g class="holding-piece">
                    <Piece v-if="isHoldingChessPiece"
                        :name="isHoldingChessPiece.content.piece"
                        :x="mouseLocation.x - isHoldingChessPiece.content.width/2"
                        :y="mouseLocation.y - isHoldingChessPiece.content.height/2"
                        :width="isHoldingChessPiece.content.width"
                        :color="isHoldingChessPiece.content.color"
                        :height="isHoldingChessPiece.content.height"/>
                </g>
            </svg>
        </div>
    </div>
</template>
<script setup>
import { onMounted, reactive, ref, toRefs } from 'vue'
import helper from "./GameHelper"
import Piece from "./Piece.vue"

const viewbox = {x: 1000, y: 1000}
let playerColor = ref('white')
let turn = ref('white')
let turnNumber = ref(1)
let squares = reactive([]);
let svg = ref(null)

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
                height: 110
            }
        })
    },
    color: {
        type: Object,
        default: () => ({
            light: "#eee",
            dark: "#555",
            possibleMove: "#FFE194",
            possibleStroke: "#b59f67"
        })
    },
})

const { color } = toRefs(props)

/**
 * Init chessboard squares
 * @returns void
 */
function initSquares() {
    for(let i = 0; i < 8; i++) {
        squares.push([])
        for(let j = 0; j < 8; j++) {
            let squarePosition = helper.getSquarePosition(i,j,props.boardSettings)
            let code = helper.getSquareCode(i,j)
            let squareContent = helper.getSquareContent(code)
            let pieceSize = {
                width: props.boardSettings.square.width,
                height: props.boardSettings.square.height * 3 / 4,
            }

            squares[i].push({
                isPossibleMove: false,
                code,
                visible: true,
                color: helper.getSquareColor(i,j),
                content: {
                    stepNumber: 1,
                    color: i < 3 ? "black" : "white",
                    piece: squareContent,
                    ...squarePosition,
                    ...pieceSize
                },
                ...squarePosition,
                ...props.boardSettings.square
            })
        }
    }
}

let isHoldingChessPiece = ref(false)
let holding = reactive({row: null, col: null})

/**
 * Event fire on square click
 * @returns {void}
 */
function squareClick($event, rowIndex, colIndex) {
    let square = squares[rowIndex][colIndex]
    if(isHoldingChessPiece.value) {
        // If user is holding a chess piece, then release it.
        releasePiece($event, square)
    }else{
        // If user is holding not holding chess piece, then hold it.
        holding.row = rowIndex
        holding.col = colIndex
        holdPiece($event, square)
    }
    console.log(isHoldingChessPiece.value)
}

/**
 * Release a chess piece to a square
 * @returns {void}
 */
function releasePiece($event, toSquare) {
    if(!toSquare.isPossibleMove) return

    console.log('release from ', squares[holding.row][holding.col])
    console.log('to ', toSquare)

    let fromSquare = squares[holding.row][holding.col]

    toSquare.content.piece = fromSquare.content.piece
    toSquare.content.color = fromSquare.content.color
    toSquare.content.stepNumber++
    fromSquare.content.piece = null

    isHoldingChessPiece.value = false

    turnNumber.value++

    clearPossibleMoves()

    turn.value = turn.value == 'black' ? 'white' : 'black'
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
    let square = squares[squareRowIndex][squareColIndex]
    if(square.content.piece && square.content.color == turn.value) {
        showPossibleMoves(squareRowIndex, squareColIndex)
        document.body.style.cursor = 'pointer'
    }
}

function makeItPossible(square) {
    square.isPossibleMove = true
}

function pawnPossibleMoves(squareRowIndex, squareColIndex) {
    let square = squares[squareRowIndex][squareColIndex]
    let stepForward = 1
    if(square.content.stepNumber === 1) stepForward = 2
    if(square.content.color == 'white') stepForward *= -1

    let nextSquare

    let i = 0;
    do {
        i += square.content.color == 'white' ? -1 : 1
        
        nextSquare = squares[squareRowIndex+i][squareColIndex]
        console.log('pawn possible moves', nextSquare)
        if(nextSquare.content.piece) break
        makeItPossible(nextSquare)
    }while(i !== stepForward)

    // check for topleft and topright
    if(square.content.color == 'white') {
        nextSquare = squares[squareRowIndex-1][squareColIndex-1]
        if(nextSquare && nextSquare.content.piece && nextSquare.content.color == 'black') makeItPossible(nextSquare)
        nextSquare = squares[squareRowIndex-1][squareColIndex+1]
        if(nextSquare && nextSquare.content.piece && nextSquare.content.color == 'black') makeItPossible(nextSquare)
    }
    else if(square.content.color == 'black') {
        nextSquare = squares[squareRowIndex+1][squareColIndex-1]
        if(nextSquare && nextSquare.content.piece && nextSquare.content.color == 'white') makeItPossible(nextSquare)
        nextSquare = squares[squareRowIndex+1][squareColIndex+1]
        if(nextSquare && nextSquare.content.piece && nextSquare.content.color == 'white') makeItPossible(nextSquare)
    }
}

/**
 * Show rook possible moves by row and column index
 * @param {Number} squareRowIndex
 * @param {Number} squareColIndex
 * @returns {void}
 */
function rookPossibleMoves(squareRowIndex, squareColIndex) {
    
}

/**
 * Show king's possible moves by row and column index
 * @param {Number} squareRowIndex
 * @param {Number} squareColIndex
 * @returns {void}
 */
function kingPossibleMoves(squareRowIndex, squareColIndex) {
    
}

/**
 * Show queen's possible moves by row and column index
 * @param {Number} squareRowIndex
 * @param {Number} squareColIndex
 * @returns {void}
 */
function queenPossibleMoves(squareRowIndex, squareColIndex) {
    
}

/**
 * Show knight's possible moves by row and column index
 * @param {Number} squareRowIndex
 * @param {Number} squareColIndex
 * @returns {void}
 */
function knightPossibleMoves(squareRowIndex, squareColIndex) {
    
}

/**
 * Show bishop's possible moves by row and column index
 * @param {Number} squareRowIndex
 * @param {Number} squareColIndex
 * @returns {void}
 */
function bishopPossibleMoves(squareRowIndex, squareColIndex) {
    
}

const possibleMovesMapping = {
    pawn: pawnPossibleMoves,
    rook: rookPossibleMoves,
    king: kingPossibleMoves,
    queen: queenPossibleMoves,
    knight: knightPossibleMoves,
    bishop: bishopPossibleMoves,
}

/**
 * Show possible moves from a square
 * @param {Object} square
 * @returns {void}
 */
function showPossibleMoves(squareRowIndex, squareColIndex) {
    let square = squares[squareRowIndex][squareColIndex]
    return possibleMovesMapping[square.content.piece](squareRowIndex, squareColIndex)
}

/**
 * Remove all possible moves
 */
function clearPossibleMoves() {
    for(let i = 0; i < 8; i++) {
        for(let j = 0; j < 8; j++) {
            squares[i][j].isPossibleMove = false
        }
    }
}

/**
 * Event trigerred on square onmouseleave
 * @param {MouseEvent} $event
 * @param {Object} square
 * @returns {void}
 */
function squareMouseLeave($event, square) {
    document.body.style.cursor = 'initial'
    if(!isHoldingChessPiece.value) clearPossibleMoves()
}



/**
 * Hold a chess piece to a square
 */
function holdPiece($event,square) {
    if(!square.content.piece  ||
        square.content.color !== turn.value) return
    isHoldingChessPiece.value = square
    square.visible = false
}

let mouseLocation = reactive({x:0,y:0})

/**
 * onMouseMove fired when the mouse moving
 * @param {Event} e
 */
function onMouseMove(e) {
    let rect = svg.value.getBoundingClientRect()
    mouseLocation.x =  (e.clientX - rect.x) * viewbox.x / rect.width
    mouseLocation.y =  (e.clientY - rect.y) * viewbox.y / rect.height
}

/**
 * Call this function anywhere where you want to debug something
 */
function debug() {
    console.log(squares)
}



onMounted(() => {
    initSquares()
    debug()
})
</script>
<style lang="scss">
    .chessboard {
        padding-bottom: 97.5%;
    }
    .holding-piece {
        pointer-events: none;
    }
</style>
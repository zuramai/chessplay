<template>
    <div class="game px-32">
        <div class="chessboard | w-full max-h-0" >
            <p class='text-lg text-center'><b>{{ turn }}</b> turn</p>
            <svg :viewBox="`0 0 ${viewbox.x} ${viewbox.y}`" ref="svg">
                <!-- Base Color -->
                <rect x="0" y="0" :width="viewbox.x" :height="viewbox.y" :fill="boardSettings.baseColor"></rect>

                <!-- Square group -->
                <g class="squares">
                    <g class="square-row"  v-for="(squareRow,index) in squares" :key="index">
                        <g @click="squareClick($event, square)" :class="{'square':true, [`square-${square.code}`]:true}" v-for="square in squareRow" :key="square.code" :ref="square.code">
                            <rect :x="square.x"
                                :y="square.y" 
                                :width="square.width" 
                                :height="square.height" 
                                :fill="color[square.color]">
                            </rect>
                            <g v-if="square.content.piece">
                                <Piece v-show="square.visible"
                                    :name="square.content.piece"
                                    :x="square.content.x"
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
                        :y="mouseLocation.y -    isHoldingChessPiece.content.height/2"
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

let playerColor = ref('white')
let turn = ref('white')
let squares = reactive([]);
const viewbox = {x: 1000, y: 1000}
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
            dark: "#555"
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
                content: '',
                code,
                visible: true,
                color: helper.getSquareColor(i,j),
                content: {
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

/**
 * Event fire on square click
 * @returns {void}
 */
function squareClick($event, square) {
    if(!!isHoldingChessPiece.value) {
        // If user is holding a chess piece, then release it.
        releasePiece($event, square)
    }else{
        // If user is holding not holding chess piece, then hold it.
        holdPiece($event, square)
    }
}
/**
 * Release a chess piece to a square
 * @returns {void}
 */
function releasePiece($event, square) {

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
    let chessPiece;
    let rect = svg.value.getBoundingClientRect()
    mouseLocation.x =  (e.clientX - rect.x) * viewbox.x / rect.width
    mouseLocation.y =  (e.clientY - rect.y) * viewbox.y / rect.height
    
    
    squares.forEach(squareRow => {
        squareRow.forEach(sq => {
            if(sq.content.color == turn.value &&
                mouseLocation.x > sq.x &&
                mouseLocation.x < sq.x + props.boardSettings.square.width && 
                mouseLocation.y > sq.y &&
                mouseLocation.y < sq.y + props.boardSettings.square.height) {
                console.log(`WARNA ${turn.value}`)
                return
            }
        })
    });
}



/**
 * Call this function anywhere where you want to debug something
 */
function debug() {
    console.log(squares)
}

function eventListener() {
    svg.value.addEventListener('mousemove', onMouseMove)    
}


onMounted(() => {
    initSquares()
    eventListener()
    debug()
})
</script>
<style lang="scss">
    .chessboard {
        padding-bottom: 97.5%;
    }
</style>
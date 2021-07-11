<template>
    <div class="game px-32">
        <div class="chessboard | w-full max-h-0" >
            <svg :viewBox="`0 0 ${viewbox.x} ${viewbox.y}`">
                <!-- Base Color -->
                <rect x="0" y="0" :width="viewbox.x" :height="viewbox.y" :fill="boardSettings.baseColor"></rect>

                <!-- Square group -->
                <g class="squares">
                    <g class="square-row"  v-for="(squareRow,index) in squares" :key="index">
                        <g :class="{'square':true, [`square-${square.code}`]:true}" v-for="square in squareRow" :key="square.code" :ref="square.code">
                            <rect :x="square.x"
                                :y="square.y" 
                                :width="square.width" 
                                :height="square.height" 
                                :fill="color[square.color]">
                            </rect>
                            <g v-if="square.content.piece">
                                <Piece 
                                    :name="square.content.piece"
                                    :x="square.x"
                                    :y="square.y+10"
                                    :width="props.boardSettings.square.width"
                                    :height="props.boardSettings.square.height*3/4"
                                    :color="square.content.color"
                                />
                            </g>
                        </g>
                    </g>
                </g>
            </svg>
        </div>
    </div>
</template>
<script setup>
import { defineProps, onMounted, reactive, ref, toRefs } from 'vue'
import helper from "./GameHelper"
import Piece from "./Piece.vue"

let playerColor = ref('white')
let squares = reactive([]);
const viewbox = {x: 1000, y: 1000}

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

            squares[i].push({
                content: '',
                code,
                color: helper.getSquareColor(i,j),
                content: {
                    color: i < 3 ? "black" : "white",
                    piece: squareContent
                },
                ...squarePosition,
                ...props.boardSettings.square
            })
        }
    }
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
</style>
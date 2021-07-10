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
                            <g v-if="square.content == 'king'">
                                <svg width="79" height="207" viewBox="0 0 79 207" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M0 201.67C0 194.57 1.2178 192.48 5.925 191.51L7.594 191.17L16.82 151.46C21.894 129.62 26.059 111.44 26.074 111.05C26.095 110.53 24.769 110.34 21.251 110.34C15.816 110.34 13.656 109.56 12.594 107.23C11.698 105.26 11.739 103.81 12.747 101.87C13.766 99.9 14.717 99.45 18.791 99.03L21.977 98.7L14.423 89.91L6.87 81.11L6.84 77.25L6.809 73.387L18.722 59.376L30.634 45.364L30.638 38.696L30.642 32.029H23.266H15.889V23.801V15.573H23.266H30.642V8.19597V0.81897H38.87H47.099V8.19597V15.573H54.192H61.285V23.801V32.029H54.192H47.099V39.018V46.007L58.731 59.697L70.364 73.386L70.334 77.25L70.304 81.11L62.75 89.91L55.197 98.7L58.667 99.03C63.01 99.43 63.956 99.86 64.994 101.87C66.039 103.89 66.045 105.43 65.016 107.42C63.842 109.69 61.869 110.34 56.151 110.34C53.357 110.34 51.074 110.53 51.077 110.76C51.081 111 55.372 129.19 60.613 151.19L70.142 191.19L72.097 191.52C77.029 192.34 78.308 194.43 78.308 201.67V206.8H39.154H0V201.67V201.67Z" fill="black"/>
                                </svg>
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
                content: squareContent,
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
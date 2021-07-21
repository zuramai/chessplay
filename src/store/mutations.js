export default {
    CHANGE_TURN(state, val) {
        state.turn = val
    },
    PUSH_MOVES_HISTORY(state, val) {
        state.movesHistory.push(val)
    },
    RESET_MOVES_HISTORY(state,val) {
        state.movesHistory = []
    }
}   
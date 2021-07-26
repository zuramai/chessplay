export default {
  CHANGE_TURN(state, val) {
    state.turn = val;
  },
  PUSH_MOVES_HISTORY(state, val) {
    state.movesHistory.push(val);
  },
  RESET_MOVES_HISTORY(state) {
    state.movesHistory = [
      {
        black: {},
        white: {},
      },
    ];
  },
  ADD_MOVE_HISTORY(state, move) {
    let lastMove = state.movesHistory[state.movesHistory.length - 1];
    if (Object.keys(lastMove[move.color]).length) {
      lastMove = {
        black: {},
        white: {},
      };
      state.movesHistory.push(lastMove);
    }

    lastMove[move.color] = move;
  },
};

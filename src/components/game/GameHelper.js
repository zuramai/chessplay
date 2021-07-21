export default {
    /**
     * A function to get every square code based on array indexes
     * @param {Number} row
     * @param {Number} col
     * @returns {String}
     */
    getSquareCode(row, col) {
        let rowMapping = ['8','7','6','5','4','3','2','1']
        let colMapping = ['A','B','C','D','E','F','G','H']

        return colMapping[col] + rowMapping[row] 
    },

    /**
     * Get a square color based on given row and column index
     * @param {Number} row 
     * @param {Number} col 
     * @returns {String}
     */
    getSquareColor(row, col) {
        if((row % 2 == 0 && col % 2 == 0) ||
            (row % 2 == 1 && col % 2 == 1))
            return "light"
        else return 'dark'
    },

    /**
     * Get Square Position Coordinate (x,y)
     * @param {Number} row square row index
     * @param {Number} col square column index
     */
    getSquarePosition(row, col, option = {}) {
        return {
            x: col * option.square.width + option.padding,
            y: row * option.square.height + option.padding
        }
    },

    /**
     * Get chess piece mapped by square code.
     * @param {String} squareCode 
     * @returns {String} The chess piece name
     */
    getSquareContent(squareCode) {
        let contentMapping = {
            'A1': 'rook',
            'B1': 'knight',
            'C1': 'bishop',
            'D1': 'queen',
            'E1': 'king',
            'F1': 'bishop',
            'G1': 'knight',
            'H1': 'rook',
            'A2': 'pawn',
            'B2': 'pawn',
            'C2': 'pawn',
            'D2': 'pawn',
            'E2': 'pawn',
            'F2': 'pawn',
            'G2': 'pawn',
            'H2': 'pawn',

            'A8': 'rook',
            'B8': 'knight',
            'C8': 'bishop',
            'D8': 'queen',
            'E8': 'king',
            'F8': 'bishop',
            'G8': 'knight',
            'H8': 'rook',
            'A7': 'pawn',
            'B7': 'pawn',
            'C7': 'pawn',
            'D7': 'pawn',
            'E7': 'pawn',
            'F7': 'pawn',
            'G7': 'pawn',
            'H7': 'pawn',
        }        
        return contentMapping[squareCode]
    },

    /**
     * Get knight possible moves indexes
     * @param {Number} squareRowIndex 
     * @param {Number} squareColIndex 
     * @returns 
     */
    getKnightPossibleMoves(squareRowIndex, squareColIndex) {
        return [
            {rowIndex: squareRowIndex - 2, colIndex: squareColIndex + 1},
            {rowIndex: squareRowIndex - 2, colIndex: squareColIndex - 1},
            {rowIndex: squareRowIndex + 2, colIndex: squareColIndex + 1},
            {rowIndex: squareRowIndex + 2, colIndex: squareColIndex - 1},
    
            {rowIndex: squareRowIndex - 1, colIndex: squareColIndex + 2},
            {rowIndex: squareRowIndex - 1, colIndex: squareColIndex - 2},
            {rowIndex: squareRowIndex + 1, colIndex: squareColIndex + 2},
            {rowIndex: squareRowIndex + 1, colIndex: squareColIndex - 2},
        ]
    },

  
}
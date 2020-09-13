import {Board} from "./Board";
import {Tetrolyso} from "./Tetrolyso";
import {Position} from "./Position";
import {ArraySchema} from "@colyseus/schema";


export const queryByRowAndColumn = (board: Board) => (row: number, col: number): number => {
    return board.values[row * board.cols + col];
}

export const setValueAtRowAndColumn = (board: Board) => (row: number, col: number, value: number): void => {
    board.values[row * board.cols + col] = value;
}

export const addEmptyRowToBoard = (board: Board): void => {
    const emptyRow = new Array(board.cols).fill(0);
    addRowToBoard(board, emptyRow);
}

const addRowToBoard = (board: Board, newRow: number[]) => {
    const boardValues = [...board.values];
    boardValues.unshift(...newRow);
    board.values = new ArraySchema<number>(...boardValues);
}

export const deleteRowsFromBoard = (board: Board, rowToDelete: number, amountOfRowsToDelete: number = 1) => {
    const boardValues = [...board.values];
    boardValues.splice(rowToDelete * board.cols, board.cols * amountOfRowsToDelete);
    board.values = new ArraySchema<number>(...boardValues);
}

export const freezeCurrentTetrolyso = (board: Board, tetrolyso: Tetrolyso, position: Position) => {
    const setBoardValue = setValueAtRowAndColumn(board);
    const tetrolysoElement = queryByRowAndColumn(tetrolyso);

    for (let tetrolysoRow = 0; tetrolysoRow < tetrolyso.rows; ++tetrolysoRow) {
        for (let tetrolysoCol = 0; tetrolysoCol < tetrolyso.cols; ++tetrolysoCol) {
            if (tetrolysoElement(tetrolysoRow, tetrolysoCol) !== 0) {
                setBoardValue(position.row + tetrolysoRow, position.col + tetrolysoCol, tetrolyso.color);
            }
        }
    }
}

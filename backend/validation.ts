import {Position} from "../state/Position";
import {queryByRowAndColumn} from "../state/mutations";
import {Board} from "../state/Board";
import {Tetrolyso} from "../state/Tetrolyso";

/**
 * isLeftOutOfBounds checks whether a given Tetrolyso is out of bounds of a board at its current (top-left) position
 * We determine how many columns are out of bounds (position.col < 0) and afterwards check each Tetrolyso column which sits outside the
 * board whether it is a "valid" Tetrolyso part (has a non-zero value)
 *
 * If so, we're out of bounds
 *
 * @param board The game board we don't want to exceed
 * @param tetrolyso The Tetrolyso which might be out of bounds
 * @param position The current top-left position of our Tetrolyso
 */
export const isLeftOutOfBounds = (board: Board, tetrolyso: Tetrolyso, position: Position): boolean => {
    if (position.col >= 0) {
        return false;
    }

    const blockElement = queryByRowAndColumn(tetrolyso);

    const offset = -position.col;
    for (let col = 0; col < offset; ++col) {
        for (let row = 0; row < tetrolyso.rows; ++row) {
            if (blockElement(row, col) !== 0) {
                return true;
            }
        }
    }
    return false;
}

/**
 * isRightOutOfBounds checks whether a given Tetrolyso is out of bounds of a board at its current (top-left) position
 * We determine how many columns are out of bounds (position.col + tetrolyso.cols - board.cols) and afterwards check each Tetrolyso column which sits outside the
 * board whether it is a "valid" Tetrolyso part (has a non-zero value)
 *
 * If so, we're out of bounds
 *
 * @param board The game board we don't want to exceed
 * @param tetrolyso The Tetrolyso which might be out of bounds
 * @param position The current top-left position of our Tetrolyso
 */
export const isRightOutOfBounds = (board: Board, tetrolyso: Tetrolyso, position: Position): boolean => {
    if (position.col + tetrolyso.cols < board.cols) {
        return false;
    }

    const blockElement = queryByRowAndColumn(tetrolyso);
    const offsetFromBoard = position.col + tetrolyso.cols - board.cols;
    const offset = tetrolyso.cols - 1 - offsetFromBoard;

    for (let col = tetrolyso.cols - 1; col > offset; --col) {
        for (let row = 0; row < tetrolyso.rows; ++row) {
            if (blockElement(row, col) !== 0) {
                return true;
            }
        }
    }
    return false;
}

/**
 * isBottomOutOfBounds checks whether a given Tetrolyso is out of bounds of a board at its current (top-left) position
 * We determine how many rows are out of bounds (position.row + tetrolyso.rows - board.rows) and afterwards check each Tetrolyso row which sits outside the
 * board whether it is a "valid" Tetrolyso part (has a non-zero value)
 *
 * If so, we're out of bounds
 *
 * @param board The game board we don't want to exceed
 * @param tetrolyso The Tetrolyso which might be out of bounds
 * @param position The current top-left position of our Tetrolyso
 */
export const isBottomOutOfBounds = (board: Board, tetrolyso: Tetrolyso, position: Position): boolean => {
    if (position.row + tetrolyso.rows < board.rows) {
        return false;
    }

    const blockElement = queryByRowAndColumn(tetrolyso);

    const offsetFromBoard = position.row + tetrolyso.rows - board.rows;
    const offset = tetrolyso.rows - 1 - offsetFromBoard;

    for (let row = tetrolyso.rows - 1; row > offset; --row) {
        for (let col = 0; col < tetrolyso.cols; ++col) {
            if (blockElement(row, col) !== 0) {
                return true;
            }
        }
    }
    return false;
}

export const collidesWithBoard = (board: Board, tetrolyso: Tetrolyso, position: Position): boolean => {
    const blockElement = queryByRowAndColumn(tetrolyso);
    const boardElement = queryByRowAndColumn(board);

    for (let boardRow = position.row; boardRow < position.row + tetrolyso.rows; ++boardRow) {
        for (let boardCol = position.col; boardCol < position.col + tetrolyso.cols; ++boardCol) {
            const blockRow = boardRow - position.row;
            const blockCol = boardCol - position.col;
            if (blockElement(blockRow, blockCol) !== 0 && boardElement(boardRow, boardCol) !== 0) {
                return true;
            }
        }
    }
    return false;
}

/**
 * After rotating a block it might happen that, given its current position, it moves out of bounds
 * keepTetrolysoInsideBounds will move a Tetrolyse to the inside of our game board until it is
 * no longer out of bounds on either of left, right or bottom side
 * @private
 */
export const keepTetrolysoInsideBounds = (board: Board, tetrolyso: Tetrolyso, position: Position): Position => {
    const newPosition = position.clone();
    while (isLeftOutOfBounds(board, tetrolyso, newPosition)) {
        newPosition.col += 1;
    }
    while (isRightOutOfBounds(board, tetrolyso, newPosition)) {
        newPosition.col -= 1;
    }
    while (isBottomOutOfBounds(board, tetrolyso, newPosition)) {
        newPosition.row -= 1;
    }
    return newPosition;
}

export const isRowCompleted = (board: Board, rowIndex: number) => {
    const boardElement = queryByRowAndColumn(board);

    for (let col = 0; col < board.cols; ++col) {
        if (boardElement(rowIndex, col) === 0) {
            return false;
        }
    }
    return true;
}

export const isRowEmpty = (board: Board, rowIndex: number) => {
    const boardElement = queryByRowAndColumn(board);

    for (let col = 0; col < board.cols; ++col) {
        if (boardElement(rowIndex, col) !== 0) {
            return false;
        }
    }
    return true;
}

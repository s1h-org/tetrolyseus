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

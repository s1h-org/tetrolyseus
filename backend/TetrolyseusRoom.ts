import {Client, Room} from "colyseus";
import {GameState} from "../state/GameState";
import {Position} from "../state/Position";
import {collidesWithBoard, isBottomOutOfBounds, isRowCompleted, isRowEmpty} from "./validation";
import {addEmptyRowToBoard, deleteRowsFromBoard, freezeCurrentTetrolyso} from "../state/mutations";
import {getRandomBlock} from "../state/Tetrolyso";

export class TetrolyseusRoom extends Room<GameState> {
    private DEFAULT_ROWS = 20;
    private DEFAULT_COLS = 10;
    private DEFAULT_LEVEL = 0;

    private dropTetrolyso() {
        return new Position(
            this.state.currentPosition.row + 1,
            this.state.currentPosition.col
        );
    }

    private detectCompletedLines() {
        let completedLines = [];
        for (let boardRow = this.state.board.rows - 1; boardRow >= 0; --boardRow) {
            if (isRowEmpty(this.state.board, boardRow)) {
                break;
            }

            if (isRowCompleted(this.state.board, boardRow)) {
                completedLines.push(boardRow);
            }
        }
        return completedLines;
    }

    private updateBoard(completedLines: number[]) {
        for (let rowIdx = 0; rowIdx < completedLines.length; ++rowIdx) {
            deleteRowsFromBoard(this.state.board, completedLines[rowIdx] + rowIdx);
            addEmptyRowToBoard(this.state.board);
        }
    }

    private dropNewTetrolyso() {
        this.state.currentPosition = new Position(
            0,
            5
        );
        this.state.currentBlock = this.state.nextBlock.clone();
        this.state.nextBlock = getRandomBlock();
    }

    private moveOrFreezeTetrolyso(nextPosition: Position) {
        if (
            !isBottomOutOfBounds(this.state.board, this.state.currentBlock, nextPosition) &&
            !collidesWithBoard(this.state.board, this.state.currentBlock, nextPosition)
        ) {
            this.state.currentPosition = nextPosition;
        } else {
            freezeCurrentTetrolyso(this.state.board, this.state.currentBlock, this.state.currentPosition);
            this.dropNewTetrolyso();
        }
    }

    onCreate(options: any) {
        this.setState(new GameState(this.DEFAULT_ROWS, this.DEFAULT_COLS, this.DEFAULT_LEVEL));
    }

    onJoin(client: Client, options: any) {
    }

    onLeave(client: Client, consented: boolean) {
    }

    onDispose() {
    }
}

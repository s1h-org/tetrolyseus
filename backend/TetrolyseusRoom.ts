import {Client, Delayed, Room} from "colyseus";
import {GameState} from "../state/GameState";
import {Position} from "../state/Position";
import {
    collidesWithBoard,
    isBottomOutOfBounds,
    isLeftOutOfBounds,
    isRightOutOfBounds,
    isRowCompleted,
    isRowEmpty, keepTetrolysoInsideBounds
} from "./validation";
import {addEmptyRowToBoard, deleteRowsFromBoard, freezeCurrentTetrolyso} from "../state/mutations";
import {getRandomBlock} from "../state/Tetrolyso";
import {computeScoreForClearedLines} from "./scoring";
import {Movement} from "../messages/movement";
import {Player, PlayerType} from "./Player";
import {ReadyState} from "../messages/readystate";

export class TetrolyseusRoom extends Room<GameState> {
    private DEFAULT_ROWS = 20;
    private DEFAULT_COLS = 10;
    private DEFAULT_LEVEL = 0;

    private playerMap: Map<string, Player>;

    private gameLoop!: Delayed;

    constructor() {
        super();
        this.playerMap = new Map<string, Player>();
    }


    private loopFunction = () => {
        const nextPosition = this.dropTetrolyso();
        this.moveOrFreezeTetrolyso(nextPosition);

        const completedLines = this.detectCompletedLines();
        this.updateClearedLines(completedLines);
        this.updateTotalPoints(completedLines);
        this.updateBoard(completedLines);
        this.checkNextLevel();
    }

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
            Math.floor((this.state.board.cols / 2) - (this.state.nextBlock.cols / 2))
        );
        this.state.currentBlock = this.state.nextBlock.clone();
        this.state.nextBlock = getRandomBlock();
    }

    private checkGameOver() {
        if (collidesWithBoard(this.state.board, this.state.currentBlock, this.state.currentPosition)) {
            this.gameLoop.clear();
            this.state.running = false;
        }
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
            this.checkGameOver();
        }
    }

    private determineNextLevel(): number {
        return Math.floor(this.state.clearedLines / 10);
    }

    private checkNextLevel() {
        const nextLevel = this.determineNextLevel();
        if (nextLevel > this.state.level) {
            this.state.level = nextLevel;
            this.restartGameLoop();
        }
    }

    private startGameLoop() {
        const loopInterval = 1000 / (this.state.level + 1);
        this.gameLoop = this.clock.setInterval(this.loopFunction, loopInterval);
    }

    private stopGameLoop() {
        this.gameLoop.clear();
    }

    private restartGameLoop() {
        this.stopGameLoop();
        this.startGameLoop();
    }

    private updateTotalPoints(completedLines: any[]) {
        this.state.totalPoints += computeScoreForClearedLines(completedLines.length, this.state.level);
    }

    private updateClearedLines(completedLines: any[]) {
        this.state.clearedLines += completedLines.length;
    }

    private roomHasMover(): boolean {
        for (const player of this.playerMap.values()) {
            if (player.isMover()) {
                return true;
            }
        }
        return false;
    }

    private roomHasRotator(): boolean {
        for (const player of this.playerMap.values()) {
            if (player.isRotator()) {
                return true;
            }
        }
        return false;
    }

    private allPlayersReady(): boolean {
        for (const player of this.playerMap.values()) {
            if (!player.isReady) {
                return false;
            }
        }
        return true;
    }

    onCreate(options: any) {
        this.setState(new GameState(this.DEFAULT_ROWS, this.DEFAULT_COLS, this.DEFAULT_LEVEL));

        this.onMessage("rotate", (client, _) => {
            if (this.playerMap.has(client.id) && this.playerMap.get(client.id).isRotator()) {
                const rotatedBlock = this.state.currentBlock.rotate();
                const rotatedPosition = keepTetrolysoInsideBounds(this.state.board, rotatedBlock, this.state.currentPosition);
                if (!collidesWithBoard(this.state.board, rotatedBlock, rotatedPosition)) {
                    this.state.currentBlock = rotatedBlock;
                    this.state.currentPosition = rotatedPosition;
                }
            }
        });
        this.onMessage("move", (client, message: Movement) => {
            if (this.playerMap.has(client.id) && this.playerMap.get(client.id).isMover()) {
                const nextPosition = new Position(
                    this.state.currentPosition.row + message.row,
                    this.state.currentPosition.col + message.col
                );
                if (
                    !isLeftOutOfBounds(this.state.board, this.state.currentBlock, nextPosition) &&
                    !isRightOutOfBounds(this.state.board, this.state.currentBlock, nextPosition) &&
                    !isBottomOutOfBounds(this.state.board, this.state.currentBlock, nextPosition) &&
                    !collidesWithBoard(this.state.board, this.state.currentBlock, nextPosition)
                ) {
                    this.state.currentPosition = nextPosition;
                }
            }
        });
        this.onMessage("ready", (client, message: ReadyState) => {
            if (this.playerMap.has(client.id)) {
                this.playerMap.get(client.id).isReady = message.isReady;
            }

            if (this.roomHasMover() && this.roomHasRotator() && this.allPlayersReady()) {
                this.state.running = true;
                this.startGameLoop();
            }
        });
    }

    onJoin(client: Client, options: any) {
        if (!this.playerMap.size) {
            const playerType = Math.random() >= 0.5 ? PlayerType.MOVER : PlayerType.ROTATOR;
            this.playerMap.set(client.id, new Player(client.id, false, playerType));
        } else {
            if (this.roomHasMover()) {
                this.playerMap.set(client.id, new Player(client.id, false, PlayerType.ROTATOR));
            } else {
                this.playerMap.set(client.id, new Player(client.id, false, PlayerType.MOVER));
            }
        }
    }

    onLeave(client: Client, consented: boolean) {
        this.playerMap.delete(client.id);
    }

    onDispose() {
    }
}

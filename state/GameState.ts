import {Schema, type} from "@colyseus/schema";
import {getRandomBlock, Tetrolyso} from "./Tetrolyso";
import {Position} from "./Position";
import {Board} from "./Board";

export class GameState extends Schema {
    @type(Board)
    board: Board;

    @type(Tetrolyso)
    currentBlock: Tetrolyso;

    @type(Position)
    currentPosition: Position;

    @type(Tetrolyso)
    nextBlock: Tetrolyso;

    @type("number")
    clearedLines: number;

    @type("number")
    level: number;

    @type("number")
    totalPoints: number;

    @type("boolean")
    running: boolean;

    constructor(rows: number = 20, cols: number = 10, initialLevel = 0) {
        super();
        this.board = new Board(rows, cols);
        this.currentBlock = getRandomBlock();
        this.currentPosition = new Position(
            0,
            Math.floor((this.board.cols / 2) - (this.currentBlock.cols / 2))
        );
        this.nextBlock = getRandomBlock();
        this.level = initialLevel;
        this.clearedLines = 0;
        this.totalPoints = 0;
        this.running = false;
    }
}
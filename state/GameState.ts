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

    constructor(rows: number = 20, cols: number = 10, initialValue: number = 0, initialLevel = 0) {
        super();
        this.board = new Board(rows, cols, initialValue);
        this.currentBlock = getRandomBlock();
        this.currentPosition = new Position(0, 5);
        this.nextBlock = getRandomBlock();
        this.level = initialLevel;
        this.clearedLines = 0;
        this.totalPoints = 0;
    }
}
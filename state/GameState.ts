import {ArraySchema, Schema, type} from "@colyseus/schema";
import {getRandomBlock, Tetrolyso} from "./Tetrolyso";

export class GameState extends Schema {
    @type(["number"])
    board: number[];

    @type("number")
    rows: number;

    @type("number")
    cols: number;

    @type(Tetrolyso)
    currentBlock: Tetrolyso;

    @type(Tetrolyso)
    nextBlock: Tetrolyso;

    constructor(rows: number = 20, cols: number = 10, initialValue: number = 0) {
        super();
        this.rows = rows;
        this.cols = cols;
        this.board = new ArraySchema<number>(...(new Array<number>(rows * cols).fill(initialValue)));
        this.currentBlock = getRandomBlock();
        this.nextBlock = getRandomBlock();
    }
}
import {ArraySchema, Schema, type} from "@colyseus/schema";

export class Board extends Schema {
    @type(["number"])
    values: number[];

    @type("number")
    rows: number;

    @type("number")
    cols: number;

    constructor(rows: number = 20, cols: number = 10) {
        super();
        this.rows = rows;
        this.cols = cols;
        this.values = new ArraySchema<number>(...(new Array<number>(rows * cols).fill(0)));
    }
}
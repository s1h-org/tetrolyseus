import {Schema, type} from "@colyseus/schema";

export class Position extends Schema {
    @type("number")
    row: number;

    @type("number")
    col: number;

    constructor(row: number, col: number) {
        super();
        this.row = row;
        this.col = col;
    }
}

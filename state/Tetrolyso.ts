import {ArraySchema, Schema, type} from "@colyseus/schema";

export abstract class Tetrolyso extends Schema {
    @type(["number"])
    board: number[];

    @type("number")
    rows: number;

    @type("number")
    cols: number;

    @type("number")
    positionX: number;

    @type("number")
    positionY: number;

    protected currentValue: number;
    abstract values: number[][];

    constructor() {
        super();
        this.currentValue = 0;
    }

    rotate(): void {
        this.currentValue = (this.currentValue + 1) % this.values.length;
        this.board = new ArraySchema<number>(...(this.values[this.currentValue]))
    }
}

export type TetrolysoPreview = Omit<Tetrolyso, 'positionX' | 'positionY'>;

const BLOCKS = [
    class O extends Tetrolyso {
        values = <number[][]>[
            [1, 1, 1, 1],
        ];

        constructor() {
            super();
            this.rows = 2;
            this.cols = 2;
            this.board = new ArraySchema<number>(...(this.values[this.currentValue]));
        }
    },
    class T extends Tetrolyso {
        values = <number[][]>[
            [0, 1, 0, 1, 1, 1, 0, 0, 0],
            [0, 1, 0, 0, 1, 1, 0, 1, 0],
            [0, 0, 0, 1, 1, 1, 0, 1, 0],
            [0, 1, 0, 1, 1, 0, 0, 1, 0],
        ];

        constructor() {
            super();
            this.rows = 3;
            this.cols = 3;
            this.board = new ArraySchema<number>(...(this.values[this.currentValue]));
        }
    },
    class I extends Tetrolyso {
        values = <number[][]>[
            [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0],
        ];

        constructor() {
            super();
            this.rows = 4;
            this.cols = 4;
            this.board = new ArraySchema<number>(...(this.values[this.currentValue]));
        }
    },
    class Z extends Tetrolyso {
        values = <number[][]>[
            [1, 1, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 1, 0, 1, 1, 0, 1, 0],
        ];

        constructor() {
            super();
            this.rows = 3;
            this.cols = 3;
            this.board = new ArraySchema<number>(...(this.values[this.currentValue]));
        }
    },
    class S extends Tetrolyso {
        values = <number[][]>[
            [0, 1, 1, 1, 1, 0, 0, 0, 0],
            [1, 0, 0, 1, 1, 0, 0, 1, 0],
        ];

        constructor() {
            super();
            this.rows = 3;
            this.cols = 3;
            this.board = new ArraySchema<number>(...(this.values[this.currentValue]));
        }
    },
    class L extends Tetrolyso {
        values = <number[][]>[
            [0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 0, 0, 1, 0, 0, 1, 1],
            [0, 0, 0, 1, 1, 1, 1, 0, 0],
            [1, 1, 0, 0, 1, 0, 0, 1, 0],
        ];

        constructor() {
            super();
            this.rows = 3;
            this.cols = 3;
            this.board = new ArraySchema<number>(...(this.values[this.currentValue]));
        }
    },
    class J extends Tetrolyso {
        values = <number[][]>[
            [1, 0, 0, 1, 1, 1, 0, 0, 0],
            [0, 1, 1, 0, 1, 0, 0, 1, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 1],
            [0, 1, 0, 0, 1, 0, 1, 1, 0]
        ];

        constructor() {
            super();
            this.rows = 3;
            this.cols = 3;
            this.board = new ArraySchema<number>(...(this.values[this.currentValue]));
        }
    },
];

export const getRandomBlock = () => {
    const _getRandomBlock = <T extends Tetrolyso>(type: { new(): T }): T => {
        return new type();
    }
    const nextBlock = BLOCKS[Math.floor(Math.random() * BLOCKS.length)];
    return _getRandomBlock(nextBlock);
}


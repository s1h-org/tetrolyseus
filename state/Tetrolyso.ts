import {ArraySchema, type} from "@colyseus/schema";
import {Board} from "./Board";

export abstract class Tetrolyso extends Board {
    @type("number")
    color: number;

    protected currentOrientation: number;
    abstract orientations: number[][];

    constructor() {
        super();
        this.currentOrientation = 0;
    }

    rotate(): void {
        this.currentOrientation = (this.currentOrientation + 1) % this.orientations.length;
        this.values = new ArraySchema<number>(...(this.orientations[this.currentOrientation]))
    }
}

const BLOCKS = [
    class O extends Tetrolyso {
        orientations = <number[][]>[
            [1, 1, 1, 1],
        ];

        constructor() {
            super();
            this.rows = 2;
            this.cols = 2;
            this.values = new ArraySchema<number>(...(this.orientations[this.currentOrientation]));
            this.color = 0x008000;
        }
    },
    class T extends Tetrolyso {
        orientations = <number[][]>[
            [0, 1, 0, 1, 1, 1, 0, 0, 0],
            [0, 1, 0, 0, 1, 1, 0, 1, 0],
            [0, 0, 0, 1, 1, 1, 0, 1, 0],
            [0, 1, 0, 1, 1, 0, 0, 1, 0],
        ];

        constructor() {
            super();
            this.rows = 3;
            this.cols = 3;
            this.values = new ArraySchema<number>(...(this.orientations[this.currentOrientation]));
            this.color = 0x1E90FF;
        }
    },
    class I extends Tetrolyso {
        orientations = <number[][]>[
            [0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
            [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 0, 0, 0, 0],
            [0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0],
        ];

        constructor() {
            super();
            this.rows = 4;
            this.cols = 4;
            this.values = new ArraySchema<number>(...(this.orientations[this.currentOrientation]));
            this.color = 0xFFD700;
        }
    },
    class Z extends Tetrolyso {
        orientations = <number[][]>[
            [1, 1, 0, 0, 1, 1, 0, 0, 0],
            [0, 0, 1, 0, 1, 1, 0, 1, 0],
        ];

        constructor() {
            super();
            this.rows = 3;
            this.cols = 3;
            this.values = new ArraySchema<number>(...(this.orientations[this.currentOrientation]));
            this.color = 0xFF6347;
        }
    },
    class S extends Tetrolyso {
        orientations = <number[][]>[
            [0, 1, 1, 1, 1, 0, 0, 0, 0],
            [1, 0, 0, 1, 1, 0, 0, 1, 0],
        ];

        constructor() {
            super();
            this.rows = 3;
            this.cols = 3;
            this.values = new ArraySchema<number>(...(this.orientations[this.currentOrientation]));
            this.color = 0xBA55D3;
        }
    },
    class L extends Tetrolyso {
        orientations = <number[][]>[
            [0, 0, 1, 1, 1, 1, 0, 0, 0],
            [0, 1, 0, 0, 1, 0, 0, 1, 1],
            [0, 0, 0, 1, 1, 1, 1, 0, 0],
            [1, 1, 0, 0, 1, 0, 0, 1, 0],
        ];

        constructor() {
            super();
            this.rows = 3;
            this.cols = 3;
            this.values = new ArraySchema<number>(...(this.orientations[this.currentOrientation]));
            this.color = 0x48D1CC;
        }
    },
    class J extends Tetrolyso {
        orientations = <number[][]>[
            [1, 0, 0, 1, 1, 1, 0, 0, 0],
            [0, 1, 1, 0, 1, 0, 0, 1, 0],
            [0, 0, 0, 1, 1, 1, 0, 0, 1],
            [0, 1, 0, 0, 1, 0, 1, 1, 0]
        ];

        constructor() {
            super();
            this.rows = 3;
            this.cols = 3;
            this.values = new ArraySchema<number>(...(this.orientations[this.currentOrientation]));
            this.color = 0x7FFFD4;
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


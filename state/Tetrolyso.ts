import {ArraySchema, type} from "@colyseus/schema";
import {Board} from "./Board";

export abstract class Tetrolyso extends Board {
    @type("number")
    color: number;

    protected currentOrientation: number;
    abstract orientations: number[][];
    abstract rotate<Block extends Tetrolyso>(): Block;

    constructor() {
        super();
        this.currentOrientation = 0;
    }

    _rotate(orientation: number): void {
        this.currentOrientation = orientation;
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
            this.color = 0xcccc00;
        }

        rotate<Block extends Tetrolyso>(): Block {
            const newBlock = new O()
            const nextOrientation = (this.currentOrientation + 1) % this.orientations.length;
            newBlock._rotate(nextOrientation);
            return newBlock as Block;
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
            this.color = 0xff00ff;
        }

        rotate<Block extends Tetrolyso>(): Block {
            const newBlock = new T()
            const nextOrientation = (this.currentOrientation + 1) % this.orientations.length;
            newBlock._rotate(nextOrientation);
            return newBlock as Block;
        }
    },
    class I extends Tetrolyso {
        orientations = <number[][]>[
            [1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
            [0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0],
        ];

        constructor() {
            super();
            this.rows = 4;
            this.cols = 4;
            this.values = new ArraySchema<number>(...(this.orientations[this.currentOrientation]));
            this.color = 0x00ffff;
        }

        rotate<Block extends Tetrolyso>(): Block {
            const newBlock = new I()
            const nextOrientation = (this.currentOrientation + 1) % this.orientations.length;
            newBlock._rotate(nextOrientation);
            return newBlock as Block;
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
            this.color = 0xff4d4d;
        }

        rotate<Block extends Tetrolyso>(): Block {
            const newBlock = new Z()
            const nextOrientation = (this.currentOrientation + 1) % this.orientations.length;
            newBlock._rotate(nextOrientation);
            return newBlock as Block;
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
            this.color = 0xffff00;
        }

        rotate<Block extends Tetrolyso>(): Block {
            const newBlock = new S()
            const nextOrientation = (this.currentOrientation + 1) % this.orientations.length;
            newBlock._rotate(nextOrientation);
            return newBlock as Block;
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
            this.color = 0xffc14d;
        }

        rotate<Block extends Tetrolyso>(): Block {
            const newBlock = new L()
            const nextOrientation = (this.currentOrientation + 1) % this.orientations.length;
            newBlock._rotate(nextOrientation);
            return newBlock as Block;
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
            this.color = 0x8080ff;
        }

        rotate<Block extends Tetrolyso>(): Block {
            const newBlock = new J()
            const nextOrientation = (this.currentOrientation + 1) % this.orientations.length;
            newBlock._rotate(nextOrientation);
            return newBlock as Block;
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


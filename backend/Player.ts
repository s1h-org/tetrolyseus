export enum PlayerType {
    MOVER,
    ROTATOR
}

export class Player {
    constructor(public readonly id: string, private _ready: boolean, private readonly _type: PlayerType) {
    }

    public get isReady(): boolean {
        return this._ready
    }
    public set isReady(isReady: boolean) {
        this._ready = isReady;
    }
    public isMover(): boolean {
        return this._type === PlayerType.MOVER;
    }
    public isRotator(): boolean {
        return this._type === PlayerType.ROTATOR;
    }
}
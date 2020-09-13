import {Client, Room} from "colyseus";
import {GameState} from "../state/GameState";
import {Position} from "../state/Position";

export class TetrolyseusRoom extends Room<GameState> {
    private DEFAULT_ROWS = 20;
    private DEFAULT_COLS = 10;
    private DEFAULT_LEVEL = 0;

    private dropTetrolyso() {
        return new Position(
            this.state.currentPosition.row + 1,
            this.state.currentPosition.col
        );
    }

    onCreate(options: any) {
        this.setState(new GameState(this.DEFAULT_ROWS, this.DEFAULT_COLS, this.DEFAULT_LEVEL));
    }

    onJoin(client: Client, options: any) {
    }

    onLeave(client: Client, consented: boolean) {
    }

    onDispose() {
    }
}

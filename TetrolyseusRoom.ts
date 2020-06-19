import {Client, Room} from "colyseus";

export class TetrolyseusRoom extends Room {
    onCreate(options: any) {
        this.onMessage("type", (client, message) => {
            // handle "type" message
        });
    }

    onJoin(client: Client, options: any) {
    }

    onLeave(client: Client, consented: boolean) {
    }

    onDispose() {
    }
}

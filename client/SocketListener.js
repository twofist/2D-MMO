class SocketListener {
    constructor(gameworld) {
        this.socket = new WebSocket('ws://127.0.0.1:8080');
        //const socket = new WebSocket('wss://link.com');
		this.type = {
			MSG_USERNAME: 			0,
			MSG_CONNECTED: 			1,
			MSG_DISCONNECTED: 		2,
			MSG_ONLINE_USERS: 		3,
			MSG_ONLINE_ENEMIES: 	4,
			MSG_ONLINE_ARROWS: 		5,
			MSG_ONLINE_SLIMEBALLS:	6,
			MSG_ONLINE_GROUNDSMASH:	7,
			MSG_PLAYER_CLICK: 		10,
			MSG_UPDATE_PLAYERS: 	11,
			MSG_UPDATE_ENEMIES:		12,
			MSG_UPDATE_ARROWS: 		13,
			MSG_UPDATE_SLIMEBALLS: 	14,
			MSG_UPDATE_GROUNDSMASH: 15
		};
        
        this.gameworld = gameworld;
		this.AddEventsListeners();
    }

    AddEventsListeners() {
        this.socket.addEventListener('open', (event) => {
            this.socket.send(this.type.MSG_USERNAME + ":" + Username);
        });

        this.socket.addEventListener('close', (event) => {
            console.log("disconnected...");
        });

        this.socket.addEventListener('error', (event) => {
            console.log("an error has occured!");
        });

        this.socket.addEventListener('message', (event) => {
			const data = this.GetData(event);
			const type = this.GetType(data);
			const msg = this.GetMsg(data);
            switch (type) {
				case this.type.MSG_UPDATE_PLAYERS:
					this.UpdatePlayers(msg);
					break;
				case this.type.MSG_UPDATE_ENEMIES:
					this.UpdateEnemies(msg);
					break;
				case this.type.MSG_UPDATE_ARROWS:
					this.UpdateArrows(msg);
					break;
				case this.type.MSG_UPDATE_SLIMEBALLS:
					this.UpdateSlimeBalls(msg);
					break;
				case this.type.MSG_UPDATE_GROUNDSMASH:
					this.UpdateGroundSmash(msg);
					break;
				case this.type.MSG_CONNECTED:
                    this.PlayerConnected(msg);
                    break;
                case this.type.MSG_DISCONNECTED:
                    this.PlayerDisconnected(msg);
                    break;
                default:
                    console.log("Unknown message:", data);
                    break;
            };
        });
    }
	PlayerConnected(msg){
		//creates the new connected user
		const name = msg[0];
		if (Username === name) return;
		console.log("User connected:", name);
		this.gameworld.UpdatePlayers(msg);
	}
	PlayerDisconnected(msg){
		//removes disconnected user
		const name = msg[0];
		const id = msg[1];
		console.log("User disconnected:", name);
		this.gameworld.RemoveThisPlayer(id);
	}
	ArrowDied(msg){
		const name = msg[0];
		const id = msg[1];
		console.log("arrow died:", name)
		this.gameworld.RemoveThisArrow(id);
	}
	EnemyDied(msg){
		const name = msg[0];
		const id = msg[1];
		console.log("enemy died:", name);
		this.gameworld.RemoveThisEnemy(id);
	}
	UpdatePlayers(msg){
		this.gameworld.UpdatePlayers(msg);
	}
	UpdateArrows(msg){
		this.gameworld.UpdateArrows(msg);
	}
	UpdateSlimeBalls(msg){
		this.gameworld.UpdateSlimeBalls(msg);
	}
	UpdateGroundSmash(msg){
		this.gameworld.UpdateGroundSmash(msg);
	}
	UpdateEnemies(msg){
		this.gameworld.UpdateEnemies(msg);
	}
	GetData(event){
		return event.data;
	}
	GetType(data){
		return parseInt(data);
	}
	GetMsg(data){
		const string = data.split(":")[1];
		const msg = string.split(",");
		return msg;
	}
}
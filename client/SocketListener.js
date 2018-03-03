class SocketListener {
    constructor(gameworld) {
        this.socket = new WebSocket('ws://127.0.0.1:8080');
        //const socket = new WebSocket('wss://link.com');
		this.type = {
			MSG_USERNAME: 		0,
			MSG_CONNECTED: 		1,
			MSG_DISCONNECTED: 	4,
			MSG_ONLINE_USERS: 	7,
			MSG_ONLINE_ENEMIES: 8,
			MSG_ONLINE_ARROWS: 	9,
			MSG_PLAYER_CLICK: 	10,
			MSG_UPDATE_PLAYERS: 11,
			MSG_UPDATE_ENEMIES: 12,
			MSG_UPDATE_ARROWS: 	13
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
			//console.log("data received",event.data);
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
                case this.type.MSG_ONLINE_USERS:
                    this.UpdatePlayers(msg);
                    break;
				case this.type.MSG_ONLINE_ENEMIES:
					this.UpdateEnemies(msg);
					break;
				case this.type.MSG_ONLINE_ARROWS:
					this.UpdateArrows(msg);
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
		this.gameworld.CreatePlayers(msg);
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
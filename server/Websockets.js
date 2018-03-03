const WebSocket = require('ws');

module.exports = class Websocket{
	constructor(world){
		this.PORT = 8080; //process.env.PORT || 27689;
		this.wss = new WebSocket.Server({
			port: this.PORT
		});
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
		this.gameworld = world;
		this.Start();
		this.ReceiveFromClients();
	}
	Start(){
		console.log("Listening on", this.PORT)
	}
	PlayerConnects(data, user){
		//sends everyone who connected and sends the online users to the person who connected
		user.name = data;
		console.log(user.ip + ": " + user.name + " connected!");
		this.gameworld.SetPlayersUsername(user);
		this.gameworld.BroadcastMessage(this.type, this.type.MSG_CONNECTED, user);
		this.gameworld.SendEverything(user, this.type);
	}
	UpdateAllUsers(){
		const playerarray = this.gameworld.GetAllUsers();
		const arrowarray = this.gameworld.GetAllArrows();
		const enemyarray = this.gameworld.GetAllEnemies();
		
		const length = this.gameworld.userlist.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.gameworld.userlist[ii];
			player.Send(this.type.MSG_UPDATE_PLAYERS, playerarray);
			player.Send(this.type.MSG_UPDATE_ENEMIES, enemyarray);
			player.Send(this.type.MSG_UPDATE_ARROWS, arrowarray);
		}
	}
	PlayerDisconnects(user){
		//removes user from list and sends everyone who should be removed
		console.log(user.ip + ": " + user.name, "disconnected!");
		this.gameworld.BroadcastMessage(this.type, this.type.MSG_DISCONNECTED, user);
		this.gameworld.DeleteUser(user);
	}
	EnemyDies(enemy){
		this.gameworld.BroadcastMessage(this.type, this.type.MSG_ENEMY_DIED, enemy);
		this.gameworld.DeleteEnemy(enemy);
	}
	EnemyConnects(enemy){
		this.gameworld.BroadcastMessage(this.type, this.type.MSG_ENEMY_SPAWNED, enemy);
	}
	ArrowConnects(arrow){
		this.gameworld.BroadcastMessage(this.type, this.type.MSG_ARROW_SPAWNED, arrow);
	}
	ArrowDies(arrow){
		this.gameworld.BroadcastMessage(this.type, this.type.MSG_ARROW_DIED, arrow);
	}
	PlayerMovement(data, user){
		//sets the players controls
		data = data.split(",");
		const length = data.length
		for(let ii = 0; ii < length; ii++){
			data[ii] = ("true" == data[ii]);
		}
		const controls = {
			right: 	data[0],
			left: 	data[1],
			up: 	data[2],
			down:	data[3]
		};
		this.gameworld.SetUserControls(user, controls);
	}
	PlayerClick(data, user){
		data = data.split(",");
		this.gameworld.SetUserClick(user, data);
	}
	CheckIfConnected(ip){
		//checks if the user is online
		const online = this.gameworld.AlreadyOnline(ip);
		if(online)
			console.log("Already connected, skipping!");
		return online;
	}
	GetType(data){
		//get the type of the message
		return parseInt(data)
	}
	GetData(data, type){
		//get the data without the type
		return data.replace(type + ":", "");
	}
	CheckMessageType(data, type, user){
		switch(type){
			case this.type.MSG_UPDATE_PLAYERS:
				this.PlayerMovement(data, user);
				break;
			case this.type.MSG_PLAYER_CLICK:
				this.PlayerClick(data, user);
				break;
			case this.type.MSG_USERNAME:			
				this.PlayerConnects(data, user);
				break;
			default:
		}
	}
	ReceiveFromClients(){
		//when the server receives a message
		this.wss.on('connection', (ws, req) => {
			console.log("someone reached the server");
			const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
			
			//if(this.CheckIfConnected(ip));
				//return
			
			this.gameworld.CreatePlayer(ip, ws);
			const user = this.gameworld.GetUserData(ip);
			
			ws.on('close', () => {
				this.PlayerDisconnects(user);
			});

			ws.on('message', (data) => {
				const type = this.GetType(data);
				data = this.GetData(data, type);
				this.CheckMessageType(data, type, user)
			});
		});
	}
};
const WebSocket = require('ws');

module.exports = class Websocket{
	constructor(world){
		this.PORT = 8080; //process.env.PORT || 27689;
		this.wss = new WebSocket.Server({
			port: this.PORT
		});
		this.uniqueid = 0;
		this.type = {
			MSG_USERNAME: 			0,
			MSG_CONNECTED: 			1,
			MSG_DISCONNECTED: 		2,
			MSG_PLAYER_CLICK: 		10,
			MSG_UPDATE_PLAYERS: 	11,
			MSG_UPDATE_ENEMIES:		12,
			MSG_UPDATE_ARROWS: 		13,
			MSG_UPDATE_SLIMEBALLS: 	14,
			MSG_UPDATE_GROUNDSMASH: 15
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
		//this.gameworld.BroadcastMessage(this.type, this.type.MSG_CONNECTED, user);
		this.gameworld.SendEverything(user, this.type);
	}
	UpdateAllUsers(){
		const playerarray = this.gameworld.GetAllUsers();
		const arrowarray = this.gameworld.GetAllArrows();
		const enemyarray = this.gameworld.GetAllEnemies();
		const slimeballarray = this.gameworld.GetAllSlimeBalls();
		const groundsmasharray = this.gameworld.GetAllGroundSmash();

		const length = this.gameworld.lists.user.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.gameworld.lists.user[ii];
			player.Send(this.type.MSG_UPDATE_PLAYERS, playerarray);
			player.Send(this.type.MSG_UPDATE_ENEMIES, enemyarray);
			player.Send(this.type.MSG_UPDATE_ARROWS, arrowarray);
			player.Send(this.type.MSG_UPDATE_SLIMEBALLS, slimeballarray);
			player.Send(this.type.MSG_UPDATE_GROUNDSMASH, groundsmasharray);
		}
	}
	PlayerDisconnects(user){
		//removes user from list and sends everyone who should be removed
		console.log(user.ip + ": " + user.name, "disconnected!");
		this.gameworld.BroadcastMessage(this.type, this.type.MSG_DISCONNECTED, user);
		this.gameworld.DeleteUser(user);
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
		this.wss.on('connection', (ws, req) =>{
			ws.id = this.uniqueid++;
			this.HandleConnections(ws, req)
		});
		
		this.wss.on('error', (e) =>{
			console.error(e);
		});
	}
	HandleConnections(ws, req){
		console.log("someone reached the server");
		const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
		
		//if(this.CheckIfConnected(ip));
			//return
		
		this.gameworld.CreatePlayer(ip, ws);
		const user = this.gameworld.GetUserData(ws.id);
		
		ws.on('error', (e) =>{
			console.error(e);
		});
		
		ws.on('close', () => {
			this.PlayerDisconnects(user);
		});

		ws.on('message', (data) => {
			const type = this.GetType(data);
			data = this.GetData(data, type);
			this.CheckMessageType(data, type, user)
		});
	}
};
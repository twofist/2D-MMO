class GameWorld {
    constructor() {
		this.bounds = {
			width:3000,
			height:3000
		};
		this.canvas = document.getElementById("canvas");
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.ctx = document.getElementById("canvas").getContext("2d");
		this.lists = {
			players: 	[],
			enemies:	[],
			arrows: 	[],
			slimeballs: [],
			groundsmash:[]
		}
		this.socketlistener = new SocketListener(this);
		this.Camera = this.CreateCamera();
		this.fpscounter = new FPSCounter(0, 0, this.ctx, 5);
		this.hpbar = new HpBar(0, 0, this.ctx);
		this.arrowbar = new ArrowBar(0, 0, this.ctx);
		this.hudmodel = new HUDModel(0, 0, "blue", Username, this.ctx);
		this.player = null;
		this.WaitForConnection();
    }
	WaitForConnection(){
		let WaitTime = 1000;
		const interval = setInterval (() => { 
			if(this.socketlistener.socket.readyState === 1){
				this.DrawWorld();
				clearInterval(interval);
			}
			else if(this.socketlistener.socket.readyState === 3){
				this.NoConnection();
				clearInterval(interval);
			}
		},	WaitTime+=WaitTime);
	}
	NoConnection(){
		const element = document.getElementById("canvas");
		element.outerHTML = "No Connection to the Server could be made";
	}
    DrawWorld(){
		this.Camera.StickToPlayer();
		this.fpscounter.DrawFps();
		this.hpbar.DrawHpBar();
		this.arrowbar.DrawArrowBar();
		this.hudmodel.DrawHUDModel();
		this.DrawUsers();
		this.DrawEnemies();
		this.DrawArrows();
		this.DrawSlimeBalls();
		this.DrawGroundSmash();
		
        requestAnimationFrame(this.DrawWorld.bind(this));
    }
    ClearWorld() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
	SetCamera(id){
		this.player = this.GetSpecificUser(id);
		this.Camera.Follow(this.player);
		this.hpbar.SetCamera(this.Camera);
		this.arrowbar.SetCamera(this.Camera);
		this.fpscounter.SetCamera(this.Camera);
		this.hudmodel.SetCamera(this.Camera);
		this.hudmodel.SetName(this.player.player.name);
		this.hudmodel.SetColor(this.player.player.color);
	}
	CreateCamera(){
		const follow = {
			position:{
				x:0,
				y:0
			}
		};
		return new Camera(this.ctx, this.bounds, follow, this.canvas, 4);
	}
	DrawUsers(){
		const length = this.lists.players.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.lists.players[ii];
			if(this.Camera.IsInView(player.position, player.size))
				player.Draw();
		}
	}
	DrawArrows(){
		const length = this.lists.arrows.length;
		for(let ii = 0; ii < length; ii++){
			const arrow = this.lists.arrows[ii];
			if(this.Camera.IsInView(arrow.position, arrow.size))
				arrow.Draw();
		}
	}
	DrawGroundSmash(){
		const length = this.lists.groundsmash.length;
		for(let ii = 0; ii < length; ii++){
			const smash = this.lists.groundsmash[ii];
			if(this.Camera.IsInView(smash.position, smash.size))
				smash.Draw();
		}
	}
	DrawEnemies(){
		const length = this.lists.enemies.length;
		for(let ii = 0; ii < length; ii++){
			const enemy = this.lists.enemies[ii];
			if(this.Camera.IsInView(enemy.position, enemy.size))
				enemy.Draw();
		}
	}
	DrawSlimeBalls(){
		const length = this.lists.slimeballs.length;
		for(let ii = 0; ii < length; ii++){
			const slimeball = this.lists.slimeballs[ii];
			if(this.Camera.IsInView(slimeball.position, slimeball.size))
				slimeball.Draw();
		}
	}
	CreateDummy(){
		const obj = {
			player:{
				name:	"dummy",
				id:		666,
				width:	10,
				height: 10,
				color:	"red"
			}, position:{
				x:		320,
				y:		320
			}, stats:{
				hp:		10,
				attack:	10,
				speed:	10
			}
		};
		//this.lists.players.push(new User(obj, this.ctx))
	}
	RemoveThisPlayer(id){
		//removes player
		const player = this.GetSpecificUser(id);
		const index = this.lists.players.indexOf(player);
		this.lists.players.splice(index, 1);
	}
	RemoveThisArrow(id){
		const arrow = this.GetSpecificArrow(id);
		const index = this.lists.arrows.indexOf(arrow);
		this.lists.arrows.splice(index, 1);
	}
	RemoveThisEnemy(id){
		const enemy = this.GetSpecificEnemy(id);
		const index = this.lists.enemies.indexOf(enemy);
		this.lists.enemies.splice(index, 1);
	}
	GetSpecificUser(id){
		//returns a specific player
		const length = this.lists.players.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.lists.players[ii];
			if(player.player.id === id)
				return player;
		}
		return null;
	}
	GetSpecificArrow(id){
		const length = this.lists.arrows.length;
		for(let ii = 0; ii < length; ii++){
			const arrow = this.lists.arrows[ii];
			if(arrow.player.id === id)
				return arrow;
		}
		return null;
	}
	GetSpecificEnemy(id){
		const length = this.lists.enemies.length;
		for(let ii = 0; ii < length; ii++){
			const enemy = this.lists.enemies[ii];
			if(enemy.player.id === id)
				return enemy;
		}
		return null;
	}
	GetSpecificSlimeBall(id){
		const length = this.lists.slimeballs.length;
		for(let ii = 0; ii < length; ii++){
			const slimeball = this.lists.slimeballs[ii];
			if(slimeball.player.id === id)
				return slimeball;
		}
		return null;
	}
	GetSpecificGroundSmash(id){
		const length = this.lists.groundsmash.length;
		for(let ii = 0; ii < length; ii++){
			const smash = this.lists.groundsmash[ii];
			if(smash.player.id === id)
				return smash;
		}
		return null;
	}
	UpdatePlayers(data){
		const datasize = parseInt(data.shift());
		const amountofdata = parseInt(data.shift());
		const amount = this.CreateObjectFromData(data, datasize);
		const length = amount.length;
		for(let ii = 0; ii < length; ii++){
			const playerdata = this.HandleNewData(amount[ii]);
			let player = this.GetSpecificUser(playerdata.player.id);
			if(player !== null)
				player.Update(playerdata);
			else{
				this.lists.players.push(new User(playerdata, this.ctx))
				if(playerdata.player.name === Username){
					this.SetCamera(playerdata.player.id);
					player = this.GetSpecificUser(playerdata.player.id);
					player.AddEventsListeners(this.socketlistener);
				}
			}
		}
	}
	UpdateArrows(data){
		const datasize = parseInt(data.shift());
		const amountofdata = parseInt(data.shift());
		const amount = this.CreateObjectFromData(data, datasize);
		const length = amount.length;
		for(let ii = 0; ii < length; ii++){
			const arrowdata = this.HandleNewArrowData(amount[ii]);
			const arrow = this.GetSpecificArrow(arrowdata.player.id);
			if(arrow !== null)
				arrow.Update(arrowdata);
			else
				this.lists.arrows.push(new Arrow(arrowdata, this.ctx));
		}
	}
	UpdateSlimeBalls(data){
		const datasize = parseInt(data.shift());
		const amountofdata = parseInt(data.shift());
		const amount = this.CreateObjectFromData(data, datasize);
		const length = amount.length;
		for(let ii = 0; ii < length; ii++){
			const slimeballdata = this.HandleNewSlimeBallData(amount[ii]);
			const slimeball = this.GetSpecificSlimeBall(slimeballdata.player.id);
			if(slimeball !== null)
				slimeball.Update(slimeballdata);
			else
				this.lists.slimeballs.push(new SlimeBall(slimeballdata, this.ctx));
		}
	}
	UpdateGroundSmash(data){
		const datasize = parseInt(data.shift());
		const amountofdata = parseInt(data.shift());
		const amount = this.CreateObjectFromData(data, datasize);
		const length = amount.length;
		for(let ii = 0; ii < length; ii++){
			const smashdata = this.HandleNewGroundSmashData(amount[ii]);
			const groundsmash = this.GetSpecificGroundSmash(smashdata.player.id);
			if(groundsmash !== null)
				groundsmash.Update(smashdata);
			else
				this.lists.groundsmash.push(new GroundSmash(smashdata, this.ctx));
		}
	}
	UpdateEnemies(data){
		const datasize = parseInt(data.shift());
		const amountofdata = parseInt(data.shift());
		const amount = this.CreateObjectFromData(data, datasize);
		const length = amount.length;
		for(let ii = 0; ii < length; ii++){
			const enemydata = this.HandleNewData(amount[ii]);
			const enemy = this.GetSpecificEnemy(enemydata.player.id);
			if(enemy !== null)
				enemy.Update(enemydata);
			else
				this.lists.enemies.push(new Enemy(enemydata, this.ctx))
		}
	}
	CreateObjectFromData(data, datasize){
		//returns an array containing arrays containing the data needed to create/update a player/enemy
		const length = data.length;
		let userdata = [];
		let amount = [];
		for(let ii = 0; ii < length; ii++){
			const curdata = data[ii];
			if(!isNaN(curdata))
				userdata.push(parseFloat(curdata));
			else userdata.push(curdata);
			if(userdata.length === datasize){
				amount.push(userdata)
				userdata = [];
			}
		}
		return amount;
	}
	HandleNewArrowData(data){
		const obj = {
			player:{
				name:	data[0],
				id: 	data[1],
				color:	data[2]
			}, size: {
				width:	data[3],
				height:	data[4]
			}, position: {
				x: 		data[5],
				y: 		data[6]
			}, rotation:data[7],
			stats:{
				speed:	data[8]
			}
		}
		return obj;
	}
	HandleNewGroundSmashData(data){
		const obj = {
			player:{
				name:	data[0],
				id: 	data[1],
				color:	data[2]
			}, size: {
				width: 	data[3],
				height: data[4]
			}, rotation: {
				radian: data[5]
			}, position: {
				x: 		data[6],
				y: 		data[7]
			}, trigger: data[8], 
			stats:{
				speed:	data[9]
			}
		}
		return obj;
	}
	HandleNewSlimeBallData(data){
		const obj = {
			player:{
				name:	data[0],
				id: 	data[1],
				color:	data[2]
			}, size: {
				radius: data[3],
			}, position: {
				x: 		data[4],
				y: 		data[5]
			}, stats:{
				speed:	data[6]
			}
		}
		return obj;
	}
	HandleNewData(data){
		const obj = {
			player:{
				name:	data[0],
				id:		data[1],
				color:	data[2]
			}, size: {
				width:	data[3],
				height:	data[4]
			}, position:{
				x:		data[5],
				y:		data[6]
			}, stats:{
				maxhp:	data[7],
				hp:		data[8],
				attack:	data[9],
				speed:	data[10]
			}
		};
		return obj;
	}
}
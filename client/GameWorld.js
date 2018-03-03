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
			players: [],
			enemies: [],
			arrows: []
		}
		this.socketlistener = new SocketListener(this);
		this.Camera = this.CreateCamera();
		this.fpscounter = new FPSCounter(0, 0, this.ctx, 5);
		this.player = null;
		this.DrawWorld();
    }
    DrawWorld(){
		this.Camera.StickToPlayer();
		this.fpscounter.DrawFps();
		this.DrawUsers();
		this.DrawEnemies();
		this.DrawArrows();
		
        requestAnimationFrame(this.DrawWorld.bind(this));
    }
    ClearWorld() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
	SetCamera(id){
		this.player = this.GetSpecificUser(id);
		this.Camera.Follow(this.player);
		this.fpscounter.SetCamera(this.Camera);
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
			if(this.Camera.IsInView(player.position, player.player.size))
				player.Draw();
		}
	}
	DrawArrows(){
		const length = this.lists.arrows.length;
		for(let ii = 0; ii < length; ii++){
			const arrow = this.lists.arrows[ii];
			if(this.Camera.IsInView(arrow.position, arrow.player.size))
				arrow.Draw();
		}
	}
	DrawEnemies(){
		const length = this.lists.enemies.length;
		for(let ii = 0; ii < length; ii++){
			const enemy = this.lists.enemies[ii];
			if(this.Camera.IsInView(enemy.position, enemy.player.size))
				enemy.Draw();
		}
	}
	CreateDummy(){
		const obj = {
			player:{
				name:	"dummy",
				id:		666,
				size:	10,
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
	UpdatePlayers(data){
		const datasize = 9;
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
		const datasize = 7;
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
	UpdateEnemies(data){
		const datasize = 9;
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
				size:	data[2],
				color:	data[3]
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
				size:	data[2],
				color:	data[3]
			}, position:{
				x:		data[4],
				y:		data[5]
			}, stats:{
				hp:		data[6],
				attack:	data[7],
				speed:	data[8]
			}
		};
		return obj;
	}
}
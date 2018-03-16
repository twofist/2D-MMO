const Areas = require("./Areas/ExportAreas.js");
const Enemies = require("./Enemies/ExportEnemies.js");
const Objects = require("./Objects/ExportObjects.js");
const User = require("./User.js");
const Global = require("./Global.js");

module.exports = class GameWorld {
    constructor() {
		this.size = {
			height: 3000,
			width: 3000
		};
		this.lists = {
			user: 		[],
			area: 		[],
			enemy:		[],
			arrow:		[],
			renderarea:	[],
			slimeball: 	[],
			groundsmash:[]
		};
		this.renderdistance = 400;
		this.ids = {
			userid: 		0,
			areaid: 		0,
			enemyid:		0,
			arrowid: 		0,
			slimeballid:	0,
			groundsmashid: 	0
		};
		this.level = {
			min: 1,
			max: 20,
			difference: 3
		};
		this.area = {
			areaamount: 1,
			enemyamount: 10,
			bossamount: 1
		};
		this.global = new Global();
		this.CreateArea();
    }
    CreatePlayer(ip, socket) {
		//creates new player
        if (this.lists.user === null)
            this.CreatePlayerList();
		
		this.lists.user.push(new User(this.ids.userid++, ip, socket, this));
    }
	CreateArea(){
		//creates new area for enemies to spawn
		if (this.lists.area === null)
			this.CreateAreaList();
		
		if (this.lists.area.length < this.area.areaamount){
			const minlvl = this.global.ReturnRandomNumber(this.level.min, this.level.max);
			const maxlvl = minlvl + this.level.difference;
			const boss = false;
			this.lists.area.push(new Areas.SlimeArea(this.ids.areaid++, minlvl, maxlvl, boss));
			this.lists.area.push(new Areas.GolemArea(this.ids.areaid++, minlvl, maxlvl, boss));
		}
	}
	CreateEnemy(area){
		if(this.lists.enemy === null)
			this.CreateEnemyList();
		if (!area.boss){
			for(let ii = area.enemylist.length; ii < this.area.enemyamount; ii++){
				const E = this.NewEnemy(area);
				area.enemylist.push(E);
				this.lists.enemy.push(E);
			}
		}else if(this.boss && area.enemylist.length < this.area.bossamount){
			const E = this.NewEnemy(area);
			area.enemylist.push(E);
			this.lists.enemy.push(E);
		}
	}
	NewEnemy(area){
		if(area.type === "Slime")
			return new Enemies.Slime(this, this.ids.enemyid++, area);
		if(area.type === "Golem")
			return new Enemies.Golem(this, this.ids.enemyid++, area);
		return null;
	}
	CreateArrow(owner, radian){
		this.lists.arrow.push(new Objects.Arrow(owner, radian, this.ids.arrowid++));
	}
	CreateBall(size, owner, target, offset){
		this.lists.slimeball.push(new Objects.SlimeBall(owner, size, this.ids.slimeballid++, target, offset));
	}
	CreateGroundSmash(owner, target){
		this.lists.groundsmash.push(new Objects.GroundSmash(owner, this.ids.groundsmashid++, target));
	}
	PlayerIsCloseToArea(area){
		const uL = this.lists.user.length;
		for(let ii = 0; ii < uL; ii++){
			const U = this.lists.user[ii];
			if(this.global.GetDistance(area.position.x+area.size.width, area.position.y+area.size.height, U.position.x, U.position.y) < this.renderdistance){
				return true;
			}
		}
		return false;
	}
	SetPlayersUsername(user){
		if(!this.ValidUsername()) return;
		const player = this.GetSpecificUserBySocketId(user.socket.id);
		player.SetUsername(user.name);
	}
	ValidUsername(){
		//check if the user doesnt try to do weird shit
		return true;
	}
	GetUserData(id){
		//returns the users private data
		const player = this.GetSpecificUserBySocketId(id)
		
		return {
			name:player.player.name, 
			id:player.player.id, 
			socket:player.socket, 
			ip:player.ip
		};
	}
	DeleteUser(user){
		//removes the user from the list
		const player = this.GetSpecificUserBySocketId(user.socket.id);
		const index = this.lists.user.indexOf(player);
		this.lists.user.splice(index, 1);
	}
	AlreadyOnline(ip, name){
		//returns if a user is already online or not
		const user = {
			player:{
				name:name
			},
			ip: ip
		};
		if(this.GetSpecificUser(user) !== null)
			return true;
		return false;
	}
	GetSpecificUser(user){
		const length = this.lists.user.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.lists.user[ii];
			if(user.ip === player.ip && user.player.name === player.player.name)
				return player;
		}
		return null;
	}
	GetAllUsers(){
		//returns the stats of all the connected users
		let array = [];
		let amount = 0;
		const length = this.lists.user.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.lists.user[ii];
			array.push(
				player.player.name, 
				player.player.id,
				player.player.color,
				player.size.width,
				player.size.height,
				player.position.x, 
				player.position.y,
				player.stats.maxhp,
				player.stats.hp, 
				player.stats.attack, 
				player.stats.speed
			);
			amount++;
		}
		const datasize = 11;
		array.unshift(datasize, array.length/datasize);
		return array;
	}
	GetAllEnemies(){
		let array = [];
		let amount = 0;
		const length = this.lists.enemy.length;
		for(let ii = 0; ii < length; ii++){
			const enemy = this.lists.enemy[ii];
			array.push(
				enemy.player.name,
				enemy.player.id,
				enemy.player.color,
				enemy.size.width,
				enemy.size.height,
				enemy.position.x,
				enemy.position.y,
				enemy.stats.maxhp,
				enemy.stats.hp,
				enemy.stats.attack,
				enemy.stats.speed
			);
			amount++;
		}
		const datasize = 11;
		array.unshift(datasize, amount);
		return array;
	}
	GetAllArrows(){
		let array = [];
		let amount = 0;
		const length = this.lists.arrow.length;
		for(let ii = 0; ii < length; ii++){
			const arrow = this.lists.arrow[ii];
			array.push(
				arrow.player.name,
				arrow.player.id,
				arrow.player.color,
				arrow.size.width,
				arrow.size.height,
				arrow.position.x,
				arrow.position.y,
				arrow.rotation,
				arrow.stats.speed
			);
			amount++;
		}
		const datasize = 8;
		array.unshift(datasize, amount);
		return array;
	}
	GetAllSlimeBalls(){
		let array = [];
		let amount = 0;
		const length = this.lists.slimeball.length;
		for(let ii = 0; ii < length; ii++){
			const slimeball = this.lists.slimeball[ii];
			array.push(
				slimeball.player.name,
				slimeball.player.id,
				slimeball.player.color,
				slimeball.size.radius,
				slimeball.position.x,
				slimeball.position.y,
				slimeball.stats.speed
			);
			amount++;
		}
		const datasize = 7;
		array.unshift(datasize, amount);
		return array;
	}
	GetAllGroundSmash(){
		let array = [];
		let amount = 0;
		const length = this.lists.groundsmash.length;
		for(let ii = 0; ii < length; ii++){
			const groundsmash = this.lists.groundsmash[ii];
			array.push(
				groundsmash.player.name,
				groundsmash.player.id,
				groundsmash.player.color,
				groundsmash.size.width,
				groundsmash.size.height,
				groundsmash.rotation.radian,
				groundsmash.position.x,
				groundsmash.position.y,
				groundsmash.triggerdamage,
				groundsmash.stats.speed
			);
			amount++;
		}
		const datasize = 10;
		array.unshift(datasize, amount);
		return array;
	}
	SetUsername(user){
		//set the users name
		const player = this.GetSpecificUserBySocketId(user.socket.id);
		player.name = name;
	}
	SendEverything(user, type){
		//send the user everything that is connected
		const player = this.GetSpecificUserBySocketId(user.socket.id);
		player.Send(type.MSG_UPDATE_PLAYERS, this.GetAllUsers());
		player.Send(type.MSG_UPDATE_ENEMIES, this.GetAllEnemies());
		player.Send(type.MSG_UPDATE_ARROWS, this.GetAllArrows());
		player.Send(type.MSG_UPDATE_SLIMEBALLS, this.GetAllSlimeBalls());
		player.Send(type.MSG_UPDATE_GROUNDSMASH, this.GetAllGroundSmash());
	}
	BroadcastMessage(alltypes, type, user){
		const array = this.GetObjectData(alltypes, type, user);
		
		this.SendNewOrUpdate(alltypes, type, user, array);
	}
	SendNewOrUpdate(alltypes, type, user, array){
		//send every user the person who connected
		const length = this.lists.user.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.lists.user[ii];
			switch(type){
				case alltypes.MSG_CONNECTED:
					if(player.socket.id !== user.socket.id)
						player.Send(type, array);
					break;
				case alltypes.MSG_DISCONNECTED:
					if(player.socket.id !== user.socket.id)
						player.Send(type, array);
					break;
				default: console.log("SendNewOrUpdate, type not found", type)
			};
		}
	}
	GetUpdateData(obj){
		const array = [
			obj.player.id,
			obj.position.x,
			obj.position.y,
			obj.stats.maxhp,
			obj.stats.hp,
			obj.stats.attack
		];
		return array;
	}
	GetNewData(obj){
		const array = [
			obj.player.name, 
			obj.player.id,
			obj.player.color,
			obj.size.width,
			obj.size.height,
			obj.position.x, 
			obj.position.y,
			obj.stats.maxhp,
			obj.stats.hp, 
			obj.stats.attack, 
			obj.stats.speed
		];
		return array;
	}
	GetObjectData(alltypes, type, user){
		let array;
		const player = this.GetSpecificUserBySocketId(user.socket.id);
		
		switch(type){
			case alltypes.MSG_CONNECTED:
			//send the user every persons stats that is connected
				array = this.GetNewData(player);
				break;
			case alltypes.MSG_DISCONNECTED:
				array = this.GetNewData(player);
				break;
			default: console.log("GetObjectData type not found", type);
		};
		return array;
	}
	SetUserControls(user, controls){
		//sets the users movement keys
		const player = this.GetSpecificUserBySocketId(user.socket.id);
		player.HandleControls(controls);
	}
	SetUserClick(user, data){
		const player = this.GetSpecificUserBySocketId(user.socket.id);
		player.FireArrow(data);
	}
	GetSpecificUserById(id){
		//returns the specific user
		const length = this.lists.user.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.lists.user[ii];
			if(id === player.player.id)
				return player;
		}
		return null;
	}
	GetUsersOnIpAddress(ip){
		let array = [];
		const length = this.lists.user.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.lists.user[ii];
			if(ip === player.ip)
				array.push(player);
		}
		return array;
	}
	GetCountOnIpAddress(ip){
		let count = 0;
		const length = this.lists.user.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.lists.user[ii];
			if(ip === player.ip)
				count++;
		}
		return count;
	}
	GetSpecificUserBySocketId(id){
		//returns the specific user
		const length = this.lists.user.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.lists.user[ii];
			if(id === player.socket.id)
				return player;
		}
		return null;
	}
	GetSpecificArrow(arrow){
		const length = this.lists.arrow.length;
		for(let ii = 0; ii < length; ii++){
			const A = this.lists.arrow[ii];
			if(arrow.player.id === A.player.id)
				return A;
		}
		return null;
	}
	GetSpecificArea(area){
		const length = this.lists.area.length;
		for(let ii = 0; ii < length; ii++){
			const A = this.lists.area[ii];
			if(area.id === A.id)
				return A;
		}
		return null;
	}
	GetSpecificEnemy(enemy){
		const length = this.lists.enemy.length;
		for(let ii = 0; ii < length; ii++){
			const E = this.lists.enemy[ii];
			if(enemy.player.id === E.player.id)
				return E;
		}
		return null;
	}
	CreatePlayerList() {
        this.lists.user = [];
    }
	CreateAreaList(){
		this.lists.area = [];
	}
	CreateEnemyList(){
		this.lists.enemy = [];
	}
	CreateArrowList(){
		this.lists.arrow = [];
	}
	GetUserList() {
        return this.lists.user;
    }
	GetEnemyList(){
		return this.lists.enemy;
	}
	GetAreaList(){
		return this.lists.area;
	}
	GetArrowList(){
		return this.lists.arrow;
	}
};
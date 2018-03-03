const SlimeArea = require("./Area.js");
const User = require("./User.js");
const Global = require("./Global.js");

module.exports = class GameWorld {
    constructor() {
        this.height = 1000;
        this.width = 1000;
        this.userlist = null;
		this.arealist = null;
		this.uid = 0;
		this.aid = 0;
		this.Global = new Global();
		this.CreatePlayerList();
		this.CreateAreaList();
    }
    CreatePlayerList() {
        this.userlist = [];
    }
    CreatePlayer(ip, socket) {
		//creates new player
        if (this.userlist === null)
            this.CreatePlayerList();
		
		if(this.userlist.length < 1)
        this.userlist.push(new User(this.uid++, ip, socket));
    }
	CreateAreaList(){
		this.arealist = [];
	}
	CreateArea(){
		//creates new area for enemies to spawn
		if (this.arealist === null)
			this.CreateAreaList();
		
		if (this.arealist.length < 1){
			const minlvl = this.Global.ReturnRandomNumber(1, 30);
			const maxlvl = minlvl + 3;
			const boss = false;
			this.arealist.push(new SlimeArea(this.aid++, minlvl, maxlvl, boss));
		}
	}
	SetPlayersUsername(user){
		if(!this.ValidUsername()) return;
		const player = this.GetSpecificUser(user);
		player.SetUsername(user.name);
	}
	ValidUsername(){
		//check if the user doesnt try to do weird shit
		return true;
	}
    GetUserList() {
        return this.userlist;
    }
	GetEnemyList(){
		return this.enemylist;
	}
	GetUserData(ip){
		//returns the users private data
		const user = {ip:ip};
		const player = this.GetSpecificUser(user)
		return {
			name:player.name, 
			id:player.id, 
			socket:player.socket, 
			ip:player.ip
		};
	}
	DeleteEnemy(e){
		const enemy = this.GetSpecificEnemy(e);
		const area = this.GetSpecificArea(e.name);
		const apos = this.arealist.indexOf(area)
		const epos = this.arealist[apos].indexOf(enemy);
		this.arealist[apos].enemylist.splice(epos, 1);
	}
	DeleteUser(user){
		//removes the user from the list
		const player = this.GetSpecificUser(user);
		const position = this.userlist.indexOf(player);
		this.userlist.splice(position, 1)
	}
	AlreadyOnline(ip){
		//returns if a user is already online or not
		const user = {ip: ip};
		if(this.GetSpecificUser(user) !== null)
			return true;
		return false;
	}
	GetAllUsers(){
		//returns the stats of all the connected users
		const length = this.userlist.length;
		let array = [];
		for(let ii = 0; ii < length; ii++){
			const player = this.userlist[ii];
			array.push(
				player.player.name, 
				player.player.id,
				player.player.size,
				player.player.color,
				player.position.x, 
				player.position.y,
				player.stats.hp, 
				player.stats.attack, 
				player.stats.speed
			);
		}
		return array;
	}
	GetAllEnemies(){
		const alength = this.arealist.length;
		let array = [];
		for(let ii = 0; ii < alength; ii++){
			const area = this.arealist[ii];
			const elength = area.enemylist.length;
			for(let iii = 0; iii < elength; iii++){
				const enemy = area.enemylist[iii];
				array.push(
					enemy.player.name,
					enemy.player.id,
					enemy.player.size,
					enemy.player.color,
					enemy.position.x,
					enemy.position.y,
					enemy.stats.hp,
					enemy.stats.attack,
					enemy.stats.speed
				);
			}
		}
		return array;
	}
	GetAllArrows(){
		let array = [];
		const length = this.userlist.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.userlist[ii];
			const alength = player.arrow.arrowlist.length;
			for(let aii = 0; aii < alength; aii++){
				const arrow = player.arrow.arrowlist[ii];
				array.push(arrow.player.name,
					arrow.player.id,
					arrow.player.size,
					arrow.player.color,
					arrow.position.x,
					arrow.position.y,
					arrow.stats.speed
				);
			}
		}
		return array;
	}
	SetUsername(user){
		//set the users name
		const player = this.GetSpecificUser(user);
		player.name = name;
	}
	SendEverything(user, type){
		//send the user everything that is connected
		const player = this.GetSpecificUser(user);
		player.Send(type.MSG_ONLINE_USERS, this.GetAllUsers());
		player.Send(type.MSG_ONLINE_ENEMIES, this.GetAllEnemies());
		player.Send(type.MSG_ONLINE_ARROWS, this.GetAllArrows());
	}
	BroadcastMessage(alltypes, type, user){
		const array = this.GetObjectData(alltypes, type, user);
		
		this.SendNewOrUpdate(alltypes, type, user, array);
	}
	SendNewOrUpdate(alltypes, type, user, array){
		//send every user the person who connected
		const length = this.userlist.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.userlist[ii];
			switch(type){
				case alltypes.MSG_CONNECTED:
					if(player.ip !== user.ip)
						player.Send(type, array);
					break;
				default: player.Send(type, array)
			};
		}
	}
	GetUpdateData(obj){
		const array = [
			obj.player.id,
			obj.position.x,
			obj.position.y,
			obj.stats.hp,
			obj.stats.attack
		];
		return array;
	}
	GetNewData(obj){
		const array = [
			obj.player.name, 
			obj.player.id,
			obj.player.size,
			obj.player.color,
			obj.position.x, 
			obj.position.y,
			obj.stats.hp, 
			obj.stats.attack, 
			obj.stats.speed
		];
		return array;
	}
	GetObjectData(alltypes, type, user){
		let array;
		const player = this.GetSpecificUser(user);
		const enemy = this.GetSpecificEnemy(user);
		//const arrow = this.GetSpecificArrow(user);
		
		switch(type){
			case alltypes.MSG_UPDATE_PLAYERS:
			//send the player positions to everyone
				array = this.GetUpdateData(player);
				break;
			case alltypes.MSG_ONLINE_ENEMIES:
			//send the enemy positions to everyone
				array = this.GetUpdateData(enemy);
				break;
			case alltypes.MSG_ENEMY_SPAWNED:
				array = this.GetNewData(enemy);
				break;
			case alltypes.MSG_ARROW_SPAWNED:
				//array = this.GetNewData(arrow);
				break;
			case alltypes.MSG_CONNECTED:
			//send the user every persons stats that is connected
				array = this.GetNewData(player);
				break;
			default: console.log("broadcasting type not found");
		};
		return array;
	}
	SetUserControls(user, controls){
		//sets the users movement keys
		const player = this.GetSpecificUser(user);
		player.HandleControls(controls);
	}
	SetUserClick(user, data){
		const player = this.GetSpecificUser(user);
		player.FireArrow(data);
	}
	GetSpecificUser(user){
		//returns the specific user
		let length = this.userlist.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.userlist[ii];
			if(user.ip === player.ip)
				return player;
		}
		return null;
	}
	GetSpecificArrow(user){
		let length = this.userlist.length;
		for(let ii = 0; ii < length; ii++){
			const player = this.userlist[ii];
			if(player.id === user.owner.player.id){
				for(let aii = 0; aii < alength; aii++){
					const arrow = player.arrow.allarrows[aii];
					if(user.id === arrow.id)
						return arrow;
				}
			}
		}
		return null;
	}
	GetSpecificArea(e){
		const length = this.arealist.length;
		for(let ii = 0; ii < length; ii++){
			const area = this.arealist[ii];
			if(area.type === e.name)
				return area;
		}
		return null;
	}
	GetSpecificEnemy(user){
		let length = this.arealist.length;
		for(let ii = 0; ii < length; ii++){
			const area = this.arealist[ii];
			if(area.type === user.name){
				const elength = area.enemylist.length
				for(let iii = 0; iii < elength; iii++){
					const enemy = area.enemylist[ii];
					if(user.id === enemy.id)
						return enemy;
				}
			}
		}
		return null;
	}
};
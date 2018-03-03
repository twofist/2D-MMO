const Global = require("./Global.js");
const Timeout = require("./Timeout.js");

module.exports = class Enemy {
    constructor(eid, area, sizearea, boss, monsterlevel, type) {
		this.position = {
			x: null,
			y: null
		};
		this.velocity = {
			vx: null,
			vy: null
		};
		this.stats = {
			boss: boss,
			level: null,
			hp: null,
			attack: null,
			speed: null
		};
		this.player = {
			id: eid,
			name: type,
			size: null,
			color: "blue",
			sight: null,
			state: null
		};
		this.target = null;
		this.monsterlevel = monsterlevel;
		this.wanderarea = {
			x: area.x,
			y: area.y,
			size: sizearea
		};
		this.insight = [];
		this.Global = new Global();
		this.Timeout = null;
		this.InitializeEnemy();
    }
	InitializeEnemy(){
		const special = this.AddBossStats();
		this.stats.level = this.Global.ReturnRandomNumber(this.monsterlevel[0], this.monsterlevel[1]);
		this.stats.speed = 1;
		this.stats.hp = (this.stats.level + 5) + this.Global.ReturnRandomNumber(0, 2) + special;
		this.stats.attack = (this.stats.level * 2) + this.Global.ReturnRandomNumber(0, 2) + special;
		this.player.size = 5 + this.stats.level + special;
		this.player.sight = this.player.size;
		this.position.x = this.Global.ReturnRandomNumber(this.wanderarea.x, this.wanderarea.x+this.wanderarea.size);
		this.position.y = this.Global.ReturnRandomNumber(this.wanderarea.y, this.wanderarea.y-this.wanderarea.size);
		this.target = {
			position:{
				x:this.position.x,
				y:this.position.y
			}
		};
	}
	AddBossStats(){
		if(this.stats.boss)
			return this.Global.ReturnRandomNumber(5, 15);
		return 0;
	}
	MoveToTarget(){
		//moves to the targets x and y position
		const tx = this.target.position.x;
		const ty = this.target.position.y;
		const spd = this.stats.speed;
		if(this.Global.GetDistance(this.position.x, this.position.y, tx, ty) > spd){
			const radian = this.Global.GetRadian(this.position.x, this.position.y, tx, ty);
			
			const dirx = this.Global.GetDirectionX(radian, spd);
			const diry = this.Global.GetDirectionY(radian, spd);

			this.velocity.vx = dirx;
			this.velocity.vy = diry;
			
			this.position.x += this.velocity.vx;
			this.position.y += this.velocity.vy;
		}
	}
	CheckForPlayerInsight(userlist){
		//checks if a user is insight of the monster
		const length = userlist.length;
		for(let ii = 0; ii < length; ii++){
			const user = userlist[ii];
			const distance = this.Global.GetDistance(this.position.x, this.position.y, user.position.x, user.position.y);
			if(!this.insight.includes(user) && distance < this.player.sight)
				this.UserInsight(user, distance);
			if(this.insight.includes(user) && distance > this.player.sight)
				this.UserOutOfSight(user);
		}
	}
	GetPosition(distance){
		//returns where the user should be placed based on distance
		const len = this.insight.length;
		for(let ii = 0; ii < len; ii++){
			const insightuser = this.insight[ii];
			const otherdistance = this.Global.GetDistance(this.position.x, this.position.y, insightuser.position.x, insightuser.position.y);
			if(distance < otherdistance)
				return ii;
		}
		return len;
	}
	UserInsight(user, distance){
		//add user insight
		this.insight.splice(this.GetPosition(distance), 0, user);
	}
	UserOutOfSight(user){
		//remove user out of sight
		this.insight.splice(this.insight.indexOf(user), 1);
	}
	SetTarget(){
		//sets target position otherwise random position within area
		if(this.insight.length > 0){
			//Cancel target area and chase player
			if(this.Timeout !== null && this.Timeout.isRunning())
				this.Timeout.Stop();
			this.target = this.insight[0];
			this.player.state = "chase";
		}else if(this.insight.length === 0 && (this.Timeout === null || !this.Timeout.isRunning()) &&
		this.Global.GetDistance(this.position.x, this.position.y, this.target.position.x, this.target.position.y) < this.stats.speed
		){
			//choose a new target area to walk to after X seconds
			this.Timeout = new Timeout(()=>{
				this.target = {
					position:{
						x: this.Global.ReturnRandomNumber(this.wanderarea.x, this.wanderarea.x+this.wanderarea.size),
						y: this.Global.ReturnRandomNumber(this.wanderarea.y, this.wanderarea.y-this.wanderarea.size)
					}
				};
				this.Timeout.Stop();
			}, this.Global.ReturnRandomNumber(1000, 4000));
			this.player.state = "wander";
		}
	}
};
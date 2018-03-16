const Global = require("../Global.js");
const Timers = require("../Timers/ExportTimers.js");

module.exports = class LifeForm {
    constructor(world, id, area) {
		this.position = {
			x: null,
			y: null
		};
		this.velocity = {
			vx: null,
			vy: null
		};
		this.stats = {
			boss: area.boss,
			level: null,
			maxhp: null,
			hp: null,
			minhp: 0,
			attack: null,
			speed: null
		};
		this.player = {
			id: id,
			name: area.type,
			color: "blue",
			sight: null,
			state: null
		};
		this.size = {
			width: null,
			height: null
		}
		this.target = null;
		this.monsterlevel = area.monsterlevel;
		this.wanderarea = {
			x: area.position.x,
			y: area.position.y,
			width: area.size.width,
			height: area.size.height
		};
		this.diversity = 3;
		this.startinghp = 5;
		this.minimumsight = 10;
		this.insight = [];
		this.Global = new Global();
		this.gameworld = world;
		this.Timeout = null;
		this.Initialize();
    }
	Initialize(){
		const special = this.AddBossStats();
		this.InitializeStats(special);
		this.InitializeSize(special);
		this.InitializePlayer();
		this.InitializePosition();
		this.InitializeTarget();
	}
	InitializeStats(special){
		this.stats.level = this.Global.ReturnRandomNumber(this.monsterlevel[0], this.monsterlevel[1]);
		this.stats.speed = 0.5;
		this.stats.maxhp = (this.stats.level + this.startinghp) + this.Global.ReturnRandomNumber(0, this.diversity) + special;
		this.stats.hp = this.stats.maxhp;
		this.stats.attack = (this.stats.level * 2) + this.Global.ReturnRandomNumber(0, this.diversity) + special;
	}
	InitializeSize(special){
		this.size.width = this.stats.level + special;
		this.size.height = this.size.width;
	}
	InitializePlayer(){
		this.player.sight = this.minimumsight + this.size.width + this.size.height * 2;
	}
	InitializePosition(){
		this.position.x = this.Global.ReturnRandomNumber(this.wanderarea.x, this.wanderarea.x+this.wanderarea.width);
		this.position.y = this.Global.ReturnRandomNumber(this.wanderarea.y, this.wanderarea.y+this.wanderarea.height);
	}
	InitializeTarget(){
		this.target = {
			position:{
				x: this.position.x,
				y: this.position.y
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
		const lenght = this.insight.length;
		for(let ii = 0; ii < lenght; ii++){
			const insightuser = this.insight[ii];
			const otherdistance = this.Global.GetDistance(this.position.x, this.position.y, insightuser.position.x, insightuser.position.y);
			if(distance < otherdistance)
				return ii;
		}
		return lenght;
	}
	UserInsight(user, distance){
		//add user insight
		this.insight.splice(this.GetPosition(distance), 0, user);
	}
	UserOutOfSight(user){
		//remove user out of sight
		this.insight.splice(this.insight.indexOf(user), 1);
		if(this.insight.length === 0)
			this.SetRandomTarget();
	}
	SetTarget(){
		//sets target position otherwise random position within area
		if(this.insight.length > 0){
			this.SetUserTarget();
			this.BossAttack();
		}else if(this.insight.length === 0 && (this.Timeout === null || !this.Timeout.isRunning()) &&
		this.Global.GetDistance(this.position.x, this.position.y, this.target.position.x, this.target.position.y) < this.stats.speed)
			this.SetRandomTarget();
	}
	SetUserTarget(){
		//Cancel target area and chase player
		if(this.Timeout !== null && this.Timeout.isRunning())
				this.Timeout.Stop();
		this.target = this.insight[0];
		this.player.state = "chase";
	}
	SetRandomTarget(){
		//choose a new target area to walk to after X seconds
		this.Timeout = new Timers.Timeout(()=>{
			this.target = {
				position:{
					x: this.Global.ReturnRandomNumber(this.wanderarea.x, this.wanderarea.x+this.wanderarea.width),
					y: this.Global.ReturnRandomNumber(this.wanderarea.y, this.wanderarea.y+this.wanderarea.height)
				}
			};
			this.Timeout.Stop();
		}, this.Global.ReturnRandomNumber(1000, 4000));
		this.player.state = "wander";
	}
};
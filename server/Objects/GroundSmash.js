const Global = require("../Global.js");
const Timers = require("../Timers/ExportTimers.js");

module.exports = class GroundSmash{
	constructor(owner, id, target){
		this.Global = new Global();
		this.position = {
			x: owner.position.x + owner.size.width/2,
			y: owner.position.y + owner.size.height/2
		};
		this.target = target;
		this.gameworld = owner.gameworld;
		this.originalposition = {
			x: owner.position.x + owner.size.width/2,
			y: owner.position.y + owner.size.height/2,
			tx: target.position.x + target.size.width/2,
			ty: target.position.y + target.size.height/2
		}
		this.player = {
			name: "GroundSmash",
			id: id,
			color: owner.player.color
		}
		this.size = {
			width: 5,
			height: this.SetSmashHeight()
		}
		this.velocity = {
			vx:null,
			vy:null
		};
		this.stats = {
			speed: 1,
			range: owner.stats.range,
			damage: owner.stats.attack
		};
		this.rotation = {
			radian: this.SetTargetRadian()
		}
		this.triggertimeout = null;
		this.stopdamage = null;
		this.triggerdamage = false;
		this.owner = owner;
		this.hitobject = false;
		this.TriggerAttack();
	}
	SetTargetRadian(){
		const radian = this.Global.GetDegree(
			this.originalposition.x, this.originalposition.y, 
			this.originalposition.tx, this.originalposition.ty
		);
		return radian;
	}
	SetSmashHeight(){
		const height = this.Global.GetDistance(this.originalposition.x, this.originalposition.y, this.originalposition.tx, this.originalposition.ty) + 20;
		return height;
	}
	DeleteSmash(){
		const index = this.gameworld.lists.groundsmash.indexOf(this);
		this.gameworld.lists.groundsmash.splice(index, 1);
	}
	TriggerAttack(){
		this.triggertimeout = new Timers.Timeout(() =>{
			this.triggerdamage = true;
			this.triggertimeout.Stop();
			this.stopdamage = new Timers.Timeout(() =>{
				this.triggerdamage = false;
				this.stopdamage.Stop();
				this.DeleteSmash();
			}, 1000);
		}, 1000);
	}
};
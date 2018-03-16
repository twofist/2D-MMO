const Global = require("../Global.js")

module.exports = class Ball{
	constructor(owner, size, id, target, offset){
		this.position = {
			x: owner.position.x + owner.size.width/2,
			y: owner.position.y + owner.size.height/2
		};
		this.target = target;
		this.targetradian = null;
		this.gameworld = owner.gameworld;
		this.originalposition = {
			x: owner.position.x + owner.size.width/2,
			y: owner.position.y + owner.size.height/2
		}
		this.player = {
			name: "SlimeBall",
			id: id,
			color: owner.player.color
		}
		this.offset = (offset*8) - 16;
		this.size = {
			width: null,
			height: null,
			radius: size
		};
		this.velocity = {
			vx: null,
			vy: null
		};
		this.stats = {
			speed: 2,
			range: owner.slimeball.range,
			damage: owner.stats.attack
		};
		this.owner = owner;
		this.Global = new Global();
		this.hitobject = false;
		this.SetTargetPosition();
	}
	SetTargetPosition(){
		this.targetradian = this.Global.GetRadian(
			this.owner.position.x+this.owner.size.width/2, this.owner.position.y+this.owner.size.height/2, 
			this.target.position.x+this.offset+this.target.size.width/2, this.target.position.y+this.offset+this.target.size.height/2
		);
	}
	MoveBall(){
		const dirx = this.Global.GetDirectionX(this.targetradian, this.stats.speed);
		const diry = this.Global.GetDirectionY(this.targetradian, this.stats.speed);

		this.velocity.vx = dirx;
		this.velocity.vy = diry;
	
		this.position.x += this.velocity.vx;
		this.position.y += this.velocity.vy;

		if(this.Global.GetDistance(this.position.x, this.position.y, this.originalposition.x, this.originalposition.y) > this.owner.slimeball.range)
			this.DeleteBall();
	}
	DeleteBall(){
		const index = this.gameworld.lists.slimeball.indexOf(this);
		this.gameworld.lists.slimeball.splice(index, 1);
	}
};
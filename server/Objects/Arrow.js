const Global = require("../Global.js")

module.exports = class Arrow{
	constructor(owner, radian, id){
		this.Global = new Global();
		this.position = {
			x: owner.position.x + owner.size.width/2,
			y: owner.position.y + owner.size.height/2
		};
		this.target = {
			position:{
				x:null,
				y:null,
				radian: radian
			}
		};
		this.gameworld = owner.gameworld;
		this.originalposition = {
			x: owner.position.x + owner.size.width/2,
			y: owner.position.y + owner.size.height/2
		}
		this.player = {
			name: "arrow",
			id: id,
			color: owner.player.color
		}
		this.size = {
			width: 1,
			height: 3
		}
		this.rotation = radian * (180/Math.PI);
		this.velocity = {
			vx:null,
			vy:null
		};
		this.stats = {
			speed: 1,
			range: owner.stats.range,
			damage: owner.stats.attack
		};
		this.owner = owner;
		this.hitobject = false;
	}
	MoveArrow(){
			const dirx = this.Global.GetDirectionX(this.target.position.radian, this.stats.speed);
			const diry = this.Global.GetDirectionY(this.target.position.radian, this.stats.speed);

			this.velocity.vx = dirx;
			this.velocity.vy = diry;
		
			this.position.x += this.velocity.vx;
			this.position.y += this.velocity.vy;
		if(this.Global.GetDistance(this.position.x, this.position.y, this.originalposition.x, this.originalposition.y) > this.stats.range)
			this.DeleteArrow();
	}
	DeleteArrow(){
		const index = this.gameworld.lists.arrow.indexOf(this);
		this.gameworld.lists.arrow.splice(index, 1);
	}
};
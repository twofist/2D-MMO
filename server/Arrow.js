const Global = require("./Global.js")

module.exports = class Arrow{
	constructor(owner, tx, ty, id){
		this.position = {
			x: owner.position.x + owner.player.size/2,
			y: owner.position.y + owner.player.size/2
		};
		this.target = {
			position:{
				x:tx,
				y:ty
			}
		};
		this.player = {
			name: "arrow",
			id: id,
			size:1,
			color: owner.player.color
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
		this.owner = owner;
		this.Global = new Global();
		this.hitobject = false;
	}
	MoveArrow(){
		const distance = this.Global.GetDistance(this.position.x, this.position.y, this.target.position.x, this.target.position.y);
		if(distance > this.stats.speed){
			const radian = this.Global.GetRadian(this.position.x, this.position.y, this.target.position.x, this.target.position.y);
			
			const dirx = this.Global.GetDirectionX(radian, this.stats.speed);
			const diry = this.Global.GetDirectionY(radian, this.stats.speed);
			
			this.velocity.vx = dirx;
			this.velocity.vy = diry;
			
			this.position.x += this.velocity.vx;
			this.position.y += this.velocity.vy;
		}//else
			//this.DeleteArrow();
	}
	DeleteArrow(){
		const index = this.owner.arrow.indexOf(this);
		this.owner.arrow.splice(index, 1);
	}
};
class SlimeBall {
    constructor(obj, ctx) {
        this.player = {
			name: 	obj.player.name,
			id: 	obj.player.id,
			color: 	obj.player.color
		};
		this.position = {
			x: obj.position.x,
			y: obj.position.y
		};
		this.size = {
			width:	obj.size.radius,
			height:	obj.size.radius,
			radius: obj.size.radius
		}
		this.stats = {
			speed: 	obj.stats.speed
		};
		this.velocity = {
			vx: null,
			vy: null
		};
		this.ctx = ctx;
		//this.Global = new Global();
    }
	Draw(){
		this.ctx.beginPath();
		this.ctx.arc(this.position.x, this.position.y, this.size.radius, 0, 2 * Math.PI);
		this.ctx.fillStyle = this.player.color;
		this.ctx.fill();
		this.ctx.font = this.size.width/2 + "px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.player.name, this.position.x + this.size.width/2, this.position.y - 3);
		this.ctx.closePath();
	}
	Update(data){
		this.position.x = data.position.x;
		this.position.y = data.position.y;
	}
}
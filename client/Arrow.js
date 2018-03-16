class Arrow {
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
			width:	obj.size.width,
			height:	obj.size.height
		}
		this.rotation = obj.rotation;
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
		this.ctx.save();
		this.ctx.beginPath();
		this.ctx.translate(this.position.x,this.position.y);
		this.ctx.rotate(this.rotation*(Math.PI/180)*-1);
		this.ctx.translate(-this.position.x,-this.position.y);
		this.ctx.fillStyle = this.player.color;
		this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        this.ctx.fill();
        this.ctx.font = this.size.width/2 + "px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.player.name, this.position.x + this.size.width/2, this.position.y - 3);
		this.ctx.closePath();
		this.ctx.restore();
	}
	Update(data){
		this.position.x = data.position.x;
		this.position.y = data.position.y;
	}
}
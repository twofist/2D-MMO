class GroundSmash {
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
		this.stats = {
			speed: 	obj.stats.speed
		};
		this.velocity = {
			vx: null,
			vy: null
		};
		this.trigger = (obj.trigger == "true");
		this.rotation = {
			degree: obj.rotation.radian*(Math.PI/180)*-1
		};
		this.alpha = 0.5;
		this.ctx = ctx;
		this.spike = {
			width: 3,
			height: 4
		};
		//this.Global = new Global();
    }
	Draw(){
		this.ctx.beginPath();
		this.ctx.save();
		this.ctx.globalAlpha = this.alpha;
		this.ctx.translate(this.position.x,this.position.y);
		this.ctx.rotate(this.rotation.degree);
		this.ctx.translate(-this.position.x,-this.position.y);
		this.ctx.fillStyle = this.player.color;
		this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        this.ctx.fill();
        this.ctx.font = this.size.width/2 + "px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.player.name, this.position.x + this.size.width/2, this.position.y - 3);
		this.ctx.restore();
		if(this.trigger){
			const length = this.size.height / this.spike.height;
			for(let ii = 0; ii < length; ii++){
				const spike = new GroundSpike(this.position, this.spike, this.player.color, this.ctx, ii, this.rotation.degree);
				spike.Draw();
			}
		}
		
		this.ctx.closePath();
	}
	Update(data){
		this.trigger = (data.trigger == "true");
		this.position.x = data.position.x;
		this.position.y = data.position.y;
	}
}
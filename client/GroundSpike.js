class GroundSpike {
    constructor(position, size, color, ctx, offset, direction) {
        this.player = {
			color: 	color
		};
		this.position = {
			x: position.x + (Math.sin(direction) * (offset*size.width) * -1),
			y: position.y + (Math.cos(direction) * (offset*size.height))
		};
		this.size = {
			width:	size.width,
			height:	size.height
		}
		this.stats = {
			speed: 	1
		};
		this.velocity = {
			vx: null,
			vy: null
		};
		this.offset = offset;
		this.rotation = {
			degree: 180*(Math.PI/180)
		};
		this.alpha = 0.8;
		this.ctx = ctx;
		//this.Global = new Global();
    }
	Draw(){
		this.ctx.save();
		this.ctx.translate(this.position.x, this.position.y);
		this.ctx.rotate(this.rotation.degree);
		this.ctx.translate(-this.position.x, -this.position.y);
		this.ctx.globalAlpha = this.alpha;
		this.ctx.fillStyle = this.player.color;
		this.ctx.moveTo(this.position.x, this.position.y);
		this.ctx.lineTo(this.position.x + this.size.width, this.position.y);
		this.ctx.lineTo(this.position.x + (this.size.width/2), this.position.y + this.size.height);
		this.ctx.fill();
		this.ctx.restore();
	}
}
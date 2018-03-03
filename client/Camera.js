class Camera {
    constructor(ctx, world, follow, canvas, scale) {
		this.position = {
			x:0,
			y:0,
			left:0,
			top:0,
			right:0,
			bottom:0
		};
		this.scale = scale;
		this.ctx = ctx;
		this.bounds = world;
		this.follow = follow;
		this.size = {
			width: canvas.width,
			height: canvas.height,
		};
		this.halfsize = {
			width: this.size.width/2/this.scale,
			height: this.size.height/2/this.scale
		}
		this.center = {
			x:0,
			y:0
		};
    }
	Follow(player){
		this.follow = player;
	}
	IsInView(position, size){
		const left = position.x;
		const top = position.y;
		const right = position.x + size;
		const bottom = position.y + size;

		if(left < this.position.right && right > this.position.left && bottom > this.position.top && top < this.position.bottom)
			return true;
		
		return false;
	}
	SetCenter(){
		this.center.x = -this.position.x + this.halfsize.width;
		this.center.y = -this.position.y + this.halfsize.height;
		this.ctx.translate(this.center.x, this.center.y);
	}
	SetPosition(){
		//sets the positions according to the camera position
		this.position.x = this.follow.position.x;
		this.position.y = this.follow.position.y;
		this.position.left = this.position.x - this.halfsize.width;
		this.position.top = this.position.y - this.halfsize.height;
		this.position.right = this.position.x + this.halfsize.width;
		this.position.bottom = this.position.y + this.halfsize.height;
	}
	StickToPlayer(){
		this.ctx.setTransform(this.scale, 0, 0, this.scale, 0, 0);
		this.ctx.clearRect(0, 0, this.size.width, this.size.height);

		this.SetPosition();
		this.SetCenter();
	}
}
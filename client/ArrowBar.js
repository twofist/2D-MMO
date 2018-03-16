class ArrowBar{
    constructor(x, y, ctx) {
        this.color = "green";
		this.Camera = null;
		this.position = {
			x: x,
			y: y
		};
		this.radius = {
			inner: 15,
			outer: 20
		};
		this.angle = {
			start: 0*Math.PI,
			end: 1*Math.PI
		}
		this.ctx = ctx;
    }
    DrawArrowBar() {
		this.SetPosition();
        this.Draw();
    }
	Draw(){
		this.ctx.beginPath();
		this.ctx.save();
		this.ctx.globalAlpha = 0.8;
		this.ctx.arc(this.position.x+this.radius.outer, this.position.y, this.radius.outer, this.angle.start, this.angle.end, true);
		this.ctx.arc(this.position.x+this.radius.outer, this.position.y, this.radius.inner, this.angle.end, this.angle.start, false);
		this.ctx.fillStyle = this.color;
		this.ctx.fill();
		this.ctx.restore();
		this.ctx.closePath();
	}
	SetCamera(obj){
		this.Camera = obj;
	}
	SetPosition(){
		if(this.Camera === null) return;
		this.position.x = this.Camera.position.left;
		this.position.y = this.Camera.position.bottom - this.radius.outer;
	}
}
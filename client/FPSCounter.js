class FPSCounter {
    constructor(x, y, ctx, size) {
        this.lastcalledtime = Date.now();
        this.fps = 0;
        this.font = size + "px Arial";
        this.color = "white";
        this.text = "FPS: ";
		this.Camera = null;
        this.x = x;
        this.y = y + parseInt(this.font);
		this.ctx = ctx;
    }
	CalcFps(){
		const delta = (Date.now() - this.lastcalledtime) / 1000;
        this.lastcalledtime = Date.now();
        this.fps = 1 / delta;
	}
    DrawFps() {
		this.SetPosition();
		this.CalcFps();
        this.Draw();
    }
	Draw(){
		this.ctx.font = this.font;
        this.ctx.fillStyle = this.color;
        this.ctx.textAlign = "left";
        this.ctx.fillText(this.text + Math.round(this.fps), this.x, this.y);
	}
	SetCamera(obj){
		this.Camera = obj;
	}
	SetPosition(){
		if(this.Camera === null) return;
		this.x = this.Camera.position.left;
		this.y = this.Camera.position.top + parseInt(this.font);
	}
}
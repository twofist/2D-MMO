class HUDModel{
    constructor(x, y, color, name, ctx) {
		this.player = {
			color: color,
			name: name
		}
		this.Camera = null;
		this.position = {
			x: x,
			y: y
		};
		this.size = {
			width: 10,
			height: 10
		};
		this.ctx = ctx;
    }
    DrawHUDModel() {
		this.SetPosition();
        this.Draw();
    }
	Draw(){
		this.ctx.beginPath();
		this.ctx.save();
		this.ctx.globalAlpha = 0.8;
		this.ctx.fillStyle = this.player.color;
		this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
		this.ctx.fill();
        this.ctx.font = this.size.width/2 + "px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.player.name, this.position.x + this.size.width/2, this.position.y - 3);
		this.ctx.restore();
		this.ctx.closePath();
	}
	SetName(name){
		this.player.name = name;
	}
	SetColor(color){
		this.player.color = color;
	}
	SetCamera(obj){
		this.Camera = obj;
	}
	SetPosition(){
		if(this.Camera === null) return;
		this.position.x = this.Camera.position.left + (this.size.width+this.size.width/2);
		this.position.y = this.Camera.position.bottom - (this.size.height*2);
	}
}
class Enemy {
    constructor(obj, ctx) {
        this.player = {
			name: 	obj.player.name,
			id: 	obj.player.id,
			size: 	obj.player.size,
			color: 	obj.player.color
		};
		this.position = {
			x: obj.position.x,
			y: obj.position.y
		};
		this.stats = {
			hp: 	obj.stats.hp,
			attack: obj.stats.attack,
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
		this.ctx.fillStyle = this.player.color;
		this.ctx.fillRect(this.position.x, this.position.y, this.player.size, this.player.size);
        this.ctx.fill();
        this.ctx.font = this.player.size/2 + "px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.player.name, this.position.x + this.player.size/2, this.position.y - 3);
		this.ctx.closePath();
	}
	Update(data){
		this.position.x = data.position.x;
		this.position.y = data.position.y;
		this.stats.hp = data.stats.hp;
		this.stats.attack = data.stats.attack;
	}
}
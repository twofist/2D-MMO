class User {
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
		this.controls = {
			right:		false,
			left:		false,
			up:			false,
			down:		false,
			attackbtn:	false
		};
		this.ctx = ctx;
		this.arrowtimeout = null;
		this.socketlistener = null;
		//this.Global = new Global();
    }
    SendToSocket(type, data) {
        this.socketlistener.socket.send(type + ":" + data);
    }
    AddEventsListeners(socket) {
		this.socketlistener = socket;
		window.addEventListener("click", (e) => {
			this.SendToSocket(this.socketlistener.type.MSG_PLAYER_CLICK, [e.x, e.y]);
		});
        window.addEventListener("keydown", (e) => {
            switch (e.keyCode) {
                case 68:
                    this.controls.right = true;
                    break;
                case 65:
                    this.controls.left = true;
                    break;
				case 87:
					this.controls.up = true;
					break;
				case 83:
					this.controls.down = true;
                default:
            }
			const controls = [this.controls.right, this.controls.left, this.controls.up, this.controls.down];
			this.SendToSocket(this.socketlistener.type.MSG_UPDATE_PLAYERS, controls);
        });
        window.addEventListener("keyup", (e) => {
            switch (e.keyCode) {
                case 68:
                    this.controls.right = false;
                    break;
                case 65:
                    this.controls.left = false;
                    break;
				case 87:
					this.controls.up = false;
					break;
				case 83:
					this.controls.down = false;
                default:
            }
			const controls = [this.controls.right, this.controls.left, this.controls.up, this.controls.down];
			this.SendToSocket(this.socketlistener.type.MSG_UPDATE_PLAYERS, controls);
        });
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
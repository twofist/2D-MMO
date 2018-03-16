class User {
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
			width: obj.size.width,
			height: obj.size.height
		}
		this.stats = {
			maxhp: 	obj.stats.maxhp,
			hp: 	obj.stats.hp,
			minhp: 	0,
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
		this.camera = null;
		//this.Global = new Global();
    }
    SendToSocket(type, data) {
        this.socketlistener.socket.send(type + ":" + data);
    }
    AddEventsListeners(socket) {
		this.socketlistener = socket;
		window.addEventListener("click", (e) => {
			const data = this.GetRadian(this.camera.size.width/2, this.camera.size.height/2, e.x, e.y);
			this.SendToSocket(this.socketlistener.type.MSG_PLAYER_CLICK, data);
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
	GetRadian(x, y, tx, ty){
		const xdis = tx - x;
		const ydis = ty - y;
		const radian = Math.atan2(xdis,ydis);
		return radian;
	}
	Draw(){
		this.ctx.beginPath();
		this.ctx.fillStyle = this.player.color;
		this.ctx.fillRect(this.position.x, this.position.y, this.size.width, this.size.height);
        this.ctx.fill();
        this.ctx.font = this.size.width/2 + "px Arial";
        this.ctx.textAlign = "center";
        this.ctx.fillText(this.player.name, this.position.x + this.size.width/2, this.position.y - 3);
		this.ctx.closePath();
	}
	Update(data){
		this.position.x = data.position.x;
		this.position.y = data.position.y;
		this.stats.hp = data.stats.hp;
		this.stats.attack = data.stats.attack;
	}
}
const Global = require("./Global.js");
const Timers = require("./Timers/ExportTimers.js");

module.exports = class User {
    constructor(uid, ip, socket, world) {
        this.ip = ip !== void 0 ? ip : "";
        this.socket = socket;
		this.gameworld = world;
		this.player = {
			name: "test",
			id: uid,
			color: "blue"
		};
		this.size = {
			width: 5,
			height: 5
		}
		this.position = {
			x:320,
			y:320
		};
		this.center = {
			x:null,
			y:null
		}
		this.stats = {
			maxhp: 10,
			hp: 10,
			minhp: 0,
			attack: 1,
			speed: 0.8,
			range: 30
		};
		this.velocity = {
			vx: null,
			vy: null
		};
		this.controls = {
			right: false,
			left: false,
			up: false,
			down: false
		};
		this.arrow = {
			arrowtimeout: null
		}
		this.Global = new Global();
        if (!this.socket) {
            throw new Error("Fatal error, user", this.id, "got no socket!");
        }
    }
    Send(type, msg) {
		if(this.socket.readyState === 1 && msg.length > 0)
			this.socket.send(type + ":" + msg);
    }
    SetUsername(data) {
        this.player.name = data;
    }
    ApplyMovement() {
		//fix player movement later
		
		this.velocity.vx = (this.controls.right - this.controls.left) * this.stats.speed;
		this.velocity.vy = (this.controls.down - this.controls.up) * this.stats.speed;
		
		/*this.velocity.vx = (this.controls.right - this.controls.left) * this.stats.speed;
		this.velocity.vy = (this.controls.up - this.controls.down) * this.stats.speed;
		
		const radian = this.Global.GetDegree(0, 0, this.velocity.vx, this.velocity.vy);
		
		this.velocity.vx = this.Global.GetDirectionY(radian, this.velocity.vx);
		this.velocity.vy = this.Global.GetDirectionX(radian, this.velocity.vy);*/
		
		this.position.x += this.velocity.vx;
		this.position.y += this.velocity.vy;
    }
	FireArrow(data){
		if(this.arrow.arrowtimeout === null || !this.arrow.arrowtimeout.isRunning()){
			//allow player to shoot an arrow every X seconds
			const radian = parseFloat(data)
		
			this.gameworld.CreateArrow(this, radian);
			this.arrow.arrowtimeout = new Timers.Timeout(() =>{
				this.arrow.arrowtimeout.Stop();
			}, 500);
		}
	}
	HandleControls(controls){
		this.controls = controls;
	}
};
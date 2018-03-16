const LifeForm = require("./LifeForm.js");
const Timers = require("./../Timers/ExportTimers.js");

module.exports = class Golem extends LifeForm{
    constructor(world, id, area) {
		super(world, id, area);
		this.player.color = "brown";
		this.groundsmash = {
			groundsmashtimer: null,
			range: 30
		}
	}
	BossAttack(){
		if(this.insight.length > 0 && 
		(this.groundsmash.groundsmashtimer === null || !this.groundsmash.groundsmashtimer.isRunning()) &&
		this.Global.GetDistance(this.position.x, this.position.y, this.target.position.x, this.target.position.y) < this.groundsmash.range){
			this.gameworld.CreateGroundSmash(this, this.target);
			this.groundsmash.groundsmashtimer = new Timers.Timeout(() =>{
				this.groundsmash.groundsmashtimer.Stop();
			}, 2000);
		}
	}
};
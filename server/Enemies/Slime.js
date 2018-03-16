const LifeForm = require("./LifeForm.js");
const Timers = require("./../Timers/ExportTimers.js");

module.exports = class Slime extends LifeForm{
    constructor(world, id, area) {
		super(world, id, area);
		this.player.color = "green";
		this.slimeball = {
			slimeballtimer: null,
			amount: 4,
			size: 1,
			range: this.player.sight*2
		}
	}
	BossAttack(){
		if(this.insight.length === 0 && this.slimeball.slimeballtimer !== null)
			this.slimeball.slimeballtimer.Stop();
		else if((this.slimeball.slimeballtimer === null || !this.slimeball.slimeballtimer.isRunning()) && this.insight.length > 0){
			//allow boss slime to shoot balls every X seconds
			this.slimeball.slimeballtimer = new Timers.Timer(() =>{
				for(let ii = 0; ii < this.slimeball.amount; ii++){
					this.gameworld.CreateBall(this.slimeball.size, this, this.target , ii);
				}
			}, 2000);
		}
	}
};
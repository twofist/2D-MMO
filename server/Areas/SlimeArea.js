const Enemy = require("./Enemy.js");

module.exports = class SlimeArea {
    constructor(aid, minlvl, maxlvl, boss) {
        this.id = aid;
		this.type = "Slime";
        this.name = this.constructor.name;
		this.monsterlevel = [minlvl, maxlvl];
		this.boss = boss;
		this.eid = 0;
        this.size = maxlvl * 5 + 20;
		this.position = {
			x: 320,
			y: 320
		};
		this.enemylist = null;
		this.CreateEnemy();
    }
	CreateEnemyList(){
		this.enemylist = [];
	}
	CreateEnemy(){
		if (this.enemylist === null)
			this.CreateEnemyList();
		
		if (!this.boss){
			for(let ii = this.enemylist.length; ii < 10; ii++){
				this.enemylist.push(new Enemy(this.eid++, this.position, this.size, this.boss, this.monsterlevel, this.type));
			}
		}else if(this.boss){
			this.enemylist.push(new Enemy(this.eid++, this.position.x, this.position.y, this.size, this.boss, this.monsterlevel, this.type))
		}
	}
};

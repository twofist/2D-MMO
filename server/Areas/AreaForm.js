module.exports = class AreaForm {
    constructor(id, minlvl, maxlvl, boss) {
        this.id = id;
		this.type = null;
        this.name = this.constructor.name;
		this.monsterlevel = [minlvl, maxlvl];
		this.boss = boss;
		this.render = false;
		this.enemylist = [];
        this.size = {
			width: maxlvl + 15 * 10,
			height: maxlvl + 15 * 10
		};
		this.position = {
			x: null,
			y: null
		};
    }
};
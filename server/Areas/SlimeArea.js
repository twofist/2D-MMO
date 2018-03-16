const AreaForm = require("./AreaForm.js");

module.exports = class SlimeArea extends AreaForm{
    constructor(id, minlvl, maxlvl, boss) {
        super(id, minlvl, maxlvl, boss);
		this.position.x = 320;
		this.position.y = 320;
		this.type = "Slime"
    }
};
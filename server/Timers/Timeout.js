module.exports = class Timeout {
    constructor(fn, time) {
        this.timer = false;
		this.fn = fn;
		this.time = time;
		this.Start();
    }
    Start(){
		if(!this.isRunning())
			this.timer = setTimeout(this.fn, this.time);
	}
	Stop(){
		clearTimeout(this.timer);
		this.timer = false;
	}
	isRunning(){
		return this.timer !== false;
	}
};

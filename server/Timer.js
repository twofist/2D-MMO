module.exports = class Timer {
    constructor(fn, time) {
        this.timer = false;
		this.fn = fn;
		this.time = time;
		this.Start();
    }
    Start(){
		if(!this.isRunning())
			this.timer = setInterval(this.fn, this.time);
	}
	Stop(){
		clearInterval(this.timer);
		this.timer = false;
	}
	isRunning(){
		return this.timer !== false;
	}
};
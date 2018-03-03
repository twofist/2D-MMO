module.exports = class Global{
	constructor(){
		
	}
	GetDistance(x, y, tx, ty){
		const xdis = tx - x;
		const ydis = ty - y;
		const distance = Math.sqrt(xdis*xdis + ydis*ydis);
		return distance;
	}
	GetRadian(x, y, tx, ty){
		const xdis = tx - x;
		const ydis = ty - y;
		const radian = Math.atan2(xdis,ydis);
		return radian;
	}
	GetDegree(x, y, tx, ty){
		const xdis = tx - x;
		const ydis = ty - y;
		const degree = Math.atan2(xdis,ydis) * 180 / Math.PI;
		return degree;
	}
	GetDirectionX(radian, speed){
		const dir = Math.sin(radian) * speed;
		return dir;
	}
	GetDirectionY(radian, speed){
		const dir = Math.cos(radian) * speed;
		return dir;
	}
	ReturnRandomNumber(min, max){
		const number = Math.floor(Math.random() * (max - min)) + min;
		return number;
	}
};
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
		const degree = Math.atan2(xdis,ydis) * (180/Math.PI);
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
	CheckCollisionRect(pos, size, pos2, size2){
		if(pos.x < pos2.x + size2.width && pos.x + size.width > pos2.x &&
		pos.y < pos2.y + size2.height && pos.y + size.height > pos2.y)
			return true;
		
		return false;
	}
	CheckCollisionCircle(pos, radius, pos2, radius2){
		const distance = this.GetDistance(pos.x, pos.y, pos2.x, pos2.y);
		if (distance < radius + radius2)
			return true;
		return false;
	}
	CheckCollisionCircleRect(cpos, radius, rpos, rsize){
		//expects rect top left, circle middle
		const distx = Math.abs(cpos.x - rpos.x-rsize.w/2);
		const disty = Math.abs(cpos.y - rpos.y-rsize.h/2);

		if (distx > (rsize.width/2 + radius))
			return false;
		if (disty > (rsize.height/2 + radius))
			return false;

		if (distx < (rsize.width/2))
			return true;
		if (disty < (rsize.height/2))
			return true;

		const dx = distx - rsize.width/2;
		const dy = disty - rsize.height/2;
		
		if(dx*dx + dy*dy < (radius*radius))
			return true;
		return false;
	}
};
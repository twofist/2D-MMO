const World = require("./World.js");
const Timers = require("./Timers/ExportTimers.js");
const Websocket = require("./Websockets.js");

CreateGame = () => {
	const gameworld = new World();
	gameworld.CreateArea();
	const websocket = new Websocket(gameworld);
	const timer = new Timers.Timer(GameStart = () =>{
		HandleArealist(gameworld);
		HandleEnemylist(gameworld.lists.enemy, gameworld.lists.user);
		HandleUserlist(gameworld.lists.user);
		HandleSlimeBalllist(gameworld.lists.slimeball);
		HandleArrowlist(gameworld.lists.arrow);
		HandleCollision(gameworld);
		HandleUpdateData(websocket);
	}, 1000/30);
}

HandleCollision = (world) =>{
	const uL = world.lists.user.length;
	for(let uii = 0; uii < uL; uii++){
		const U = world.lists.user[uii];
		const eL = world.lists.enemy.length;
		for(let eii = 0; eii < eL; eii++){
			const E = world.lists.enemy[eii];
			if(world.global.CheckCollisionRect(U.position, U.size, E.position, E.size))
				0;//do something when collision happens
		}
	}
}

HandleSlimeBalllist = (sblist) =>{
	const sbL = sblist.length;
	for(let sbii = 0; sbii < sbL; sbii++){
		const SB = sblist[sbii];
		HandleSlimeBall(SB);
	}
}

HandleSlimeBall = (SB) =>{
	if(SB)
		SB.MoveBall();
}

HandleUpdateData = (websocket) =>{
	websocket.UpdateAllUsers();
}

HandleUserlist = (ulist) =>{
	const uL = ulist.length;
	for(let uii = 0; uii < uL; uii++){
		const U = ulist[uii];
		HandleUser(U);
	}
}

HandleUser = (U) =>{
	U.ApplyMovement();
}

HandleArrowlist = (alist) =>{
	const aL = alist.length;
	for(let aii = 0; aii < aL; aii++){
		const A = alist[aii];
		HandleArrow(A);
	}
}

HandleArrow = (A) =>{
	if(A)
		A.MoveArrow();
}

HandleArealist = (gameworld) =>{
	const aL = gameworld.lists.area.length;
	for(let aii = 0; aii < aL; aii++){
		const A = gameworld.lists.area[aii];
		HandleArea(A, gameworld);
	}
}

HandleArea = (area, world) =>{
	if(world.PlayerIsCloseToArea(area))
		world.CreateEnemy(area);
	else
		RemoveEnemyFromRendering(area, world);
}

RemoveEnemyFromRendering = (area, world) => {
	const length = area.enemylist.length;
	for(let ii = 0; ii < length; ii++){
		const enemy = area.enemylist[ii];
		const index = world.lists.enemy.indexOf(enemy);
		world.lists.enemy.splice(index, 1);
	}
	area.enemylist.splice(0, length);
}

HandleEnemylist = (elist, ulist) => {
	const eL = elist.length;
	for(let eii = 0; eii < eL; eii++){
		const E = elist[eii];
		HandleEnemy(E, ulist);
	}
}

HandleEnemy = (E, userlist) =>{
	E.CheckForPlayerInsight(userlist);
	E.SetTarget();
	E.MoveToTarget();
	//if(E.target.length > 0)
		E.BossAttack();
}

CreateGame();



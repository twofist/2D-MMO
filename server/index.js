const World = require("./World.js");
const User = require("./User.js");
const Area = require("./Area.js");
const Enemy = require("./Enemy.js");
const Global = require("./Global.js");
const Arrow = require("./Arrow.js");
const Timer = require("./Timer.js");
const Websocket = require("./Websockets.js");

CreateGame = () => {
	const gameworld = new World();
	gameworld.CreateArea();
	const websocket = new Websocket(gameworld);
	const timer = new Timer(GameStart = () =>{
		HandleArealist(gameworld);
		HandleUserlist(gameworld);
		HandleUpdateData(websocket);
	}, 1000/30);
}

HandleUpdateData = (websocket) =>{
	websocket.UpdateAllUsers();
}

HandleUserlist = (gameworld) =>{
	const gL = gameworld.userlist.length;
	for(let gii = 0; gii < gL; gii++){
		const U = gameworld.userlist[gii];
		HandleUser(U);
	}
}

HandleUser = (U) =>{
	U.ApplyMovement();
	const aL = U.arrow.arrowlist.length;
	for(let aii = 0; aii < aL; aii++){
		const A = U.arrow.arrowlist[aii];
		HandleArrow(A);
	}
}

HandleArrow = (A) =>{
	A.MoveArrow();
}

HandleArealist = (gameworld) =>{
	const gL = gameworld.arealist.length;
	for(let gii = 0; gii < gL; gii++){
		const A = gameworld.arealist[gii];
		HandleEnemylist(A, gameworld.userlist);
	}
}

HandleEnemylist = (A, userlist) => {
	const aL = A.enemylist.length;
	for(let aii = 0; aii < aL; aii++){
		const E = A.enemylist[aii];
		HandleEnemy(E, userlist);
	}
}

HandleEnemy = (E, userlist) =>{
	E.CheckForPlayerInsight(userlist);
	E.SetTarget();
	E.MoveToTarget();
}

CreateGame();



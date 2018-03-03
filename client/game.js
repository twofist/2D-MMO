let Username = null;

function AddUsername() {
	//get username
    Username = document.getElementById("UserName").value;
    CreateGame();
}

function CreateGame() {
    RemoveLoginForm();
    AddCanvas();
	StartGame();
}

function RemoveLoginForm() {
	//removes the login form
    const element = document.getElementById("Login");
    element.outerHTML = "";
    delete element;
}

function AddCanvas() {
	//adds the canvas
    const canvas = document.createElement('canvas');
    canvas.id = "canvas";
    document.getElementsByTagName("body")[0].appendChild(canvas);
}

function StartGame(){
	const gameworld = new GameWorld();
}
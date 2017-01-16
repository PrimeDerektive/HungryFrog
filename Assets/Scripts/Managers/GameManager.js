#pragma strict
import UnityEngine.Events;
import UnityEngine.UI;

var gameAwakeEvent : UnityEvent;
var gameStartEvent : UnityEvent;
var gameFailedEvent : UnityEvent;
var gameResetEvent : UnityEvent;
var score : TextMesh;

var gameRunning : boolean = false;
var timeSinceGameStart : float = 0.0;

static var instance : GameManager;

function Awake(){
	instance = this;
}

function Start(){
	Invoke("GameAwake", 0.5);
}

function GameAwake(){
	gameAwakeEvent.Invoke();
}

function StartGame(){
	Cursor.lockState = CursorLockMode.Locked;
	gameRunning = true;
	timeSinceGameStart = 0;
	gameStartEvent.Invoke();
}

function QuitGame(){
	Application.Quit();
}

function FailedGame(){
	Cursor.lockState = CursorLockMode.None;
	gameRunning = false;
	gameFailedEvent.Invoke();
}

function ResetGame(){
	gameResetEvent.Invoke();
	StartGame();
}

function Update(){
	if(gameRunning){
		timeSinceGameStart += Time.deltaTime;
	}
}

function UpdateScore(enemyHit : GameObject, multiplier : int){
	score.text = (parseInt(score.text) + 100*multiplier).ToString();
	iTween.PunchScale(score.gameObject, Vector3(1.5, 1.5, 1.5), 0.5);
}
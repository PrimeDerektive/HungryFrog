#pragma strict

var moveTime : float = 3.0;

var maxMoveDistance : float = 10.0;

var gameManager : GameManager;

private var startPos : Vector3;
private var targetPos : Vector3 = Vector3.zero;

function OnEnable () {
	startPos = transform.position;
	transform.localScale = Vector3.one;
	gameManager = GameObject.Find("GameManager").GetComponent.<GameManager>();
	StartCoroutine(MoveRandomly());
}

function MoveRandomly(){
	while(true){
		//transform.LookAt(Camera.main.transform.position);
		var newPos1 = startPos + Random.insideUnitSphere * maxMoveDistance;
		while(Physics.Linecast(transform.position, newPos1)){
			newPos1 = startPos + Random.insideUnitSphere * maxMoveDistance;
			yield;
		}
		var newPos2 = startPos + Random.insideUnitSphere * maxMoveDistance;
		while(Physics.Linecast(newPos1, newPos2)){
			newPos2 = startPos + Random.insideUnitSphere * maxMoveDistance;
			yield;
		}
		var newPos3 = startPos + Random.insideUnitSphere * maxMoveDistance;
		while(Physics.Linecast(newPos2, newPos3)){
			newPos3 = startPos + Random.insideUnitSphere * maxMoveDistance;
			yield;
		}
		var path : Vector3[] = [newPos1, newPos2, newPos3];	
		iTween.MoveTo(gameObject, iTween.Hash("path", path, "orienttopath", true, "easetype", iTween.EaseType.linear, "time", moveTime));
		yield WaitForSeconds(moveTime);
	
		/*
		var timer : float = 0;
		var duration : float = 2.0;
		while(timer <= duration){
			timer += Time.deltaTime;
			var t = timer/duration;
			iTween.PutOnPath(gameObject, path, t);
			yield;
		}
		*/
	}
}

function HitByTongue(){
	StopAllCoroutines();
	iTween.Stop(gameObject);
}
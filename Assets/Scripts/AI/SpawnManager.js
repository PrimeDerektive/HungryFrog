#pragma strict
import System.Collections;

var enemyPrefab : Transform;
var spawnTime : float = 2.0;
var maxEnemies : int = 10;

private var enemies : List.<GameObject> = new List.<GameObject>();

function OnEnable () {
	InvokeRepeating("SpawnEnemy", 0, spawnTime);
}

function OnDisable(){
	CancelInvoke();
}

function SpawnEnemy(){
	if(enemies.Count < maxEnemies){
		var spawnPoint : Vector3 = Random.insideUnitSphere * 30;
		spawnPoint.y = Random.Range(1.0, 10.0);
		var newEnemy = Instantiate(enemyPrefab, spawnPoint, Quaternion.identity);
		newEnemy.LookAt(Camera.main.transform.position);
		enemies.Add(newEnemy.gameObject);
	}
}

function RemoveEnemy(enemy : GameObject, count : int){
	enemies.Remove(enemy);
	Destroy(enemy);
}

function Reset(){
	for(var enemy in enemies)
		Destroy(enemy);
	enemies.Clear();
}

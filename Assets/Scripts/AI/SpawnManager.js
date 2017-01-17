#pragma strict
import System.Collections.Generic;
import UltimatePooling;

var enemyPrefab : GameObject;
var spawnRange : float = 20.0;
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
		var spawnPoint : Vector3 = transform.position + Random.insideUnitSphere * spawnRange;
		spawnPoint.y = Random.Range(1.0, 10.0);
		var newEnemy = UltimatePool.spawn(enemyPrefab, spawnPoint, Quaternion.identity);
		newEnemy.layer = LayerMask.NameToLayer("Enemy"); //appears to be a bug in UltimatePooling? it unsets the layer
		enemies.Add(newEnemy);
	}
}

function RemoveEnemy(enemy : GameObject, count : int){
	enemies.Remove(enemy);
	enemy.transform.parent = null;
	UltimatePool.despawn(enemy);
}

function Reset(){
	for(var enemy in enemies)
		UltimatePool.despawn(enemy);
	enemies.Clear();
}

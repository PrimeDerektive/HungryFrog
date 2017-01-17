#pragma strict
import UltimatePooling;

var lifetime : float = 0.5;

function OnEnable () {
	Invoke("DisableSelf", lifetime);
}

function DisableSelf(){
	UltimatePool.despawn(gameObject);
}

function OnDespawn(){
	transform.parent = null;
}

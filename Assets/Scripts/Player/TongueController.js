#pragma strict
import UnityEngine.Events;
import System.Collections.Generic;
import UltimatePooling;

var points : Transform[];

var tongueEnd : Transform;
var tongueMiddle : Transform;
var speedModifier : float = 1.0;

var smoothPointCount : int = 10;

//aiming vars
var aimLayerMask : LayerMask;
var aimSmoothing : float = 10.0;
private var targetAimPos : Vector3;
private var smoothAimPos : Vector3;
private var lastAimDistance : float = 0.0;

//hitting vars
var tongueOut : boolean = false;
var tongueExtending : boolean = false;
var enemyLayer : LayerMask;
var tongueExtendSound: AudioClip;
var tongueRetractSound : AudioClip;
var chewSound : AudioClip;
var hitEffect : GameObject;
var comboEffect : TextMesh;
var hitEnemies = new List.<HitEnemy>();

var eatEnemyEvent : EatEnemyEvent;
//parameters of EatEnemyEvent are the enemy hit, and the enemy count
public class EatEnemyEvent extends UnityEvent.<GameObject, int> {}

private class HitEnemy{
	var tr : Transform;
	var posOnTongue : float;
	var tongueParent : Transform;
}

//Component references
var lr : LineRenderer;
var mainCam : Transform;
var audioSource : AudioSource;

function Awake () {
	if(!lr) lr = GetComponent.<LineRenderer>();
	if(!audioSource) audioSource = GetComponent.<AudioSource>();
	if(!mainCam) mainCam = Camera.main.transform;
	lr.SetVertexCount(smoothPointCount);
	tongueEnd.localPosition = Vector3.zero;
	tongueMiddle.localPosition = Vector3.zero;
}

function Update(){

	tongueMiddle.position = transform.position + transform.forward * (Vector3.Distance(transform.position, tongueEnd.position) * 0.25);

	var aimHit : RaycastHit;
	var aimDistance : float = 50.0;

	if(Physics.Raycast(mainCam.position, mainCam.forward, aimHit, 50.0, aimLayerMask)){
		targetAimPos = aimHit.point + aimHit.normal * 0.25;
		aimDistance = aimHit.distance;
	}
	else{
		targetAimPos = mainCam.position + mainCam.forward * 50.0;
	}

	smoothAimPos = Vector3.Lerp(smoothAimPos, targetAimPos, Time.deltaTime * aimSmoothing);

	if(Input.GetButtonDown("Fire1") && !tongueOut){
		StartCoroutine(FireTongue());
	}

	if(tongueOut){
		
		if(tongueExtending){

			var tongueMoveSpeed : float = (lastAimDistance > aimDistance) ? 0.75 : 1.5*speedModifier;

			if(aimDistance < (tongueEnd.position - transform.position).magnitude * 0.9){
				tongueEnd.position = smoothAimPos;
			} 
			else{
				iTween.MoveUpdate(tongueEnd.gameObject, smoothAimPos, tongueMoveSpeed);
			}

			lastAimDistance = aimDistance;

		}
		else{
			iTween.MoveUpdate(tongueEnd.gameObject, transform.position, 0.75 * speedModifier);
		}

		var tongueMiddleDir : Vector3 = tongueMiddle.position - transform.position;
		var tongueMiddleHit : RaycastHit;
		if(Physics.Raycast(transform.position, tongueMiddleDir, tongueMiddleHit, tongueMiddleDir.magnitude, enemyLayer)){ 
			Debug.Log("Hit a fly with tongueMiddle!");
			var newHitEffect : GameObject = UltimatePool.spawn(hitEffect, tongueMiddleHit.point, Quaternion.FromToRotation(Vector3.up, tongueMiddleHit.normal));
			newHitEffect.GetComponent.<AudioSource>().pitch = 1.0 + (0.1 * hitEnemies.Count);
			newHitEffect.transform.parent = tongueMiddleHit.transform;
			if(hitEnemies.Count){
				var newComboEffect = Instantiate(comboEffect, tongueMiddleHit.point, Quaternion.FromToRotation(Vector3.up, tongueMiddleHit.normal));
				newComboEffect.text = "x" + (hitEnemies.Count + 1).ToString();
				newComboEffect.GetComponent.<AudioSource>().pitch = 1.0 + (0.1 * (hitEnemies.Count - 1));
			}
			var rootTransform = tongueMiddleHit.transform.root;
			rootTransform.gameObject.layer = 0;
			rootTransform.gameObject.SendMessage("HitByTongue", SendMessageOptions.DontRequireReceiver);
			var newHitEnemy = new HitEnemy();
			newHitEnemy.tr = rootTransform;
			newHitEnemy.posOnTongue = tongueMiddleHit.distance/tongueMiddleDir.magnitude;
			newHitEnemy.tongueParent = tongueMiddle;
			hitEnemies.Add(newHitEnemy);
			rootTransform.parent = tongueMiddle;
		}

		var tongueEndDir : Vector3 = tongueEnd.position - tongueMiddle.position;
		var tongueEndHit : RaycastHit;
		if(Physics.Raycast(tongueMiddle.position, tongueEndDir, tongueEndHit, tongueEndDir.magnitude, enemyLayer)){ 
			Debug.Log("Hit a fly with tongueEnd!");
			newHitEffect = UltimatePool.spawn(hitEffect, tongueEndHit.point, Quaternion.FromToRotation(Vector3.up, tongueEndHit.normal));
			newHitEffect.GetComponent.<AudioSource>().pitch = 1.0 + (0.1 * hitEnemies.Count);
			newHitEffect.transform.parent = tongueEndHit.transform;
			if(hitEnemies.Count){
				newComboEffect = Instantiate(comboEffect, tongueEndHit.point, Quaternion.FromToRotation(Vector3.up, tongueEndHit.normal));
				newComboEffect.text = "x" + (hitEnemies.Count + 1).ToString();
				newComboEffect.GetComponent.<AudioSource>().pitch = 1.0 + (0.1 * (hitEnemies.Count - 1));
			}
			rootTransform = tongueEndHit.transform.root;
			rootTransform.gameObject.layer = 0;
			rootTransform.gameObject.SendMessage("HitByTongue", SendMessageOptions.DontRequireReceiver);
		 	newHitEnemy = new HitEnemy();
			newHitEnemy.tr = rootTransform;
			newHitEnemy.posOnTongue = tongueEndHit.distance/tongueEndDir.magnitude;
			newHitEnemy.tongueParent = tongueEnd;
			hitEnemies.Add(newHitEnemy);
			rootTransform.parent = tongueEnd;
		}

		if(hitEnemies.Count){
			for(var hitEnemy in hitEnemies){
				if(hitEnemy.tr){
					if(hitEnemy.tongueParent == tongueMiddle){
						hitEnemy.tr.position = Vector3.Lerp(
							hitEnemy.tr.position,
							transform.position + tongueMiddleDir * hitEnemy.posOnTongue,
							Time.deltaTime * 10.0
						);
					}
					else{
						hitEnemy.tr.position = Vector3.Lerp(
							hitEnemy.tr.position,
							tongueMiddle.position + tongueEndDir * hitEnemy.posOnTongue,
							Time.deltaTime * 10.0
						);
					}
				}
			}
		}

	}

	Debug.DrawLine(transform.position, tongueMiddle.position, Color.green);
	Debug.DrawLine(tongueMiddle.position, tongueEnd.position, Color.green);
}

function OnDisable(){
	tongueOut = false;
	tongueExtending = false;
	tongueEnd.localPosition = Vector3.zero;
	tongueMiddle.localPosition = Vector3.zero;
	StopAllCoroutines();
}

function FireTongue(){
	tongueOut = true;
	tongueExtending = true;
	audioSource.PlayOneShot(tongueExtendSound, 0.75);
	yield WaitForSeconds(0.75 * speedModifier);
	tongueExtending = false;
	audioSource.PlayOneShot(tongueRetractSound, 0.75);
	yield WaitForSeconds(0.35 * speedModifier);
	for(var hitEnemy in hitEnemies){
		hitEnemy.tr.parent = null;
		eatEnemyEvent.Invoke(hitEnemy.tr.gameObject, hitEnemies.Count);
	}
	if(hitEnemies.Count){
		audioSource.PlayOneShot(chewSound, 0.75);
	}
	hitEnemies.Clear();
	tongueOut = false;
}

function LateUpdate () {
	
	for(var i = 0; i < smoothPointCount; i++){
		lr.SetPosition(i, iTween.PointOnPath(points, parseFloat(i)/smoothPointCount));
	}

}
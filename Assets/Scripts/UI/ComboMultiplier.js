#pragma strict

var floatSpeedH = 1.0;
var floatSpeedV = 0.75;

private var randomDir : float;

//Component references
var audioSource : AudioSource;

function Awake(){
	if(!audioSource) audioSource = GetComponent.<AudioSource>();
}

function OnEnable(){
	GetComponent.<Renderer>().material.color.a = 1.0;
	transform.localScale = Vector3.zero;
	transform.LookAt(Camera.main.transform);
	transform.Rotate(Vector3.up * 180.0);
	iTween.ScaleTo(gameObject, iTween.Hash("scale", Vector3.one, "easetype", iTween.EaseType.easeOutBounce, "time", 1.0));
	randomDir = Random.Range(-1.0, 1.0);
	Invoke("PlaySound", 0.1);
	StartCoroutine(Disable());
}

function Update () {
	transform.position += (transform.right * randomDir) * Time.deltaTime;
	transform.position += Vector3.up * floatSpeedV * Time.deltaTime;
}

function PlaySound(){
	audioSource.Play();
}

function Disable(){
	yield WaitForSeconds(1.0);
	iTween.FadeTo(gameObject, 0, 1.0);
	yield WaitForSeconds(1.0);
	Destroy(gameObject);
}

function OnDisable(){
	audioSource.pitch = 1;
}

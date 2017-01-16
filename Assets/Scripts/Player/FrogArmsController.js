#pragma strict

var mainCam : Transform;

var yRotSpeed : float;
private var lastEulerY : float;

var anim : Animator;

function Start () {
	if(!mainCam) mainCam = Camera.main.transform;
	if(!anim) anim = GetComponent.<Animator>();
}

function LateUpdate () {
	transform.eulerAngles.y = mainCam.eulerAngles.y;

	yRotSpeed = Mathf.Abs((transform.eulerAngles.y - lastEulerY)/Time.deltaTime);

	anim.SetFloat("rotSpeed", yRotSpeed, 0.15, Time.deltaTime);

	lastEulerY = transform.eulerAngles.y;
}
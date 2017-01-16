#pragma strict

var vignetteDelay : float = 15.0;
var eyelidDelay : float = 28.0;
var timeToStarve : float = 30.0;

var tintProperty : String = "_Color";

var eyeLidTop : Transform;
//don't need to set start offset, we'll just cache it in Start()
@HideInInspector
var eyeLidTopStartYOffset : float;
var eyeLidTopEndYOffset : float;

var eyeLidBottom : Transform;
//don't need to set start offset, we'll just cache it in Start()
@HideInInspector
var eyeLidBottomStartYOffset : float;
var eyeLidBottomEndYOffset : float;

//need to be set in editor
var hungerOverlayRenderers : MeshRenderer[];

//Component references
var audioSource : AudioSource;

private var starvationTimeElapsed : float = 0.0;

private var tintColor : Color;


var croakedEvent : UnityEvent;
var croaked : boolean = false;
 
function Start () {
	audioSource = GetComponent.<AudioSource>();
    //cache eyelid start y offsets
    eyeLidTopStartYOffset = eyeLidTop.localPosition.y;
    eyeLidBottomStartYOffset = eyeLidBottom.localPosition.y;
    //get the starting color
    tintColor = hungerOverlayRenderers[0].material.GetColor(tintProperty);
    //set alpha to 0
    tintColor.a = 0;
    SetHungerColor(tintColor);
    StartCoroutine(HungerVignette());
}

function HungerVignette(){
	while(true){
		 if(GameManager.instance.gameRunning && starvationTimeElapsed > vignetteDelay){
		 	StartCoroutine(BlinkHungerVignette());
		 	audioSource.Play();
		 	var starvationProgress = Mathf.Min(1.0, (starvationTimeElapsed - vignetteDelay)/(timeToStarve - vignetteDelay));
		 	var blinkDelay = Mathf.Lerp(4.0, 0.25, starvationProgress);
		 	Debug.Log(blinkDelay);
			yield WaitForSeconds(blinkDelay);
		 }
		 else
		 	yield;
	}
}

function BlinkHungerVignette(){
	//a vignette blink takes a full second
	var timer = 0.0;
	var duration : float = 0.375;
	while(timer <= duration){
		timer += Time.deltaTime;
		var t = timer/duration;
		tintColor.a = Mathf.Lerp(0.0, 1.0, t);
		SetHungerColor(tintColor);
		yield;
	}
	timer = 0.0;
	while(timer <= duration){
		timer += Time.deltaTime;
		t = timer/duration;
		tintColor.a = Mathf.Lerp(1.0, 0.0, t);
		SetHungerColor(tintColor);
		yield;
	}
}


function Update(){
    if(GameManager.instance.gameRunning){
        if(starvationTimeElapsed < timeToStarve){
            starvationTimeElapsed += Time.deltaTime;
            if(starvationTimeElapsed >= eyelidDelay){
                var starvationProgress = Mathf.Min(Mathf.Max(0, (starvationTimeElapsed - eyelidDelay))/(timeToStarve - eyelidDelay), 1.0);
                eyeLidTop.localPosition.y = Mathf.Lerp(eyeLidTopStartYOffset, eyeLidTopEndYOffset, starvationProgress);
                eyeLidBottom.localPosition.y = Mathf.Lerp(eyeLidBottomStartYOffset, eyeLidBottomEndYOffset, starvationProgress);
                //tintColor.a = Mathf.Min(starvationProgress*1.1, 1.0); //make alpha reach 1 10% faster than the eyelid positioning
                //SetHungerColor(tintColor);
            }
        }
        else if(!croaked){
            croakedEvent.Invoke();
            croaked = true;
        }
    }
}

function SetHungerColor(newColor : Color){
    for(var r : MeshRenderer in hungerOverlayRenderers){
        r.material.SetColor(tintProperty, newColor);
    }
}

function ReduceHunger(enemyHit : GameObject, multiplier : int){
    starvationTimeElapsed -= 1.0 * multiplier;
    if(starvationTimeElapsed < 0) starvationTimeElapsed = 0;
}

function Reset(){
    starvationTimeElapsed = 0;
    StartCoroutine(ResetHungerEffect());
    croaked = false;
}

function ResetHungerEffect(){
    var timer : float = 0.0;
    var duration : float = 1.0;
    while(timer <= duration){
        timer += Time.deltaTime;
        var t = timer/duration;
        eyeLidTop.localPosition.y = Mathf.Lerp(eyeLidTopEndYOffset, eyeLidTopStartYOffset, t);
        eyeLidBottom.localPosition.y = Mathf.Lerp(eyeLidBottomEndYOffset, eyeLidBottomStartYOffset, t);
        tintColor.a = Mathf.Lerp(1.0, 0.0, t);
        SetHungerColor(tintColor);
        yield;
    }
}
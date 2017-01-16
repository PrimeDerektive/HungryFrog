#pragma strict
import UnityEngine.UI;

var fadeDuration : float = 1.0;

var group : CanvasGroup;

function FadeCanvas(targetAlpha : float) {
	iTween.Stop(gameObject);
	//cancel potential DisableCanvas invocations
	CancelInvoke();
	//this object is getting enabled
	if(targetAlpha == 1){
		group.gameObject.SetActive(true);
	}
	if(targetAlpha == 0){
		//this canvas is getting disabled, schedule it to be disabled
		Invoke("DisableCanvas", fadeDuration);
	}
	iTween.ValueTo(gameObject, iTween.Hash("from", group.alpha, "to", targetAlpha,"time", fadeDuration, "onupdate", "ChangeCanvasAlpha"));
}

//since our ValueTo() iscalculating floats the "onupdate" callback will expect a float as well:
private function ChangeCanvasAlpha(newValue : float){
	group.alpha = newValue;
}

private function DisableCanvas(){
	group.gameObject.SetActive(false);
}
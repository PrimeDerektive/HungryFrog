#pragma strict

private var textMesh : TextMesh;

function Awake(){
	textMesh = GetComponent.<TextMesh>();
}

function Fade3DText(targetAlpha : float) {
	iTween.Stop(gameObject);
	iTween.ValueTo(gameObject, iTween.Hash("from", textMesh.color.a, "to", targetAlpha, "time", 0.5, "onupdate", "Change3DTextAlpha"));
}

//since our ValueTo() iscalculating floats the "onupdate" callback will expect a float as well:
function Change3DTextAlpha(newValue : float){
	textMesh.color.a = newValue;
}
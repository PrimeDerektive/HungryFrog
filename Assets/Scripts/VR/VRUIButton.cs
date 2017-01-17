using UnityEngine;
using UnityEngine.Events;
using VRStandardAssets.Utils;

namespace VRStandardAssets.Examples
{
	// This script is a simple example of how an interactive item can
	// be used to change things on gameobjects by handling events.
	public class VRUIButton : MonoBehaviour
	{

		[SerializeField] private UnityEvent m_overEvent;
		[SerializeField] private UnityEvent m_outEvent;
		[SerializeField] private UnityEvent m_clickEvent;
		[SerializeField] private VRInteractiveItem m_InteractiveItem;

		private Animator anim;

		private void Awake()
		{
			anim = GetComponent<Animator>();
		}

		private void OnEnable()
		{
			m_InteractiveItem.OnOver += HandleOver;
			m_InteractiveItem.OnOut += HandleOut;
			m_InteractiveItem.OnClick += HandleClick;
		}


		private void OnDisable()
		{
			m_InteractiveItem.OnOver -= HandleOver;
			m_InteractiveItem.OnOut -= HandleOut;
			m_InteractiveItem.OnClick -= HandleClick;
		}


		//Handle the Over event
		private void HandleOver()
		{
			Debug.Log("Show over state");
			anim.SetBool("hovered", true);
			m_overEvent.Invoke();
		}


		//Handle the Out event
		private void HandleOut()
		{
			Debug.Log("Show out state");
			anim.SetBool("hovered", false);
			m_outEvent.Invoke();

		}


		//Handle the Click event
		private void HandleClick()
		{
			Debug.Log("Show click state");
			anim.SetBool("hovered", false);
			m_clickEvent.Invoke();
		}

	}
}
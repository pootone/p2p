using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class SantaClick : MonoBehaviour
{
    public GameObject gameObject;
    public GameObject CloseBtn;
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }


    void OnMouseDown()
    {
        gameObject.SetActive(true);
        CloseBtn.SetActive(true);
    }
}

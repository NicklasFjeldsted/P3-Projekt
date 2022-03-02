using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;
using UnityEditor;

public class GameManager : MonoBehaviour
{
    private static GameManager _instance;
    public static GameManager Instance
    {
        get { return _instance; }
    }

    private NetworkManager networkManager;

    private void Awake()
    {
        if(_instance != null && _instance != this)
        {
            Destroy(this);
        }
        else
        {
            _instance = this;
        }
    }

    public async Task StartAsync()
    {
        Debug.Log("Started Async");
        networkManager = new NetworkManager();
        networkManager.OnConnected += OnConnected;

        await networkManager.InitAsync();
    }

    public void OnConnected (User user)
    {
        Debug.Log($"{user.Email} just joined.");
    }
}
#if UNITY_EDITOR
[CustomEditor(typeof(GameManager))]
public class ObjectBuilderEditor : Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();

        GameManager myScript = (GameManager)target;
        if (GUILayout.Button("Start"))
        {
            myScript.StartCoroutine("StartAsync");
        }

        if (GUILayout.Button("Join"))
        {
            myScript.StartCoroutine("Join");
        }
    }
}
#endif
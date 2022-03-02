using System.Collections;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using UnityEngine;
using UnityEditor;

public class NetworkManager : MonoBehaviour
{
    private static NetworkManager _instance;
    public static NetworkManager Instance
    {
        get { return _instance; }
    }

    private Connector _connector;

    public List<User> users = new List<User>();

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

    private void Start()
    {
        StartCoroutine("StartAsync");
    }

    public async Task StartAsync()
    {
        _connector = new Connector();
        _connector.OnConnected += OnConnected;

        await _connector.InitAsync();
    }

    public void OnConnected (User user)
    {
        Debug.Log($"{user.Email} just joined.");
        users.Add(user);
    }
}
#if UNITY_EDITOR
[CustomEditor(typeof(NetworkManager))]
public class ObjectBuilderEditor : Editor
{
    public override void OnInspectorGUI()
    {
        DrawDefaultInspector();

        NetworkManager myScript = (NetworkManager)target;
        //if (GUILayout.Button("Start"))
        //{
        //    myScript.StartCoroutine("StartAsync");
        //}
    }
}
#endif
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

public class ChatSystem : MonoBehaviour
{
    #region Singleton Pattern
    private static ChatSystem _instance;
    public static ChatSystem Instance { get { return _instance; } }
    #endregion

    private ChatConnection _chatConnection;
    private ChatManager _chatManager;

    private void Awake()
    {
        #region Singleton Pattern
        if (_instance != null && _instance != this)
        {
            Destroy(this);
        }
        else
        {
            _instance = this;
        }
        #endregion
    }

    private void Start()
    {
        _chatManager = ChatManager.Instance;
    }

    private async Task StartAsync()
    {
        _chatConnection = new ChatConnection();

        _chatConnection.OnMessageReceived += OnMessageReceived;
        _chatConnection.OnPingReceived += OnPingReceived;

        await _chatConnection?.InitAsync();
    }

    private void OnEnable()
    {
        StartCoroutine(nameof(StartAsync));
    }

    private void OnDisable()
    {
        _chatConnection.OnMessageReceived -= OnMessageReceived;
        _chatConnection.OnPingReceived -= OnPingReceived;
        Destroy(_chatConnection);
    }

    private void OnPingReceived(string data)
    {
        Debug.Log(data);
    }

    private void OnMessageReceived(string author, string message)
    {
        _chatManager.ReceiveNewMessage(new Message(author, message));
    }

    public void SendMessage(string author, string message)
    {
        _chatConnection?.SendMessage(author, message);
    }

    public void PingServer() => _chatConnection?.PingServer();
}

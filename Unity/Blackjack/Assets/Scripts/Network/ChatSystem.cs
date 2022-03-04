using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

public class ChatSystem : MonoBehaviour
{
    private ChatConnection _chatConnection;

    private void Start()
    {
        StartCoroutine(nameof(StartAsync));
    }

    private async Task StartAsync()
    {
        _chatConnection = new ChatConnection();

        _chatConnection.OnMessageReceived += OnMessageReceived;

        await _chatConnection?.InitAsync();
    }

    private void OnMessageReceived(string author, string message)
    {

    }

    private void SendMessage(string author, string message)
    {
        _chatConnection?.SendMessage(author, message);
    }
}

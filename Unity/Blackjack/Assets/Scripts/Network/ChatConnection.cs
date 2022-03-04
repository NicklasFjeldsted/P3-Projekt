using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

public class ChatConnection
{
    public Action<string, string> OnMessageReceived;
    private HubConnection _connection;

    public async Task InitAsync()
    {
        _connection = new HubConnectionBuilder()
            .WithUrl("https://localhost:5001/Blackjack")
            .Build();

        _connection.On<string, string>("ReceiveMessage", (author, message) =>
        {
            OnMessageReceived?.Invoke(author, message);
        });

        await StartConnectionAsync();
    }

    public void SendMessage(string author, string message)
    {
        _connection.SendAsync("SendMessage", author, message);
    }

    private async Task StartConnectionAsync()
    {
        try
        {
            await _connection.StartAsync();
        }
        catch (Exception ex)
        {
            Debug.LogError(ex);
        }
    }
}

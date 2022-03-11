using Microsoft.AspNetCore.SignalR.Client;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;

public class ChatConnection
{
    public Action<string, string> OnMessageReceived;
    public Action<string> OnPingReceived;
    private HubConnection _connection;

    public async Task InitAsync()
    {
        _connection = new HubConnectionBuilder()
            .WithUrl("http://localhost:5001/Blackjack")
            .Build();

        _connection.On<string, string>("ReceiveMessage", (author, message) =>
        {
            OnMessageReceived?.Invoke(author, message);
        });

        _connection.On<string>("PingClient", (data) =>
        {
            OnPingReceived?.Invoke(data);
        });

        await StartConnectionAsync();
    }

    public void SendMessage(string author, string message)
    {
        _connection.SendAsync("SendMessage", author, message);
    }

    public void PingServer()
    {
        _connection.SendAsync("PingServer", _connection.ConnectionId, _connection.ConnectionId);
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

using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using Microsoft.AspNetCore.SignalR.Client;

public class NetworkManager
{
    public Action<User> OnConnected;
    private HubConnection _connection;

    public async Task InitAsync()
    {
        _connection = new HubConnectionBuilder()
            .WithUrl("https://localhost:5001/Blackjack")
            .Build();

        _connection.On<string>("JoinRoomResponse", (email) =>
        {
            OnConnected?.Invoke(new User(email));
        });

        await StartConnectionAsync();
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

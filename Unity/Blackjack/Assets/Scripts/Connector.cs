using System;
using System.Collections;
using System.Collections.Generic;
using System.Threading.Tasks;
using UnityEngine;
using Microsoft.AspNetCore.SignalR.Client;

public class Connector
{
    public Action<User> OnConnected;
    public Action OnDeal;
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

        _connection.On("DealCards", () => OnDeal?.Invoke());

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

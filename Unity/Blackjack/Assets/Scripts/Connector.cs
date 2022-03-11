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
#if UNITY_EDITOR
        _connection = new HubConnectionBuilder()
            .WithUrl("http://localhost:5001/Blackjack")
            .Build();
#else
        _connection = new HubConnectionBuilder()
            .WithUrl("http://10.0.6.2:5001/Blackjack")
            .Build();
#endif

        _connection.On<string>("JoinRoomResponse", (userJSON) =>
        {
            OnConnected?.Invoke(JsonUtility.FromJson<User>(userJSON));
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

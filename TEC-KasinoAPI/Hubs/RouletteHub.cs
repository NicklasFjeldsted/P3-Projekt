using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System.Diagnostics;
using TEC_KasinoAPI.Games;
using TEC_KasinoAPI.Helpers;
using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Services;

namespace TEC_KasinoAPI.Hubs
{
    public class RouletteHub : Hub
    {
        private readonly IGameManager _gameManager;
        private readonly IRoulette _game;
        private readonly JsonSerializerSettings _serializerSettings = new() { NullValueHandling = NullValueHandling.Ignore };

        public RouletteHub(IGameManager gameManager, IRoulette game)
        {
            _game = game;
            _gameManager = gameManager;
        }

        /// <summary>
        /// Called when a HubConnection on the client side disconnects.
        /// </summary>
        public override Task OnDisconnectedAsync(Exception exception)
        {
            string id = Context.ConnectionId;

            Clients.Others.SendAsync("Player_Disconnected", JsonConvert.SerializeObject(_gameManager.ConnectedPlayers[ id ]));

            string playerDisconnectingName = _gameManager.ConnectedPlayers[ id ].FullName;

            Debug.WriteLine($"\nDisconnecting - {playerDisconnectingName}\n");

            _gameManager.Bets.TryRemove(new KeyValuePair<string, int>(id, _gameManager.Bets[ id ]));
            _gameManager.ConnectedPlayers.TryRemove(new KeyValuePair<string, UserData>(id, _gameManager.ConnectedPlayers[ id ]));
            _game.Players.TryRemove(new KeyValuePair<string, UserData>(id, _game.Players[ id ]));
            _game.PlayerTileData.Remove(id, out var value);

            Debug.WriteLine($"\nDisconnected - {playerDisconnectingName}\n");

            return base.OnDisconnectedAsync(exception);
        }

        /// <summary>
        /// Called when a HubConnection on the client side connects.
        /// </summary>
        public override Task OnConnectedAsync()
        {
            string id = Context.ConnectionId;

            _gameManager.ConnectedPlayers.TryAdd(id, new UserData());
            _game.Players.TryAdd(id, new UserData());
            _gameManager.Bets.TryAdd(id, 0);

            return base.OnConnectedAsync();
        }

        /// <summary>
        /// Identifies the hub connection and connects the player to everyone else.
        /// </summary>
        public async Task Identify(string playerData)
        {
            string id = Context.ConnectionId;

            UserData parsedData = JsonConvert.DeserializeObject<UserData>(playerData, _serializerSettings);
            parsedData.GameType = GameType.Roulette;

            await _gameManager.ConnectedPlayers[ id ].Update(parsedData);
            await _game.Players[ id ].Update(parsedData);
            await Clients.Caller.SendAsync("Sync_BetLocked", JsonConvert.SerializeObject(_game.BetLocked));
            await Clients.Caller.SendAsync("Update_Server_DueTime", JsonConvert.SerializeObject(new TimerPlus.TimerPackage(GameType.Roulette)));
            await Clients.Others.SendAsync("Player_Connected", JsonConvert.SerializeObject(_gameManager.ConnectedPlayers[ id ]));
        }

        public void Update_Bet_Data(string betData)
        {
            if (_game.BetLocked)
            {
                return;
            }

            string id = Context.ConnectionId;

            var newTile = JsonConvert.DeserializeObject<BetData>(betData);
            if (_game.PlayerTileData.ContainsKey(id))
            {
                foreach (var data in _game.PlayerTileData[ id ])
                {
                    if(data.betType != BetType.Straight)
                    {
                        continue;
                    }

                    if(data.number != newTile.number)
                    {
                        continue;
                    }

                    data.betAmount = newTile.betAmount;
                    return;
                }
                _game.PlayerTileData[ id ].Add(newTile);
            }
            else
            {
                var l = new List<BetData>();
                l.Add(newTile);
               _game.PlayerTileData.TryAdd(id, l);
            }
        }

        public void Remove_Bet_Data(string tileData)
        {
            if(_game.BetLocked)
            {
                return;
            }

            string id = Context.ConnectionId;

            var newTile = JsonConvert.DeserializeObject<BetData>(tileData);
            _game.PlayerTileData[ id ].Remove(newTile);
            if (_game.PlayerTileData[ id ].Count <= 0)
            {
                _game.PlayerTileData.TryRemove(new KeyValuePair<string, List<BetData>>(id, _game.PlayerTileData[id]));
            }
        }

        public void Clear_Bet_Data()
        {
            if (_game.BetLocked)
            {
                return;
            }

            string id = Context.ConnectionId;

            if (_game.PlayerTileData.ContainsKey(id))
            {
                _game.PlayerTileData[ id ].Clear();
            }
        }
    }
}

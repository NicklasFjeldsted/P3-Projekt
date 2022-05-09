using Microsoft.AspNetCore.SignalR;
using TEC_KasinoAPI.Models;
using Newtonsoft.Json;
using TEC_KasinoAPI.Models.Data_Models;
using TEC_KasinoAPI.Services;
using System.Diagnostics;

namespace TEC_KasinoAPI.Hubs
{
    public class BlackjackHub : Hub
	{
		private readonly IGameManager _gameManager;

		public BlackjackHub(IGameManager gameManager)
		{
			_gameManager = gameManager;
		}

		/// <summary>
		/// Called when a HubConnection on the client side disconnects.
		/// </summary>
		public override Task OnDisconnectedAsync(Exception exception)
		{
			string id = Context.ConnectionId;

			if (_gameManager.SeatTurnIndex == _gameManager.ConnectedPlayers[id].SeatIndex)
			{
				_gameManager.SwitchTurn();
				Clients.Others.SendAsync("Sync_CurrentTurn", JsonConvert.SerializeObject(_gameManager.SeatTurnIndex));
			}

			_gameManager.Bets.TryRemove(new KeyValuePair<string, int>(id, _gameManager.Bets[id]));
			_gameManager.ConnectedPlayers.TryRemove(new KeyValuePair<string, PlayerData>(id, _gameManager.ConnectedPlayers[id]));

			if (_gameManager.ConnectedPlayers.IsEmpty || !_gameManager.CheckPlayers())
			{
				Task.Run(async () => await _gameManager.EndGame());
			}

			Clients.Others.SendAsync("Player_Disconnected", id);

			return base.OnDisconnectedAsync(exception);
		}

		/// <summary>
		/// Called when a HubConnection on the client side connects.
		/// </summary>
		public override Task OnConnectedAsync()
		{
			string id = Context.ConnectionId;
			_gameManager.ConnectedPlayers.TryAdd(id, new PlayerData());
			_gameManager.Bets.TryAdd(id, 0);

			Clients.Others.SendAsync("Player_Connected", id);

			return base.OnConnectedAsync();
		}

		public async Task Update_PlayerData(string playerData)
        {
			string id = Context.ConnectionId;
			await _gameManager.ConnectedPlayers[id].Update(JsonConvert.DeserializeObject<PlayerData>(playerData, new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore}));
			await Clients.All.SendAsync("Update_PlayerData_Callback", playerData);
        }

		public async Task Get_PlayerData()
        {
			await Clients.Caller.SendAsync("Get_PlayerData_Callback", GameManager.DictionaryToJson(_gameManager.ConnectedPlayers));
        }

        /// <summary>
        /// A player calls "Hit" from the client side and "Hit" either informs the connected players
        /// that the caller busted or gained a new card.
        /// </summary>
        public async Task Hit()
        {
			string id = Context.ConnectionId;
            if (_gameManager.IsPlaying)
			{
				_gameManager.ConnectedPlayers[id].Cards.Add(_gameManager.GenerateCard());
				if(GameManager.CalculateValue(_gameManager.ConnectedPlayers[id].Cards.ToList()) > 21)
                {
					Bust();
                }
            }

			await Clients.All.SendAsync("Update_PlayerData_Callback", JsonConvert.SerializeObject(_gameManager.ConnectedPlayers[id]));
		}

		/// <summary>
		/// A player calls "Stand" from the client side and "Stand" informs the connectedPlayers that
		/// the caller stands.
		/// </summary>
		public async Task Stand()
        {
			string id = Context.ConnectionId;
			if (_gameManager.IsPlaying && !_gameManager.ConnectedPlayers[id].Busted)
			{
				_gameManager.ConnectedPlayers[id].Stand = true;
				_gameManager.SwitchTurn();
			}

			await Clients.All.SendAsync("Update_PlayerData_Callback", JsonConvert.SerializeObject(_gameManager.ConnectedPlayers[id]));
			await Clients.All.SendAsync("Sync_CurrentTurn", JsonConvert.SerializeObject(_gameManager.SeatTurnIndex));
		}

		/// <summary>
		/// This is called by the server if the "Hit" method calculates a value over 21, "Bust" informs
		/// the connectedPlayers that the client that called "Hit" is busted.
		/// </summary>
		public async Task Bust()
        {
			string id = Context.ConnectionId;
            if (_gameManager.IsPlaying)
            {
				_gameManager.ConnectedPlayers[id].Busted = true;
				_gameManager.SwitchTurn();
			}

			await Clients.All.SendAsync("Update_PlayerData_Callback", JsonConvert.SerializeObject(_gameManager.ConnectedPlayers[id]));
			await Clients.All.SendAsync("Sync_CurrentTurn", JsonConvert.SerializeObject(_gameManager.SeatTurnIndex));
		}

		/// <summary>
		/// Updates the players bet.
		/// </summary>
		public async Task UpdateBet(int betAmount)
        {
			if (_gameManager.IsPlaying) return;
			string id = Context.ConnectionId;
			BetResponse response = new BetResponse(betAmount, _gameManager.ConnectedPlayers[id].SeatIndex);
			await Task.Run(() => _gameManager.Bets.AddOrUpdate(id, key => _gameManager.Bets[key] = betAmount, (key, value) => _gameManager.Bets[key] = betAmount));
			await Clients.Others.SendAsync("Sync_PlayerBet", JsonConvert.SerializeObject(response));
        }
    }
}

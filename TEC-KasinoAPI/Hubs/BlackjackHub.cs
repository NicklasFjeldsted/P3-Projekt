using Microsoft.AspNetCore.SignalR;
using TEC_KasinoAPI.Models;
using Newtonsoft.Json;
using TEC_KasinoAPI.Models.Data_Models;
using TEC_KasinoAPI.Services;
using TEC_KasinoAPI.Helpers;
using TEC_KasinoAPI.Games;

namespace TEC_KasinoAPI.Hubs
{
    public class BlackjackHub : Hub
	{
		private readonly IGameManager _gameManager;
		private readonly IBlackjack _game;
		private readonly JsonSerializerSettings _serializerSettings = new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore };

		public BlackjackHub(IGameManager gameManager, IBlackjack game)
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

			if (_game.SeatTurnIndex == _game.Players[id].SeatIndex)
			{
				_game.SwitchTurn();
				Clients.Others.SendAsync("Sync_CurrentTurn", JsonConvert.SerializeObject(_game.SeatTurnIndex));
			}

			Clients.Others.SendAsync("Player_Disconnected", JsonConvert.SerializeObject(_game.Players[id]));

			_gameManager.Bets.TryRemove(new KeyValuePair<string, int>(id, _gameManager.Bets[id]));
			_game.Players.TryRemove(new KeyValuePair<string, BlackjackPlayerData>(id, _game.Players[id]));
			_gameManager.ConnectedPlayers.TryRemove(new KeyValuePair<string, UserData>(id, _gameManager.ConnectedPlayers[id]));

			if (_game.Players.IsEmpty || !_game.CheckPlayers())
			{
				Task.Run(async () => await _game.EndGame());
			}

			return base.OnDisconnectedAsync(exception);
		}

		/// <summary>
		/// Called when a HubConnection on the client side connects.
		/// </summary>
		public override Task OnConnectedAsync()
		{
			string id = Context.ConnectionId;

			_game.Players.TryAdd(id, new BlackjackPlayerData());
			_gameManager.ConnectedPlayers.TryAdd(id, new UserData());
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
			parsedData.GameType = GameType.Blackjack;

			await _gameManager.ConnectedPlayers[id].Update(parsedData);
			await _game.Players[id].Update(JsonConvert.DeserializeObject<BlackjackPlayerData>(playerData, _serializerSettings));
			await Clients.Caller.SendAsync("Update_Server_DueTime", JsonConvert.SerializeObject(new TimerPlus.TimerPackage(GameType.Blackjack)));
			await Clients.Others.SendAsync("Player_Connected", JsonConvert.SerializeObject(_game.Players[id]));
		}

		/// <summary>
		/// Updates a players data.
		/// </summary>
		public async Task Update_PlayerData(string playerData)
        {
			string id = Context.ConnectionId;

			await _game.Players[id].Update(JsonConvert.DeserializeObject<BlackjackPlayerData>(playerData, _serializerSettings));

			await Clients.All.SendAsync("Update_PlayerData_Callback", playerData);
        }

		/// <summary>
		/// Gets all the data the players have sent to the server.
		/// </summary>
		public async Task Get_PlayerData()
        {
			await Clients.Caller.SendAsync("Get_PlayerData_Callback", Blackjack.DictionaryToJson(_game.Players));
        }

        /// <summary>
        /// A player calls "Hit" from the client side and "Hit" either informs the connected players
        /// that the caller busted or gained a new card.
        /// </summary>
        public async Task Hit()
        {
			string id = Context.ConnectionId;
            if (_game.IsPlaying)
			{
				_game.Players[id].Cards.Add(_game.GenerateCard());

				int playerCardValue = Blackjack.CalculateValue(_game.Players[id].Cards.ToList());
				if (playerCardValue > 21)
                {
					Bust();
                }
				else if(playerCardValue == 21)
                {
					Stand();
                }
            }

			await Clients.All.SendAsync("Update_PlayerData_Callback", JsonConvert.SerializeObject(_game.Players[id]));
		}

		/// <summary>
		/// A player calls "Stand" from the client side and "Stand" informs the connectedPlayers that
		/// the caller stands.
		/// </summary>
		public async Task Stand()
        {
			string id = Context.ConnectionId;
			if (_game.IsPlaying && !_game.Players[id].Busted)
			{
				_game.Players[id].Stand = true;
				_game.SwitchTurn();
			}

			await Clients.All.SendAsync("Update_PlayerData_Callback", JsonConvert.SerializeObject(_game.Players[id]));
			await Clients.All.SendAsync("Sync_CurrentTurn", JsonConvert.SerializeObject(_game.SeatTurnIndex));
		}

		/// <summary>
		/// This is called by the server if the "Hit" method calculates a value over 21, "Bust" informs the connectedPlayers that the client that called "Hit" is busted.
		/// </summary>
		public async Task Bust()
        {
			string id = Context.ConnectionId;
            if (_game.IsPlaying)
            {
				_game.Players[id].Busted = true;
				_game.SwitchTurn();
			}

			await Clients.All.SendAsync("Update_PlayerData_Callback", JsonConvert.SerializeObject(_game.Players[id]));
			await Clients.All.SendAsync("Sync_CurrentTurn", JsonConvert.SerializeObject(_game.SeatTurnIndex));
		}

		/// <summary>
		/// Updates the players bet.
		/// </summary>
		public async Task UpdateBet(int betAmount)
        {
			if (_game.IsPlaying) return;
			string id = Context.ConnectionId;
			BetResponse response = new BetResponse(betAmount, _game.Players[id].SeatIndex);
			await Task.Run(() => _gameManager.Bets.AddOrUpdate(id, key => _gameManager.Bets[key] = betAmount, (key, value) => _gameManager.Bets[key] = betAmount));
			await Clients.Others.SendAsync("Sync_PlayerBet", JsonConvert.SerializeObject(response));
        }
    }
}

using Microsoft.AspNetCore.SignalR;
using TEC_KasinoAPI.Models;
using Newtonsoft.Json;
using TEC_KasinoAPI.Models.Data_Models;
using TEC_KasinoAPI.Services;

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
        /// Informs the connctedPlayers that <paramref name="playerData"/> has sat down in a seat.
        /// </summary>
        /// <param name="playerData"></param>
        public async Task JoinSeat(string playerData)
		{
			string id = Context.ConnectionId;
			await Task.Run(() => _gameManager.ConnectedPlayers.TryUpdate(id, JsonConvert.DeserializeObject<PlayerData>(playerData), _gameManager.ConnectedPlayers[id]));
			await Clients.All.SendAsync("DataChanged", GameManager.DictionaryToJson(_gameManager.ConnectedPlayers));
		}

		/// <summary>
		/// Called when a HubConnection on the client side disconnects.
		/// </summary>
		public override Task OnDisconnectedAsync(Exception exception)
		{
			string id = Context.ConnectionId;

			if (_gameManager.SeatTurnIndex == _gameManager.ConnectedPlayers[id].seatIndex)
			{
				_gameManager.SwitchTurn();
				Clients.Others.SendAsync("SyncTurn", JsonConvert.SerializeObject(_gameManager.SeatTurnIndex));
			}

			_gameManager.Bets.TryRemove(new KeyValuePair<string, int>(id, _gameManager.Bets[id]));
			_gameManager.ConnectedPlayers.TryRemove(new KeyValuePair<string, PlayerData>(id, _gameManager.ConnectedPlayers[id]));

			if (_gameManager.ConnectedPlayers.IsEmpty || !_gameManager.CheckPlayers())
			{
				Task.Run(async () => await _gameManager.EndGame());
			}

			Clients.Others.SendAsync("DataChanged", GameManager.DictionaryToJson(_gameManager.ConnectedPlayers));

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

			return base.OnConnectedAsync();
		}

		/// <summary>
		/// Retrieves a new set of <paramref name="playerData"/> and informs the connectedPlayers that the data has changed.
		/// </summary>
		/// <param name="playerData"></param>
		public async Task UpdatePlayerData(string playerData)
		{
			string id = Context.ConnectionId;
			
			await Task.Run(() => _gameManager.ConnectedPlayers.TryUpdate(id, JsonConvert.DeserializeObject<PlayerData>(playerData), _gameManager.ConnectedPlayers[id]));

			await Clients.Client(id).SendAsync("SyncPlaying", JsonConvert.SerializeObject(_gameManager.IsPlaying));
			await Clients.Client(id).SendAsync("SyncTurn", JsonConvert.SerializeObject(_gameManager.SeatTurnIndex));
			await Clients.All.SendAsync("DataChanged", GameManager.DictionaryToJson(_gameManager.ConnectedPlayers));
		}

        /// <summary>
        /// A player calls "Hit" from the client side and "Hit" either informs the connected players
        /// that the caller busted or gained a new card.
        /// </summary>
        /// <returns></returns>
        public async Task Hit()
        {
            if (_gameManager.IsPlaying)
			{
				_gameManager.ConnectedPlayers[Context.ConnectionId].cards.Add(_gameManager.GenerateCard());
				if(GameManager.CalculateValue(_gameManager.ConnectedPlayers[Context.ConnectionId].cards.ToList()) > 21)
                {
					Bust();
                }
            }

			await Clients.All.SendAsync("DataChanged", GameManager.DictionaryToJson(_gameManager.ConnectedPlayers));
		}

		/// <summary>
		/// A player calls "Stand" from the client side and "Stand" informs the connectedPlayers that
		/// the caller stands.
		/// </summary>
		/// <returns></returns>
		public async Task Stand()
        {
			if (_gameManager.IsPlaying && !_gameManager.ConnectedPlayers[Context.ConnectionId].busted)
			{
				_gameManager.ConnectedPlayers[Context.ConnectionId].stand = true;
				_gameManager.SwitchTurn();
			}

			await Clients.All.SendAsync("DataChanged", GameManager.DictionaryToJson(_gameManager.ConnectedPlayers));
			await Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(_gameManager.SeatTurnIndex));
		}

		/// <summary>
		/// This is called by the server if the "Hit" method calculates a value over 21, "Bust" informs
		/// the connectedPlayers that the client that called "Hit" is busted.
		/// </summary>
		public async Task Bust()
        {
            if (_gameManager.IsPlaying)
            {
				_gameManager.ConnectedPlayers[Context.ConnectionId].busted = true;
				_gameManager.SwitchTurn();
			}

			await Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(_gameManager.SeatTurnIndex));
			await Clients.All.SendAsync("DataChanged", GameManager.DictionaryToJson(_gameManager.ConnectedPlayers));
		}

		/// <summary>
		/// Updates the players bet.
		/// </summary>
		public async Task UpdateBet(int betAmount)
        {
			if (_gameManager.IsPlaying) return;
			string id = Context.ConnectionId;
			BetResponse response = new BetResponse(betAmount, _gameManager.ConnectedPlayers[id].seatIndex);
			await Task.Run(() => _gameManager.Bets.AddOrUpdate(id, key => _gameManager.Bets[key] = betAmount, (key, value) => _gameManager.Bets[key] = betAmount));
			await Clients.Others.SendAsync("UpdateSeatBet", JsonConvert.SerializeObject(response));
        }
    }
}

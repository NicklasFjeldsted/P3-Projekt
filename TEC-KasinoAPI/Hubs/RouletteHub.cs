using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
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
		private readonly JsonSerializerSettings _serializerSettings = new JsonSerializerSettings { NullValueHandling = NullValueHandling.Ignore };

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

			Clients.Others.SendAsync("Player_Disconnected", JsonConvert.SerializeObject(_gameManager.ConnectedPlayers[id]));

			_gameManager.Bets.TryRemove(new KeyValuePair<string, int>(id, _gameManager.Bets[id]));
			_gameManager.ConnectedPlayers.TryRemove(new KeyValuePair<string, UserData>(id, _gameManager.ConnectedPlayers[id]));

			return base.OnDisconnectedAsync(exception);
		}

		/// <summary>
		/// Called when a HubConnection on the client side connects.
		/// </summary>
		public override Task OnConnectedAsync()
		{
			string id = Context.ConnectionId;

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
			parsedData.GameType = GameType.Roulette;

			await _gameManager.ConnectedPlayers[id].Update(parsedData);
			await Clients.Caller.SendAsync("Update_Server_DueTime", JsonConvert.SerializeObject(new TimerPlus.TimerPackage(GameType.Roulette)));
			await Clients.Others.SendAsync("Player_Connected", JsonConvert.SerializeObject(_gameManager.ConnectedPlayers[id]));
		}
	}
}

using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Timers;
using TEC_KasinoAPI.Data;
using TEC_KasinoAPI.Helpers;
using TEC_KasinoAPI.Hubs;
using TEC_KasinoAPI.Models;

namespace TEC_KasinoAPI.Services
{
	public enum GameType
    {
		Undefined,
		Blackjack,
		Roulette,
		Slots
    }
    public interface IGameManager
    {
		ConcurrentDictionary<string, UserData> ConnectedPlayers { get; }
		ConcurrentDictionary<string, int> Bets { get; }
		Task Win(BalanceRequest request, string connectionID);
		Task Lose(BalanceRequest request, string connectionID);
    }
    public class GameManager : IGameManager
    {
		// A thread safe dictionary that contains all connectedPlayers data and their connectionIds.
		public ConcurrentDictionary<string, UserData> ConnectedPlayers { get { return connectedPlayers; } }
		private readonly ConcurrentDictionary<string, UserData> connectedPlayers = new ConcurrentDictionary<string, UserData>();

		// A thread safe dictionary that contains all connectedPlayers bets.
		public ConcurrentDictionary<string, int> Bets { get { return bets; } }
		private readonly ConcurrentDictionary<string, int> bets = new ConcurrentDictionary<string, int>();

		private readonly IServiceScopeFactory _scopeFactory;

		public GameManager(IServiceScopeFactory scopeFactory)
        {
			_scopeFactory = scopeFactory;
        }

		/// <summary>
		/// Calculates and add the winnings to the player.
		/// </summary>
		public async Task Win(BalanceRequest request, string connectionID)
		{
			await using(var scope = _scopeFactory.CreateAsyncScope())
            {
				var databaseContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
				var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<BlackjackHub>>();

				AccountBalance accountBalance = await databaseContext.AccountBalances.SingleAsync(x => x.CustomerID == request.CustomerID);

				if (accountBalance == null) return;

				accountBalance.Balance += request.Amount;

				databaseContext.AccountBalances.Update(accountBalance);

				databaseContext.SaveChanges();
				await hubContext.Clients.Client(connectionID).SendAsync("Update_Balance");
			}
		}

		/// <summary>
		/// Calculates and removes the loses from the player.
		/// </summary>
		public async Task Lose(BalanceRequest request, string connectionID)
		{
			await using (var scope = _scopeFactory.CreateAsyncScope())
			{
				var databaseContext = scope.ServiceProvider.GetRequiredService<DatabaseContext>();
				var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<BlackjackHub>>();

				AccountBalance accountBalance = await databaseContext.AccountBalances.SingleAsync(x => x.CustomerID == request.CustomerID);

				if (accountBalance == null) return;

				accountBalance.Balance -= request.Amount;

				databaseContext.AccountBalances.Update(accountBalance);

				databaseContext.SaveChanges();
				await hubContext.Clients.Client(connectionID).SendAsync("Update_Balance");
			}
		}
	}
}

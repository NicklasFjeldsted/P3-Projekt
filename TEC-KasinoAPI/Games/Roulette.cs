using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Timers;
using TEC_KasinoAPI.Helpers;
using TEC_KasinoAPI.Hubs;
using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Services;

namespace TEC_KasinoAPI.Games
{
    public interface IRoulette
    {
        
    }
    public class Roulette : IRoulette
    {
        public ConcurrentDictionary<string, UserData> Players { get { return _players; } }
        private readonly ConcurrentDictionary<string, UserData> _players = new ConcurrentDictionary<string, UserData>();

        // Reference for the timer instance.
        private readonly TimerPlus _timer = TimerPlus.Timers.GetOrAdd(GameType.Roulette, new TimerPlus(5000, GameType.Roulette));

        private readonly IGameManager _gameManager;
        private readonly IServiceScopeFactory _scopeFactory;

        public Roulette(IGameManager gameManager, IServiceScopeFactory scopeFactory)
        {
            _gameManager = gameManager;
            _scopeFactory = scopeFactory;
            _timer.Elapsed += HubTimer_Elapsed;
        }

        /// <summary>
        /// Local method that is called when the timer event is raised.
        /// </summary>
        private void HubTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                IHubContext<RouletteHub> hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<RouletteHub>>();

                hubContext.Clients.All.SendAsync("Update_Server_DueTime", JsonConvert.SerializeObject(new TimerPlus.TimerPackage(GameType.Roulette)));
            }
            StartRound();
        }

        private async Task StartRound()
        {
            foreach (var player in Players)
            {
                Debug.WriteLine($"{player.Key} - {player.Value.FullName}");
            }
            Debug.WriteLine("----------------------\n");
        }
    }

    public struct Odds
    {
        public const double Straight = 14;
        public const double Green = 7;
        public const double Row = 2;
        public const double Column = 1.5;
        public const double RedBlack = 1;
        public const double OddEven = 1;
    }
}

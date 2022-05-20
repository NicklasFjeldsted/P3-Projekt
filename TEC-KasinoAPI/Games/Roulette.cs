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
        ConcurrentDictionary<string, UserData> Players { get; }
        ConcurrentDictionary<string, TileData> PlayerTileData { get; }
    }
    public class Roulette : IRoulette
    {
        public ConcurrentDictionary<string, UserData> Players { get { return m_players; } }
        private readonly ConcurrentDictionary<string, UserData> m_players = new();

        public ConcurrentDictionary<string, TileData> PlayerTileData { get { return m_playerTileData; } }
        private readonly ConcurrentDictionary<string, TileData> m_playerTileData = new();

        // Reference for the timer instance.
        private readonly TimerPlus _timer = TimerPlus.Timers.GetOrAdd(GameType.Roulette, new TimerPlus(5000, GameType.Roulette));

        private readonly IGameManager _gameManager;
        private readonly IServiceScopeFactory _scopeFactory;

        private readonly int m_wheelSpinTime = 4000;
        private int m_winningNumber;

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


            await using (var scope = _scopeFactory.CreateAsyncScope())
            {
                _timer.Stop();
                m_winningNumber = -1;

                IHubContext<RouletteHub> hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<RouletteHub>>();

                await hubContext.Clients.All.SendAsync("Update_Server_DueTime", JsonConvert.SerializeObject(new TimerPlus.TimerPackage(GameType.Roulette)));

                await hubContext.Clients.All.SendAsync("Wheel_Spin", JsonConvert.SerializeObject(TimerPlus.GetNetworkTime().AddMilliseconds(m_wheelSpinTime)));

                m_winningNumber = GetWinningNumber();

                await Task.Delay(m_wheelSpinTime - 500);

                if (m_winningNumber < 1 || m_winningNumber > 36)
                    return;

                await hubContext.Clients.All.SendAsync("Wheel_Stop", JsonConvert.SerializeObject(m_winningNumber));
                _timer.Start();
                await hubContext.Clients.All.SendAsync("Update_Server_DueTime", JsonConvert.SerializeObject(new TimerPlus.TimerPackage(GameType.Roulette)));
            }
        }

        private static int GetWinningNumber()
        {
            Random random = new();
            return random.Next(0, 37);
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

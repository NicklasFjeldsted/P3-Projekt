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
        ConcurrentDictionary<string, List<BetData>> PlayerTileData { get; }
        TimerPlus Timer { get; }
        bool BetLocked { get; }
    }
    public class Roulette : IRoulette
    {
        public ConcurrentDictionary<string, UserData> Players { get { return m_players; } }
        private readonly ConcurrentDictionary<string, UserData> m_players = new();

        public ConcurrentDictionary<string, List<BetData>> PlayerTileData { get { return m_playerTileData; } }
        private readonly ConcurrentDictionary<string, List<BetData>> m_playerTileData = new();

        // Reference for the timer instance.
        private readonly TimerPlus _timer = TimerPlus.Timers.GetOrAdd(GameType.Roulette, new TimerPlus(10000, GameType.Roulette));
        public TimerPlus Timer { get { return _timer; } }

        private readonly IGameManager _gameManager;
        private readonly IServiceScopeFactory _scopeFactory;

        private readonly int m_wheelSpinTime = 10000;
        private int m_winningNumber;

        private bool m_betLocked = false;
        public bool BetLocked { get { return m_betLocked; } }

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

                hubContext.Clients.All.SendAsync("Sync_BetLocked", JsonConvert.SerializeObject(m_betLocked));
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
                m_betLocked = true;
                m_winningNumber = -1;

                IHubContext<RouletteHub> hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<RouletteHub>>();

                await hubContext.Clients.All.SendAsync("Sync_BetLocked", JsonConvert.SerializeObject(m_betLocked));
                await hubContext.Clients.All.SendAsync("Update_Server_DueTime", JsonConvert.SerializeObject(new TimerPlus.TimerPackage(GameType.Roulette)));
                
                m_winningNumber = GetWinningNumber();

                await hubContext.Clients.All.SendAsync("Wheel_Spin", JsonConvert.SerializeObject(m_winningNumber));

                await Task.Delay(m_wheelSpinTime);

                m_betLocked = false;
                _timer.Start();

                await HandleWinners(m_winningNumber);


                await hubContext.Clients.All.SendAsync("Sync_BetLocked", JsonConvert.SerializeObject(m_betLocked));
                await hubContext.Clients.All.SendAsync("Update_Server_DueTime", JsonConvert.SerializeObject(new TimerPlus.TimerPackage(GameType.Roulette)));
            }
        }

        private static int GetWinningNumber()
        {
            Random random = new();
            return random.Next(0, 37);
        }

        private async Task HandleWinners(int winningNumber)
        {
            await using (var scope = _scopeFactory.CreateAsyncScope())
            {
                IHubContext<RouletteHub> hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<RouletteHub>>();

                foreach (var pair in PlayerTileData)
                {
                    double winnings = 0;
                    double loses = 0;
                    double difference = 0;

                    foreach (var betData in pair.Value)
                    {
                        double outcome = GetOdds(betData, winningNumber);
                        if(outcome > 0)
                        {
                            winnings += outcome;
                        }
                        else
                        {
                            loses += betData.betAmount;
                        }
                    }

                    difference = winnings - loses;

                    Debug.WriteLine($"\nWin: {winnings}\nLose: {loses}\nDiff: {difference}\n");

                    await hubContext.Clients.Client(pair.Key).SendAsync("Show_Result", JsonConvert.SerializeObject(difference));

                    if(winnings > 0)
                    {
                        BalanceRequest request = new BalanceRequest();
                        request.CustomerID = Players[ pair.Key ].CustomerID;
                        request.IsInternal = true;

                        request.Amount = winnings;

                        await _gameManager.Win(request, pair.Key);
                    }

                    if(loses > 0)
                    {
                        BalanceRequest request = new BalanceRequest();
                        request.CustomerID = Players[ pair.Key ].CustomerID;
                        request.IsInternal = true;

                        request.Amount = loses;

                        await _gameManager.Lose(request, pair.Key);
                    }

                    await hubContext.Clients.Client(pair.Key).SendAsync("Update_Balance");
                    await hubContext.Clients.Client(pair.Key).SendAsync("Clear_Tiles");
                }
            }
        }

        private double GetOdds(BetData data, int winningNumber)
        {
            double output = 0;
            switch (data.betType)
            {
                case BetType.Row1:
                for (int i = 3; i < 37; i += 3)
                {
                    if (winningNumber == i)
                    {
                        output += data.betAmount * Odds.Row;
                        Debug.WriteLine("\nWin on Row1 - " + output);
                    }
                }
                break;

                case BetType.Row2:
                for (int i = 2; i < 36; i += 3)
                {
                    if (winningNumber == i)
                    {
                        output += data.betAmount * Odds.Row;
                        Debug.WriteLine("\nWin on Row2 - " + output);
                    }
                }
                break;

                case BetType.Row3:
                for (int i = 1; i < 35; i += 3)
                {
                    if (winningNumber == i)
                    {
                        output += data.betAmount * Odds.Row;
                        Debug.WriteLine("\nWin on Row3 - " + output);
                    }
                }
                break;

                case BetType.Column1:
                if(winningNumber > 0 && winningNumber < 13)
                {
                    output += data.betAmount * Odds.Column;
                    Debug.WriteLine("\nWin on Column1 - " + output);
                }
                break;

                case BetType.Column2:
                if (winningNumber > 12 && winningNumber < 25)
                {
                    output += data.betAmount * Odds.Column;
                    Debug.WriteLine("\nWin on Column2 - " + output);
                }
                break;

                case BetType.Column3:
                if (winningNumber > 24 && winningNumber < 37)
                {
                    output += data.betAmount * Odds.Column;
                    Debug.WriteLine("\nWin on Column3 - " + output);
                }
                break;

                case BetType.Even:
                if (winningNumber % 2 == 0)
                {
                    output += data.betAmount * Odds.OddEven;
                    Debug.WriteLine("\nWin on Even - " + output);
                }
                break;

                case BetType.Odd:
                if(winningNumber % 2 == 1)
                {
                    output += data.betAmount * Odds.OddEven;
                    Debug.WriteLine("\nWin on Odd - " + output);
                }
                break;

                case BetType.Straight:
                if(winningNumber == data.number)
                {
                    output += data.betAmount * Odds.Straight;
                    Debug.WriteLine("\nWin on Straight - " + output);
                }
                break;

                case BetType.High:
                if(winningNumber > 18 && winningNumber < 37)
                {
                    output += data.betAmount * Odds.HighLow;
                    Debug.WriteLine("\nWin on High - " + output);
                }
                break;

                case BetType.Low:
                if (winningNumber > 0 && winningNumber < 19)
                {
                    output += data.betAmount * Odds.HighLow;
                    Debug.WriteLine("\nWin on Low - " + output);
                }
                break;

                case BetType.Black:
                if(winningNumber != 0)
                {
                    if(winningNumber % 2 == 0)
                    {
                        output += data.betAmount * Odds.RedBlack;
                        Debug.WriteLine("\nWin on Black - " + output);
                    }
                }
                break;       
                
                case BetType.Red:
                if(winningNumber % 2 == 1)
                {
                    if(data.color == TileColors.Red)
                    {
                        output += data.betAmount * Odds.RedBlack;
                        Debug.WriteLine("\nWin on Red - " + output);
                    }
                }
                break;
            }
            return output;
        }
    }
}

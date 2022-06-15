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
    public interface IBlackjack
    {
        ConcurrentDictionary<string, BlackjackPlayerData> Players { get; }
        ConcurrentDictionary<int, Card> AvailableCards { get; }
        ConcurrentDictionary<int, Card> HouseCards { get; }
        ConcurrentQueue<int> TurnOrder { get; }
        void SwitchTurn();
        Card GenerateCard();
        bool CheckPlayers();
        Task EndGame(bool houseBust = false);
        int SeatTurnIndex { get; }
        bool IsPlaying { get; }
    }
    public class Blackjack : IBlackjack
    {
        // An overall card array of every type of card in the game.
        private readonly Card[] ALL_CARDS =
        {
            new Card(1, 1, "ACE of Hearts"),
            new Card(2, 1, "ACE of Spades"),
            new Card(3, 1, "ACE of Clubs"),
            new Card(4, 1, "ACE of Diamonds"),
            new Card(5, 2, "2 of Hearts"),
            new Card(6, 2, "2 of Spades"),
            new Card(7, 2, "2 of Clubs"),
            new Card(8, 2, "2 of Diamonds"),
            new Card(9, 3, "3 of Hearts"),
            new Card(10, 3, "3 of Spades"),
            new Card(11, 3, "3 of Clubs"),
            new Card(12, 3, "3 of Diamonds"),
            new Card(13, 4, "4 of Hearts"),
            new Card(14, 4, "4 of Spades"),
            new Card(15, 4, "4 of Clubs"),
            new Card(16, 4, "4 of Diamonds"),
            new Card(17, 5, "5 of Hearts"),
            new Card(18, 5, "5 of Spades"),
            new Card(19, 5, "5 of Clubs"),
            new Card(20, 5, "5 of Diamonds"),
            new Card(21, 6, "6 of Hearts"),
            new Card(22, 6, "6 of Spades"),
            new Card(23, 6, "6 of Clubs"),
            new Card(24, 6, "6 of Diamonds"),
            new Card(25, 7, "7 of Hearts"),
            new Card(26, 7, "7 of Spades"),
            new Card(27, 7, "7 of Clubs"),
            new Card(28, 7, "7 of Diamonds"),
            new Card(29, 8, "8 of Hearts"),
            new Card(30, 8, "8 of Spades"),
            new Card(31, 8, "8 of Clubs"),
            new Card(32, 8, "8 of Diamonds"),
            new Card(33, 9, "9 of Hearts"),
            new Card(34, 9, "9 of Spades"),
            new Card(35, 9, "9 of Clubs"),
            new Card(36, 9, "9 of Diamonds"),
            new Card(37, 10, "10 of Hearts"),
            new Card(38, 10, "10 of Spades"),
            new Card(39, 10, "10 of Clubs"),
            new Card(40, 10, "10 of Diamonds"),
            new Card(41, 10, "J of Hearts"),
            new Card(42, 10, "J of Spades"),
            new Card(43, 10, "J of Clubs"),
            new Card(44, 10, "J of Diamonds"),
            new Card(45, 10, "Q of Hearts"),
            new Card(46, 10, "Q of Spades"),
            new Card(47, 10, "Q of Clubs"),
            new Card(48, 10, "Q of Diamonds"),
            new Card(49, 10, "K of Hearts"),
            new Card(50, 10, "K of Spades"),
            new Card(51, 10, "K of Clubs"),
            new Card(52, 10, "K of Diamonds")
        };

        public ConcurrentDictionary<string, BlackjackPlayerData> Players { get { return _players; } }
        private readonly ConcurrentDictionary<string, BlackjackPlayerData> _players = new();

        // A queue that persists between hub instances that contains the turn order of the game.
        public ConcurrentQueue<int> TurnOrder { get { return turnOrder; } }
        private readonly ConcurrentQueue<int> turnOrder = new();

        // A dictionary that persists between hub instances that contains the remaining cards in a game.
        public ConcurrentDictionary<int, Card> AvailableCards { get { return availableCards; } }
        private readonly ConcurrentDictionary<int, Card> availableCards = new();

        // A dictionary that persists between hub instances that contain the cards held by the house.
        public ConcurrentDictionary<int, Card> HouseCards { get { return houseCards; } }
        private readonly ConcurrentDictionary<int, Card> houseCards = new();

        // Reference for the timer instance.
        private readonly TimerPlus _timer = TimerPlus.Timers.GetOrAdd(GameType.Blackjack, new TimerPlus(10000, GameType.Blackjack));

        // The seat index whoms turn it is in a game.
        public int SeatTurnIndex { get { return _seatTurnIndex; } private set { _seatTurnIndex = value; } }
        private int _seatTurnIndex;

        // A bool that is changed to true when there is a game running and false when there is not.
        public bool IsPlaying { get { return _isPlaying; } private set { _isPlaying = value; } }
        private bool _isPlaying = false;

        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IGameManager _gameManager;

        public Blackjack(IServiceScopeFactory scopeFactory, IGameManager gameManger)
        {
            _scopeFactory = scopeFactory;
            _gameManager = gameManger;
            _timer.Elapsed += HubTimer_Elapsed;
        }

        ~Blackjack()
        {
            _timer.Elapsed -= HubTimer_Elapsed;
            _timer.Dispose();
        }

        /// <summary>
        /// Local method that is called when the timer event is raised.
        /// </summary>
        private void HubTimer_Elapsed(object sender, ElapsedEventArgs e)
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                IHubContext<BlackjackHub> hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<BlackjackHub>>();

                hubContext.Clients.All.SendAsync("Update_Server_DueTime", JsonConvert.SerializeObject(new TimerPlus.TimerPackage(GameType.Blackjack)));
            }
            BeginGame();
        }

        /// <summary>
        /// Proceeds the turn order and checks if it is the house's turn.
        /// </summary>
        public void SwitchTurn()
        {
            TurnOrder.TryDequeue(out _seatTurnIndex);

            if (SeatTurnIndex == 0)
            {
                HandleHouseTurn();
            }
        }

        // This method will call itself until a desired outcome leads it to exit.
        // I.E. Recursive.
        /// <summary>
        /// Handles the house turn recursivly.
        /// </summary>
        public async Task HandleHouseTurn()
        {
            switch (CalculateValue(HouseCards.Values))
            {
                // If the house cards' value is 16 or less, draw another card.
                case < 17:
                await Task.Run(() => HouseCards.TryAdd(HouseCards.Count, GenerateCard()));
                HandleHouseTurn();
                break;

                // If the house cards' value is above 21, the house busts and the game ends.
                case > 21:
                EndGame(true);
                break;

                // If the house cards' value is above 16 but below 21 the house stands and the game ends.
                default:
                EndGame();
                break;
            }
            await using (var scope = _scopeFactory.CreateAsyncScope())
            {
                IHubContext<BlackjackHub> hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<BlackjackHub>>();

                await hubContext.Clients.All.SendAsync("Update_HouseCards_Callback", JsonConvert.SerializeObject(HouseCards));
            }
        }

        /// <summary>
        /// Finds all seated players whoms bet is above 0 and adds them to the turnOrder.
        /// </summary>
        private void SetTurnOrder()
        {
            TurnOrder.Clear();
            var players = Players.Where(p => p.Value.Seated == true && _gameManager.Bets[ p.Key ] > 49).ToList();
            foreach (var pair in players)
            {
                if (_gameManager.Bets[ pair.Key ] <= 49)
                    continue;
                TurnOrder.Enqueue(pair.Value.SeatIndex);
            }
            SortQueue();
        }

        /// <summary>
        /// Sorts the turnOrder <see cref="Queue"/> so that the highest seat index is first.
        /// </summary>
        private void SortQueue()
        {
            List<int> sortedList = TurnOrder.ToList();
            sortedList.Sort();
            sortedList.Reverse();
            TurnOrder.Clear();
            sortedList.ForEach(x => TurnOrder.Enqueue(x));
        }

        /// <summary>
        /// Resets all connectedPlayers.
        /// </summary>
        private void ResetPlayers()
        {
            foreach (BlackjackPlayerData data in Players.Values.ToList())
            {
                data.Reset();
            }
        }

        /// <summary>
        /// Calculates the winners by comparing held card values to the house's held card values.
        /// </summary>
        private void CalculateWinners()
        {
            foreach (var pair in Players)
            {
                if (pair.Value.Seated == false)
                    continue;

                if (pair.Value.Busted == true)
                    continue;

                if (CalculateValue(pair.Value.Cards) < CalculateValue(HouseCards.Values))
                    continue;

                BlackjackPlayerData oldData = new(pair.Value);

                pair.Value.Winner = true;

                Players.TryUpdate(pair.Key, pair.Value, oldData);
            }
        }

        /// <summary>
        /// Calculates the value of the <paramref name="cards"/> <see cref="ICollection"/>.
        /// </summary>
        /// <param name="cards"></param>
        /// <returns><see cref="int"/>: the combined value of the entire <paramref name="cards"/> <see cref="ICollection"/> values.</returns>
        public static int CalculateValue(ICollection<Card> cards)
        {
            int output = 0;
            foreach (Card card in cards)
            {
                output += card.value;
            }

            foreach (Card card in cards)
            {
                if (card.id < 0 || card.id > 5)
                    continue;

                if (output > 11)
                    continue;

                output += 10;
            }

            return output;
        }

        /// <summary>
        /// Generates a new random card from the available cards.
        /// </summary>
        /// <returns><see cref="Card"/>: the generated card instance.</returns>
        public Card GenerateCard()
        {
            Random rnd = new();

            int cardIndex = rnd.Next(AvailableCards.Count);

            AvailableCards.Remove(AvailableCards.ElementAt(cardIndex).Key, out Card card);

            return card;
        }

        /// <summary>
        /// Resets the available cards so it is ready for the next round.
        /// </summary>
        private void RefillCards()
        {
            AvailableCards.Clear();

            for (int i = 0; i < ALL_CARDS.Length; i++)
            {
                AvailableCards.AddOrUpdate(AvailableCards.Count, x => AvailableCards[ x ] = ALL_CARDS[ i ], (x, v) => v = ALL_CARDS[ i ]);
            }

            for (int i = 0; i < ALL_CARDS.Length; i++)
            {
                AvailableCards.AddOrUpdate(AvailableCards.Count, x => AvailableCards[ x ] = ALL_CARDS[ i ], (x, v) => v = ALL_CARDS[ i ]);
            }
        }

        /// <summary>
        /// Converts a <see cref="ConcurrentDictionary{string, PlayerData}"/> to a JSON object.
        /// </summary>
        /// <param name="data"></param>
        /// <returns><see cref="string"/>: the converted JSON object as a string.</returns>
        public static string DictionaryToJson<TKey, TValue>(ConcurrentDictionary<TKey, TValue> data)
        {
            IEnumerable<string> entries = data.Select(data =>
                string.Format("\"{0}\": {1}", data.Key,
                string.Join(",", JsonConvert.SerializeObject(data.Value)))).ToList();

            return "{" + string.Join(",", entries) + "}";
        }

        /// <summary>
        /// Checks if there are any seated players whoms bets are above 0.
        /// </summary>
        /// <returns><see cref="bool"/>: true if any player data's seated bool is true otherwise false.</returns>
        public bool CheckPlayers()
        {
            bool anyBets = _gameManager.Bets.Any(x => x.Value > 49);
            bool anySeated = Players.Any(x => x.Value.Seated == true);
            return anyBets && anySeated;
        }

        /// <summary>
        /// This is the intial card deal, it gives all seated players one card then it gives the house one
        /// and then it gives all seated players another card and lastly the house another card.
        /// The first card dealt to the house is visible to all connectedPlayers but the second is only visible
        /// to the server until the "HandleHouseTurn" is called.
        /// </summary>
        /// <returns></returns>
        private void DealCards()
        {
            using (var scope = _scopeFactory.CreateScope())
            {
                var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<BlackjackHub>>();

                foreach (var data in Players.ToList())
                {
                    if (_gameManager.Bets[ data.Key ] <= 49)
                        continue;
                    data.Value.Cards.Add(GenerateCard());
                }

                HouseCards.TryAdd(HouseCards.Count, GenerateCard());

                hubContext.Clients.All.SendAsync("Update_HouseCards_Callback", JsonConvert.SerializeObject(HouseCards));

                foreach (var data in Players.ToList())
                {
                    if (_gameManager.Bets[ data.Key ] <= 49)
                        continue;
                    data.Value.Cards.Add(GenerateCard());

                    string id = Players.First(x => x.Value.CustomerID == data.Value.CustomerID).Key;
                    BalanceRequest request = new(data.Value.CustomerID, _gameManager.Bets.First(x => x.Key == id).Value, true);

                    if (CalculateValue(Players[ id ].Cards) == 21 && Players[ id ].Cards.Count == 2)
                    {
                        request.Amount += request.Amount / 2;
                        _gameManager.Win(request, id);
                    }
                }

                HouseCards.TryAdd(HouseCards.Count, GenerateCard());

                IsPlaying = true;

                hubContext.Clients.All.SendAsync("Sync_CurrentStage", JsonConvert.SerializeObject(IsPlaying));
                hubContext.Clients.All.SendAsync("Get_PlayerData_Callback", DictionaryToJson(Players));
            }
        }

        /// <summary>
        /// This is the method that checks and handles the beginning of a game.
        /// This begins a new game handling everything in order, so a new round can begin.
        /// </summary>
        private async Task BeginGame()
        {
            foreach (var player in Players)
            {
                Debug.WriteLine($"{player.Key} - {player.Value.FullName}");
            }
            Debug.WriteLine("----------------------\n");

            if (IsPlaying || !CheckPlayers())
                return;

            await using (var scope = _scopeFactory.CreateAsyncScope())
            {
                var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<BlackjackHub>>();

                await hubContext.Clients.All.SendAsync("Game_Started");

                HouseCards.Clear();

                ResetPlayers();

                _timer.Stop();

                hubContext.Clients.All.SendAsync("Update_Server_DueTime", JsonConvert.SerializeObject(_timer.DueTime));

                SetTurnOrder();

                RefillCards();

                DealCards();

                SwitchTurn();

                await hubContext.Clients.All.SendAsync("Sync_CurrentTurn", JsonConvert.SerializeObject(SeatTurnIndex));
            }
        }

        /// <summary>
        /// This method is called when the game is over, and handles setup for the next round of the game.
        /// </summary>
        /// <param name="houseBust"></param>
        /// <returns></returns>
        public async Task EndGame(bool houseBust = false)
        {
            if (!IsPlaying)
                return;

            IsPlaying = false;

            if (houseBust)
            {
                foreach (var player in Players.Values)
                {
                    if (!player.Seated)
                        continue;
                    if (player.Busted)
                        continue;

                    player.Winner = true;
                }
            }
            else
            {
                CalculateWinners();
            }

            foreach (var player in Players.Values)
            {
                if (!player.Seated)
                    continue;

                string connectionID = Players.First(x => x.Value.CustomerID == player.CustomerID).Key;
                BalanceRequest request = new(player.CustomerID, _gameManager.Bets.First(x => x.Key == connectionID).Value, true);

                _gameManager.Bets[ connectionID ] = 0;

                if (player.Blackjack)
                    continue;

                if (player.Winner == true)
                {
                    _gameManager.Win(request, connectionID);
                }

                if (player.Winner == false)
                {
                    _gameManager.Lose(request, connectionID);
                }
            }

            SeatTurnIndex = -1;

            _timer.Start();

            await using (var scope = _scopeFactory.CreateAsyncScope())
            {
                var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<BlackjackHub>>();

                await hubContext.Clients.All.SendAsync("Sync_CurrentStage", JsonConvert.SerializeObject(IsPlaying));
                await hubContext.Clients.All.SendAsync("Get_PlayerData_Callback", DictionaryToJson(Players));
                await hubContext.Clients.All.SendAsync("Update_Server_DueTime", JsonConvert.SerializeObject(new TimerPlus.TimerPackage(GameType.Blackjack)));
                await hubContext.Clients.All.SendAsync("Game_Ended");
            }
        }
    }
}

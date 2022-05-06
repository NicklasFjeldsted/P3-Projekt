using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Data;
using System.Collections.Concurrent;
using System.Collections;
using Newtonsoft.Json;
using Timer = System.Timers.Timer;
using System.Timers;
using TEC_KasinoAPI.Helpers;

namespace TEC_KasinoAPI.Hubs
{
    public sealed class TimerPlus : Timer
    {
		private static readonly Lazy<TimerPlus> _instance = new Lazy<TimerPlus>(() => new TimerPlus(5000));
		public static TimerPlus Instance { get { return _instance.Value; } }
		public IHubContext<BlackjackHub> HubContext { get; set; }

		public TimerPlus() { }
		public TimerPlus(double interval) : base(interval)
		{ 
			Elapsed += Timer_Elapsed;
			Start();
		}

		// An extended Dispose method.
		public new void Dispose()
        {
			Stop();
			Elapsed -= Timer_Elapsed;
			base.Dispose();
		}

		/// <summary>
		/// The base method that will be called on the TimerPlus class.
		/// </summary>
		private async void Timer_Elapsed(object sender, ElapsedEventArgs e)
		{
			Debug.WriteLine("\n----------------------");
			Debug.WriteLine("\tOnTimerEvent");
			Debug.WriteLine("----------------------\n");
			await HubContext.Clients.All.SendAsync("RequestBet");
		}
	}
    public class BlackjackHub : Hub
	{
		// An overall card array of every type of card in the game.
		private static Card[] ALL_CARDS =
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

        #region Persistent Data.
        // A dictionary that persists between hub instances that contains all connectedPlayer data and their connectionIds.
        private static readonly ConcurrentDictionary<string, PlayerData> connectedPlayers = new ConcurrentDictionary<string, PlayerData>();
        private static readonly ConcurrentDictionary<string, int> bets = new ConcurrentDictionary<string, int>();

		// A queue that persists between hub instances that contains the turn order of the game.
		private static readonly ConcurrentQueue<int> turnOrder = new ConcurrentQueue<int>();

		// A dictionary that persists between hub instances that contains the remaining cards in a game.
		private static readonly ConcurrentDictionary<int, Card> availableCards = new ConcurrentDictionary<int, Card>();

		// A dictionary that persists between hub instances that contain the cards held by the house.
		private static readonly ConcurrentDictionary<int, Card> houseCards = new ConcurrentDictionary<int, Card>();
        #endregion

        #region Information Variables.
        // The seat index whoms turn it is in a game.
        private static int SeatTurnIndex;

		// A bool that is changed to true when there is a game running and false when there is not.
		private static bool IsPlaying = false;
        #endregion

        // A server instance of the hub to call methods outside of a regular call.
        private readonly IHubContext<BlackjackHub> _hubContext;

		// The context for the Database.
		private static DatabaseContext _context;

		// Static reference for the timer instance.
		private static readonly TimerPlus _timer;

		// Hub instance constructor that dependency injects HubContext and DatabaseContext.
		public BlackjackHub(IHubContext<BlackjackHub> hubContext, DatabaseContext dbContext)
		{
			_hubContext = hubContext;
			_context = dbContext;
			_timer.HubContext = hubContext;
		}

		// Hub static constructor that sets the timer instance reference for the hub static instance.
		// Also subscribe any methods we need to run on the timer event.
		static BlackjackHub()
        {
			_timer = TimerPlus.Instance;
			_timer.Elapsed += HubTimer_Elapsed;
		}

		#region Timer Event Methods
		/// <summary>
		/// Local method that is called when the timer event is raised.
		/// </summary>
		private static void HubTimer_Elapsed(object sender, ElapsedEventArgs e)
		{
			Task.Run(async () => await BeginGame());
		}
		#endregion

		#region Turn Handling & Sorting.
		/// <summary>
		/// Proceeds the turn order and checks if it is the house's turn.
		/// </summary>
		public static void SwitchTurn()
        {
			turnOrder.TryDequeue(out SeatTurnIndex);

			if(SeatTurnIndex == 0)
            {
				HandleHouseTurn();
			}
        }

		// This method will call itself until a desired outcome leads it to exit.
		// I.E. Recursive.
		/// <summary>
		/// Handles the house turn recursivly.
		/// </summary>
		public static async void HandleHouseTurn()
        {
			#pragma warning disable CS4014 // Disables the warning about methods not being awaited.
			switch (CalculateValue(houseCards.Values))
            {
				// If the house cards' value is 16 or less, draw another card.
				case < 17:
					await Task.Run(() => houseCards.TryAdd(houseCards.Count, GenerateCard()));
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
			#pragma warning restore CS4014
			await _timer.HubContext.Clients.All.SendAsync("HouseCards", JsonConvert.SerializeObject(houseCards));
		}

		/// <summary>
		/// Finds all seated players whoms bet is above 0 and adds them to the turnOrder.
		/// </summary>
		private static void SetTurnOrder()
		{
			turnOrder.Clear();
			var players = connectedPlayers.Where(p => p.Value.seated == true).ToList();
			foreach (var pair in players)
			{
				if (bets[pair.Key] <= 0) continue;
				turnOrder.Enqueue(pair.Value.seatIndex);
			}
			SortQueue();
		}

		/// <summary>
		/// Sorts the turnOrder <see cref="Queue"/> so that the highest seat index is first.
		/// </summary>
		private static void SortQueue()
		{
			List<int> sortedList = turnOrder.ToList();
			sortedList.Sort();
			sortedList.Reverse();
			turnOrder.Clear();
			sortedList.ForEach(x => turnOrder.Enqueue(x));
		}
        #endregion

        #region Connection & Data Syncing.
        /// <summary>
        /// Informs the connctedPlayers that <paramref name="playerData"/> has sat down in a seat.
        /// </summary>
        /// <param name="playerData"></param>
        public async Task JoinSeat(string playerData)
		{
			string id = Context.ConnectionId;
			await Task.Run(() => connectedPlayers.TryUpdate(id, JsonConvert.DeserializeObject<PlayerData>(playerData), connectedPlayers[id]));
			await Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
		}

		/// <summary>
		/// Called when a HubConnection on the client side disconnects.
		/// </summary>
		public override Task OnDisconnectedAsync(Exception exception)
		{
			string id = Context.ConnectionId;

			if (SeatTurnIndex == connectedPlayers[id].seatIndex)
			{
				SwitchTurn();
				Task.Run(async () => await _hubContext.Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(SeatTurnIndex)));
			}

			bets.TryRemove(new KeyValuePair<string, int>(id, bets[id]));
			connectedPlayers.TryRemove(new KeyValuePair<string, PlayerData>(id, connectedPlayers[id]));

			if (connectedPlayers.IsEmpty || !connectedPlayers.Any(player => player.Value.seated) && !bets.Any(bet => bet.Value > 0))
			{
				Task.Run(async () => await EndGame());
			}

			Task.Run(async () => await _hubContext.Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers)));

			return base.OnDisconnectedAsync(exception);
		}

		/// <summary>
		/// Called when a HubConnection on the client side connects.
		/// </summary>
		public override Task OnConnectedAsync()
		{
			connectedPlayers.TryAdd(Context.ConnectionId, new PlayerData());
			bets.TryAdd(Context.ConnectionId, 0);

			return base.OnConnectedAsync();
		}

		/// <summary>
		/// Checks if there are any seated players whoms bets are above 0.
		/// </summary>
		/// <returns><see cref="bool"/>: true if any player data's seated bool is true otherwise false.</returns>
		private static bool CheckPlayers()
        {
			bool anyBets = bets.Any(x => x.Value > 0);
			bool anySeated = connectedPlayers.Any(x => x.Value.seated == true);
			return anyBets && anySeated;
		}

		/// <summary>
		/// Retrieves a new set of <paramref name="playerData"/> and informs the connectedPlayers that the data has changed.
		/// </summary>
		/// <param name="playerData"></param>
		public async Task UpdatePlayerData(string playerData)
		{
			string id = Context.ConnectionId;
			
			await Task.Run(() => connectedPlayers.TryUpdate(id, JsonConvert.DeserializeObject<PlayerData>(playerData), connectedPlayers[id]));

			await Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
		}
        #endregion

        #region Gameplay.
        /// <summary>
        /// A player calls "Hit" from the client side and "Hit" either informs the connected players
        /// that the caller busted or gained a new card.
        /// </summary>
        /// <returns></returns>
        public async Task Hit()
        {
            if (IsPlaying)
			{
				connectedPlayers[Context.ConnectionId].cards.Add(GenerateCard());
				if(CalculateValue(connectedPlayers[Context.ConnectionId].cards.ToList()) > 21)
                {
					Bust();
                }
            }

			await Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
		}

		/// <summary>
		/// A player calls "Stand" from the client side and "Stand" informs the connectedPlayers that
		/// the caller stands.
		/// </summary>
		/// <returns></returns>
		public async Task Stand()
        {
			if (IsPlaying && !connectedPlayers[Context.ConnectionId].busted)
			{
				connectedPlayers[Context.ConnectionId].stand = true;
				SwitchTurn();
			}

			await Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
			await Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(SeatTurnIndex));
		}

		/// <summary>
		/// This is called by the server if the "Hit" method calculates a value over 21, "Bust" informs
		/// the connectedPlayers that the client that called "Hit" is busted.
		/// </summary>
		public async void Bust()
        {
            if (IsPlaying)
            {
				connectedPlayers[Context.ConnectionId].busted = true;
				SwitchTurn();
			}

			await Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(SeatTurnIndex));
			await Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
		}

		/// <summary>
		/// This is the intial card deal, it gives all seated players one card then it gives the house one
		/// and then it gives all seated players another card and lastly the house another card.
		/// The first card dealt to the house is visible to all connectedPlayers but the second is only visible
		/// to the server until the "HandleHouseTurn" is called.
		/// </summary>
		/// <returns></returns>
		private static void DealCards()
        {
            foreach (PlayerData data in connectedPlayers.Values.ToList())
            {
				data.cards.Add(GenerateCard());
            }

			houseCards.TryAdd(houseCards.Count, GenerateCard());

			_timer.HubContext.Clients.All.SendAsync("HouseCards", JsonConvert.SerializeObject(houseCards));

			foreach (PlayerData data in connectedPlayers.Values.ToList())
			{
				data.cards.Add(GenerateCard());
			}

			houseCards.TryAdd(houseCards.Count, GenerateCard());

			IsPlaying = true;

			_timer.HubContext.Clients.All.SendAsync("SyncPlaying", JsonConvert.SerializeObject(IsPlaying));
			_timer.HubContext.Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
		}

		/// <summary>
		/// This is the method that checks and handles the beginning of a game.
		/// This begins a new game handling everything in order, so a new round can begin.
		/// </summary>
		private static async Task BeginGame()
        {
			foreach (var player in bets)
			{
				Debug.WriteLine($"{player.Key} - {player.Value}");
			}
			Debug.WriteLine("----------------------\n");

			if (IsPlaying || !CheckPlayers())
				return;

			await _timer.HubContext.Clients.All.SendAsync("GameStarted");

			houseCards.Clear();

			ResetPlayers();

			_timer.Stop();

			SetTurnOrder();

			RefillCards();

			DealCards();

			SwitchTurn();

			await _timer.HubContext.Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(SeatTurnIndex));
		}

		/// <summary>
		/// This method is called when the game is over, and handles setup for the next round of the game.
		/// </summary>
		/// <param name="houseBust"></param>
		/// <returns></returns>
		public static async Task EndGame(bool houseBust = false)
        {
			if (!IsPlaying)
				return;

			IsPlaying = false;

			if (houseBust)
            {
				foreach(var player in connectedPlayers.Values)
                {
					if (!player.seated) continue;
					if (player.busted) continue;

					player.winner = true;
				}
            }
            else
            {
				CalculateWinners();
			}

            foreach (var player in connectedPlayers.Values)
            {
				if(!player.seated) continue;

				string connectionID = connectedPlayers.First(x => x.Value.customerID == player.customerID).Key;
				BalanceRequest request = new BalanceRequest(player.customerID, bets.First(x => x.Key == connectionID).Value);

				bets[connectionID] = 0;

				if(player.winner == true)
                {
					Win(request, connectionID);
                }

				if(player.winner == false)
                {
					Lose(request, connectionID);
                }
            }

			SeatTurnIndex = -1;

			await _timer.HubContext.Clients.All.SendAsync("SyncPlaying", JsonConvert.SerializeObject(IsPlaying));
			await _timer.HubContext.Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
			await _timer.HubContext.Clients.All.SendAsync("GameEnded");

			_timer.Start();
		}

		/// <summary>
		/// Calculates and add the winnings to the player.
		/// </summary>
		public static async void Win(BalanceRequest request, string connectionID)
        {
			AccountBalance accountBalance = _context.AccountBalances.SingleOrDefault(x => x.CustomerID == request.CustomerID);

			if (accountBalance == null) return;

			accountBalance.Balance += request.Amount;

			_context.AccountBalances.Update(accountBalance);

			_context.SaveChanges();

			await _timer.HubContext.Clients.Client(connectionID).SendAsync("UpdateBalance");
		}

		/// <summary>
		/// Calculates and removes the loses from the player.
		/// </summary>
		public static async void Lose(BalanceRequest request, string connectionID)
        {
			AccountBalance accountBalance = _context.AccountBalances.SingleOrDefault(x => x.CustomerID == request.CustomerID);

			if (accountBalance == null) return;

			accountBalance.Balance -= request.Amount;

			_context.AccountBalances.Update(accountBalance);

			_context.SaveChanges();

			await _timer.HubContext.Clients.Client(connectionID).SendAsync("UpdateBalance");
		}

		/// <summary>
		/// Locks in the bet.
		/// </summary>
		public void LockBet(int betAmount)
        {
			bets.AddOrUpdate(Context.ConnectionId, key => bets[key] = betAmount, (key, value) => bets[key] = betAmount);
        }
        #endregion

        #region Helper- & Reset Methods.
        /// <summary>
        /// Resets all connectedPlayers.
        /// </summary>
        private static void ResetPlayers()
        {
			foreach (PlayerData data in connectedPlayers.Values.ToList())
			{
				data.Reset();
			}
		}

		/// <summary>
		/// Calculates the winners by comparing held card values to the house's held card values.
		/// </summary>
		private static void CalculateWinners()
        {
			foreach(var pair in connectedPlayers)
            {
				if (pair.Value.seated == false) continue;

				if (pair.Value.busted == true) continue;

				if (CalculateValue(pair.Value.cards) < CalculateValue(houseCards.Values)) continue;

				PlayerData oldData = new PlayerData(pair.Value);

				pair.Value.winner = true;

				connectedPlayers.TryUpdate(pair.Key, pair.Value, oldData);
            }
        }

		/// <summary>
		/// Calculates the value of the <paramref name="cards"/> <see cref="ICollection"/>.
		/// </summary>
		/// <param name="cards"></param>
		/// <returns><see cref="int"/>: the combined value of the entire <paramref name="cards"/> <see cref="ICollection"/> values.</returns>
		private static int CalculateValue(ICollection<Card> cards)
        {
			int output = 0;
			foreach (Card card in cards)
			{
				output += card.value;
			}
			return output;
		}

		/// <summary>
		/// Generates a new random card from the available cards.
		/// </summary>
		/// <returns><see cref="Card"/>: the generated card instance.</returns>
		private static Card GenerateCard()
		{
			Random rnd = new Random();

			int cardIndex = rnd.Next(availableCards.Count);

			availableCards.Remove(availableCards.ElementAt(cardIndex).Key, out Card card);

			return card;
		}

		/// <summary>
		/// Resets the available cards so it is ready for the next round.
		/// </summary>
		private static void RefillCards()
        {
			availableCards.Clear();

			for (int i = 0; i < ALL_CARDS.Length; i++)
			{
				availableCards.AddOrUpdate(availableCards.Count, x => availableCards[x] = ALL_CARDS[i], (x,v) => v = ALL_CARDS[i]);
			}

			for (int i = 0; i < ALL_CARDS.Length; i++)
			{
				availableCards.AddOrUpdate(availableCards.Count, x => availableCards[x] = ALL_CARDS[i], (x,v) => v = ALL_CARDS[i]);
			}
		}

		/// <summary>
		/// Converts a <see cref="ConcurrentDictionary{string, PlayerData}"/> to a JSON object.
		/// </summary>
		/// <param name="data"></param>
		/// <returns><see cref="string"/>: the converted JSON object as a string.</returns>
		private static string DictionaryToJson<TKey, TValue>(ConcurrentDictionary<TKey, TValue> data)
        {
			IEnumerable<string> entries = data.Select(data =>
				string.Format("\"{0}\": {1}", data.Key,
				string.Join(",", JsonConvert.SerializeObject(data.Value)))).ToList();

			return "{" + string.Join(",", entries) + "}";
		}
        #endregion
    }
}

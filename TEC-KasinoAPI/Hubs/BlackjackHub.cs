using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using TEC_KasinoAPI.Models;
using System.Timers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Collections.Concurrent;
using System.Collections;
using Newtonsoft.Json;

namespace TEC_KasinoAPI.Hubs
{
	public class TimerPlus : System.Timers.Timer
    {
		public static ConcurrentDictionary<string, TimerPlus> _timers = new ConcurrentDictionary<string, TimerPlus>();

		private DateTime m_dueTime;

		public TimerPlus() : base() => Elapsed += ElapsedAction;

		public double TimeLeft => (m_dueTime - DateTime.Now).TotalMilliseconds;

		protected new void Dispose()
        {
			Elapsed -= ElapsedAction;
			base.Dispose();
        }

		public new void Start()
        {
			m_dueTime = DateTime.Now.AddMilliseconds(Interval);
			base.Start();
        }

		private void ElapsedAction(object sender, System.Timers.ElapsedEventArgs e)
        {
            if (AutoReset)
            {
				m_dueTime = DateTime.Now.AddMilliseconds(Interval);
            }
        }
    }
	public class BlackjackHub : Hub
	{
		// An overall card array of every type of card in the game.
		private static Card[] ALL_CARDS =
		{
			new Card(1, 1, "ACE of Hearts"),
			new Card(2, 1, "ACE of Spades"),
			new Card(3, 1, "ACE of Cloves"),
			new Card(4, 1, "ACE of Diamonds"),
			new Card(5, 2, "2 of Hearts"),
			new Card(6, 2, "2 of Spades"),
			new Card(7, 2, "2 of Cloves"),
			new Card(8, 2, "2 of Diamonds"),
			new Card(9, 3, "3 of Hearts"),
			new Card(10, 3, "3 of Spades"),
			new Card(11, 3, "3 of Cloves"),
			new Card(12, 3, "3 of Diamonds"),
			new Card(13, 4, "4 of Hearts"),
			new Card(14, 4, "4 of Spades"),
			new Card(15, 4, "4 of Cloves"),
			new Card(16, 4, "4 of Diamonds"),
			new Card(17, 5, "5 of Hearts"),
			new Card(18, 5, "5 of Spades"),
			new Card(19, 5, "5 of Cloves"),
			new Card(20, 5, "5 of Diamonds"),
			new Card(21, 6, "6 of Hearts"),
			new Card(22, 6, "6 of Spades"),
			new Card(23, 6, "6 of Cloves"),
			new Card(24, 6, "6 of Diamonds"),
			new Card(25, 7, "7 of Hearts"),
			new Card(26, 7, "7 of Spades"),
			new Card(27, 7, "7 of Cloves"),
			new Card(28, 7, "7 of Diamonds"),
			new Card(29, 8, "8 of Hearts"),
			new Card(30, 8, "8 of Spades"),
			new Card(31, 8, "8 of Cloves"),
			new Card(32, 8, "8 of Diamonds"),
			new Card(33, 9, "9 of Hearts"),
			new Card(34, 9, "9 of Spades"),
			new Card(35, 9, "9 of Cloves"),
			new Card(36, 9, "9 of Diamonds"),
			new Card(37, 10, "10 of Hearts"),
			new Card(38, 10, "10 of Spades"),
			new Card(39, 10, "10 of Cloves"),
			new Card(40, 10, "10 of Diamonds"),
			new Card(41, 10, "J of Hearts"),
			new Card(42, 10, "J of Spades"),
			new Card(43, 10, "J of Cloves"),
			new Card(44, 10, "J of Diamonds"),
			new Card(45, 10, "Q of Hearts"),
			new Card(46, 10, "Q of Spades"),
			new Card(47, 10, "Q of Cloves"),
			new Card(48, 10, "Q of Diamonds"),
			new Card(49, 10, "K of Hearts"),
			new Card(50, 10, "K of Spades"),
			new Card(51, 10, "K of Cloves"),
			new Card(52, 10, "K of Diamonds")
		};

        #region Persistent Data.
        // A dictionary that persists between hub instances that contains all connectedPlayer data and their connectionIds.
        private static ConcurrentDictionary<string, PlayerData> connectedPlayers = new ConcurrentDictionary<string, PlayerData>();

		// A queue that persists between hub instances that contains the turn order of the game.
		private static ConcurrentQueue<int> turnOrder = new ConcurrentQueue<int>();

		// A dictionary that persists between hub instances that contains the remaining cards in a game.
		private static ConcurrentDictionary<int, Card> availableCards = new ConcurrentDictionary<int, Card>();

		// A dictionary that persists between hub instances that contain the cards held by the house.
		private static ConcurrentDictionary<int, Card> houseCards = new ConcurrentDictionary<int, Card>();
        #endregion

        #region Information Variables.
        // The seat index whos turn it is in a game.
        private static int seatTurnIndex;

		// A bool that is changed to true when there is a game running and false when there is not.
		private static bool IsPlaying = false;

        //private static int betweenGamesTime = 0;
        #endregion

        // A server instance of the hub to call methods outside of a regular call.
        private readonly IHubContext<BlackjackHub> _hubContext;

		// The timer for checking if a new round should start.
		private TimerPlus _timer = new TimerPlus();

		// Hub constructor that dependency injects the HubContext and starts the timer.
		public BlackjackHub(IHubContext<BlackjackHub> hubContext)
		{
			_hubContext = hubContext;
			StartTimer();
		}

        #region Timer Methods & Functionality.
		/// <summary>
		/// Initialises the timer and start it.
		/// </summary>
        private void StartTimer()
        {
			_timer = TimerPlus._timers.GetOrAdd("GameTimer", _timer);
            _timer.Elapsed += OnTimerEvent;
            _timer.Interval = 5000;
            _timer.Enabled = true;
        }

		/// <summary>
		/// Resets the timer.
		/// </summary>
        private void ResetTimer()
        {
            StopTimer();
            StartTimer();
        }

		/// <summary>
		/// Stops the timer and kills it.
		/// </summary>
        private void StopTimer()
        {
			_timer = TimerPlus._timers.GetOrAdd("GameTimer", _timer);
            _timer.Elapsed -= OnTimerEvent;
            _timer.Enabled = false;
        }

		/// <summary>
		/// The method that is called when the timer time has elapsed.
		/// </summary>
		/// <param name="source"></param>
		/// <param name="e"></param>
        private void OnTimerEvent(object source, ElapsedEventArgs e)
		{
			var timer = (TimerPlus)source;
			BeginGame();
		}
        #endregion

        #region Turn Handling & Sorting.
        /// <summary>
        /// Proceeds the turn order.
        /// </summary>
        public void SwitchTurn()
        {
			turnOrder.TryDequeue(out seatTurnIndex);

			if(seatTurnIndex == 0)
            {
				HandleHouseTurn();
			}
        }

		/// <summary>
		/// Handles the house turn recursivly.
		/// </summary>
		public async Task HandleHouseTurn()
        {
			int value = CalculateValue(houseCards.Values);

			switch (CalculateValue(houseCards.Values))
            {
				case < 17:
					// Hit
					houseCards.TryAdd(houseCards.Count, GenerateCard());
					HandleHouseTurn();
					break;

				case > 21:
					// Bust
					EndGame(true);
					break;

				default:
					// Stand
					EndGame();
					break;
            }
			await _hubContext.Clients.All.SendAsync("HouseCards", JsonConvert.SerializeObject(houseCards));
		}

		/// <summary>
		/// Finds all seated players and adds them to a queue.
		/// </summary>
		private static void SetTurnOrder()
		{
			turnOrder.Clear();
			List<KeyValuePair<string, PlayerData>> players = connectedPlayers.Where(p => p.Value.seated == true).ToList();
			foreach (var pair in players)
			{
				turnOrder.Enqueue(pair.Value.seatIndex);
			}
			SortQueue();
		}

		/// <summary>
		/// Sorts the turnOrder <see cref="Queue"/> so that the highest seat index is first.
		/// </summary>
		private static void SortQueue()
		{
			List<int> temp = turnOrder.ToList();
			temp.Sort();
			temp.Reverse();
			turnOrder.Clear();
			temp.ForEach(x => turnOrder.Enqueue(x));
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
			//ResetTimer();
			connectedPlayers.TryUpdate(id, JsonConvert.DeserializeObject<PlayerData>(playerData), connectedPlayers[id]);
			await Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
		}

		[Obsolete]
		public async Task GetData()
        {
			await Clients.Caller.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
        }

		/// <summary>
		/// Called when a HubConnection on the client side disconnects.
		/// </summary>
		public override Task OnDisconnectedAsync(Exception exception)
		{
			string id = Context.ConnectionId;

			connectedPlayers.TryRemove(new KeyValuePair<string, PlayerData>(id, connectedPlayers[id]));

			if (connectedPlayers.IsEmpty || !connectedPlayers.Any(player => player.Value.seated))
			{
				EndGame();
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

			return base.OnConnectedAsync();
		}

		/// <summary>
		/// Check if any player is seated.
		/// </summary>
		/// <returns><see cref="bool"/>: true if any player data's seated bool is true otherwise false.</returns>
		private static bool CheckPlayers()
        {
			foreach (PlayerData seat in connectedPlayers.Values.ToList())
			{
				if (seat.seated)
				{
					return true;
				}
			}
			return false;
		}

		/// <summary>
		/// Retrieves a new set of <paramref name="playerData"/> and informs the connectedPlayers that the data has changed.
		/// </summary>
		/// <param name="playerData"></param>
		public async Task UpdatePlayerData(string playerData)
		{
			string id = Context.ConnectionId;
			connectedPlayers.TryUpdate(id, JsonConvert.DeserializeObject<PlayerData>(playerData), connectedPlayers[id]);

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
            if (IsPlaying && !connectedPlayers[Context.ConnectionId].busted)
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
			await Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(seatTurnIndex));
		}

		/// <summary>
		/// This is called by the server if the "Hit" method calculates a value over 21, "Bust" informs
		/// the connectedPlayers that the client that called "Hit" is busted.
		/// </summary>
		public async Task Bust()
        {
            if (IsPlaying)
            {
				connectedPlayers[Context.ConnectionId].busted = true;
				SwitchTurn();
			}

			await Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(seatTurnIndex));
			await Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
		}

		/// <summary>
		/// This is the intial card deal, it gives all seated players one card then it gives the house one
		/// and then it gives all seated players another card and lastly the house another card.
		/// The first card dealt to the house is visible to all connectedPlayers but the second is only visible
		/// to the server until the "HandleHouseTurn" is called.
		/// </summary>
		/// <returns></returns>
		private async Task DealCards()
        {
            foreach (PlayerData data in connectedPlayers.Values.ToList())
            {
				data.cards.Add(GenerateCard());
            }

			houseCards.TryAdd(houseCards.Count, GenerateCard());

			await _hubContext.Clients.All.SendAsync("HouseCards", JsonConvert.SerializeObject(houseCards));

			foreach (PlayerData data in connectedPlayers.Values.ToList())
			{
				data.cards.Add(GenerateCard());
			}

			houseCards.TryAdd(houseCards.Count, GenerateCard());

			IsPlaying = true;

			await _hubContext.Clients.All.SendAsync("SyncPlaying", JsonConvert.SerializeObject(IsPlaying));
			await _hubContext.Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
		}

		/// <summary>
		/// This is a method that is subscribed on a timer event that is fired if there are any seated players.
		/// This begins a new game handling everything in order, so a new round can begin.
		/// </summary>
		/// <returns></returns>
		private async Task BeginGame()
        {
			if (IsPlaying || !CheckPlayers())
				return;

			await _hubContext.Clients.All.SendAsync("GameStarted");

			houseCards.Clear();

			ResetPlayers();

			StopTimer();

			SetTurnOrder();

			RefillCards();

			DealCards();

			SwitchTurn();

			await _hubContext.Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(seatTurnIndex));
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

			seatTurnIndex = -1;

			await _hubContext.Clients.All.SendAsync("SyncPlaying", JsonConvert.SerializeObject(IsPlaying));
			await _hubContext.Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
			await _hubContext.Clients.All.SendAsync("GameEnded");

			ResetTimer();
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
				data.busted = false;
				data.stand = false;
				data.winner = false;
				data.cards.Clear();
			}
		}

		/// <summary>
		/// Calculates the winners by comparing held card values to the house's held card values.
		/// </summary>
		private static void CalculateWinners()
        {
			// "pair" is of type KeyValuePair<string, PlayerData>
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
		}

		/// <summary>
		/// Converts a <see cref="ConcurrentDictionary{string, PlayerData}"/> to a JSON object.
		/// </summary>
		/// <param name="data"></param>
		/// <returns><see cref="string"/>: the converted JSON object as a string.</returns>
		private static string DictionaryToJson(ConcurrentDictionary<string, PlayerData> data)
        {
			IEnumerable<string> entries = data.Select(data =>
				string.Format("\"{0}\": {1}", data.Key,
				string.Join(",", JsonConvert.SerializeObject(data.Value)))).ToList();

			return "{" + string.Join(",", entries) + "}";
		}
        #endregion
    }
}

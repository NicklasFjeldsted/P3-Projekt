using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using TEC_KasinoAPI.Models;
using Newtonsoft.Json;
using System.Timers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Collections.Concurrent;
using System.Collections;

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

		private static ConcurrentDictionary<string, PlayerData> connectedPlayers = new ConcurrentDictionary<string, PlayerData>();
		private static ConcurrentQueue<int> turnOrder = new ConcurrentQueue<int>();

		private static ConcurrentDictionary<int, Card> availableCards = new ConcurrentDictionary<int, Card>();
		private static ConcurrentDictionary<int, Card> houseCards = new ConcurrentDictionary<int, Card>();

		private static int seatTurnIndex;
		private static bool IsPlaying = false;
		private static int betweenGamesTime = 0;

		private readonly IHubContext<BlackjackHub> _hubContext;
		private TimerPlus _timer = new TimerPlus();

		public BlackjackHub(IHubContext<BlackjackHub> hubContext)
		{
			_hubContext = hubContext;
			StartTimer();
		}

        #region Timer
        private void StartTimer()
        {
			_timer = TimerPlus._timers.GetOrAdd("GameTimer", _timer);
            _timer.Elapsed += OnTimerEvent;
            _timer.Interval = 5000;
            _timer.Enabled = true;
        }
        private void ResetTimer()
        {
            StopTimer();
            StartTimer();
        }
        private void StopTimer()
        {
			_timer = TimerPlus._timers.GetOrAdd("GameTimer", _timer);
            _timer.Elapsed -= OnTimerEvent;
            _timer.Enabled = false;
        }
        private void OnTimerEvent(object source, ElapsedEventArgs e)
		{
			var timer = (TimerPlus)source;
			BeginGame();
		}
		#endregion

		public void SwitchTurn()
        {
			turnOrder.TryDequeue(out seatTurnIndex);

			if(seatTurnIndex == 0)
            {
				HandleHouseTurn();
			}
        }
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
        public async Task JoinSeat(string playerData)
		{
			string id = Context.ConnectionId;
			//ResetTimer();
			connectedPlayers.TryUpdate(id, JsonConvert.DeserializeObject<PlayerData>(playerData), connectedPlayers[id]);
			await Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
		}
		public async Task UpdatePlayerData(string playerData)
        {
			string id = Context.ConnectionId;
			connectedPlayers.TryUpdate(id, JsonConvert.DeserializeObject<PlayerData>(playerData), connectedPlayers[id]);

			await Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
		}
		public async Task GetData()
        {
			await Clients.Caller.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
        }
		private bool CheckPlayers()
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
		private async Task BeginGame()
        {
			if (IsPlaying || !CheckPlayers())
				return;

			StopTimer();

			SetTurnOrder();

			RefillCards();

			DealCards();

			SwitchTurn();
			Debug.WriteLine("BlackjackHub: {0}", turnOrder.Count);

			await _hubContext.Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(seatTurnIndex));
			await _hubContext.Clients.All.SendAsync("GameStarted");
		}
		public async Task EndGame(bool houseBust = false)
        {
			if (!IsPlaying)
				return;

			IsPlaying = false;

			if (houseBust)
            {
				Debug.WriteLine("BlackjackHub: House Busted! - {0}", CalculateValue(houseCards.Values));
				Debug.WriteLine("BlackjackHub: Winners:");
				foreach(var player in connectedPlayers.Values)
                {
					if (!player.seated) continue;
					if (player.busted) continue;

					Debug.WriteLine(player.fullName);
				}
				Debug.WriteLine("");
            }
            else
            {
				Debug.WriteLine("BlackjackHub: House - {0}", CalculateValue(houseCards.Values));
				Debug.WriteLine("BlackjackHub: Winners:");
				foreach(var player in CalculateWinners())
                {
					Debug.WriteLine(player.fullName);
                }
				Debug.WriteLine("");
			}

			houseCards.Clear();
			foreach (PlayerData data in connectedPlayers.Values.ToList())
			{
				data.busted = false;
				data.stand = false;
				data.cards.Clear();
			}

			ResetTimer();

			await _hubContext.Clients.All.SendAsync("SyncPlaying", JsonConvert.SerializeObject(IsPlaying));
			await _hubContext.Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
			await _hubContext.Clients.All.SendAsync("GameEnded");
		}
		private static List<PlayerData> CalculateWinners()
        {
			List<PlayerData> result = new List<PlayerData>();
			foreach(var pair in connectedPlayers)
            {
				if (pair.Value.seated == false) continue;

				if (pair.Value.busted == true) continue;

				if (CalculateValue(pair.Value.cards) < CalculateValue(houseCards.Values)) continue;

				result.Add(pair.Value);
            }
			return result;
        }
		private static int CalculateValue(ICollection<Card> cards)
        {
			int output = 0;
			foreach (Card card in cards)
			{
				output += card.value;
			}
			return output;
		}
		private static Card GenerateCard()
		{
			Random rnd = new Random();

			int cardIndex = rnd.Next(availableCards.Count);

			availableCards.Remove(availableCards.ElementAt(cardIndex).Key, out Card card);

			return card;
		}
		private static void SetTurnOrder()
        {
			turnOrder.Clear();
			List<KeyValuePair<string, PlayerData>> players = connectedPlayers.Where(p => p.Value.seated == true).ToList();
			foreach(var pair in players)
            {
				turnOrder.Enqueue(pair.Value.seatIndex);
            }
			SortQueue();
        }
		private static void SortQueue()
        {
			List<int> temp = turnOrder.ToList();
			temp.Sort();
			temp.Reverse();
			turnOrder.Clear();
			temp.ForEach(x => turnOrder.Enqueue(x));
        }
		private static void RefillCards()
        {
			availableCards.Clear();

			for (int i = 0; i < ALL_CARDS.Length; i++)
			{
				availableCards.AddOrUpdate(availableCards.Count, x => availableCards[x] = ALL_CARDS[i], (x,v) => v = ALL_CARDS[i]);
			}
		}
        public override Task OnDisconnectedAsync(Exception exception)
		{
			string id = Context.ConnectionId;

			connectedPlayers.TryRemove(new KeyValuePair<string, PlayerData>(id, connectedPlayers[id]));

            if (connectedPlayers.IsEmpty || !connectedPlayers.Any(player => player.Value.seated) )
            {
                EndGame();
            }

			Task.Run(async () => await _hubContext.Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers)));

            return base.OnDisconnectedAsync(exception);
		}
		public override Task OnConnectedAsync()
		{
			connectedPlayers.TryAdd(Context.ConnectionId, new PlayerData());

			return base.OnConnectedAsync();
		}
		public async Task PingServer(string data, string connectionId)
        {
			await Clients.Client(connectionId).SendAsync("PingClient", data);
        }
		private static string DictionaryToJson(ConcurrentDictionary<string, PlayerData> data)
        {
			IEnumerable<string> entries = data.Select(data =>
				string.Format("\"{0}\": {1}", data.Key,
				string.Join(",", JsonConvert.SerializeObject(data.Value)))).ToList();

			return "{" + string.Join(",", entries) + "}";
		}
	}
}

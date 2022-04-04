using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using TEC_KasinoAPI.Models;
using Newtonsoft.Json;
using System.Timers;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System.Collections.Concurrent;

namespace TEC_KasinoAPI.Hubs
{
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

		private static List<Card> availableCards = new List<Card>();
		private static List<Card> houseCards = new List<Card>();

		private static int seatTurnIndex = 9;
		private static bool IsPlaying = false;

		private readonly IHubContext<BlackjackHub> _hubContext;
		private System.Timers.Timer timer;

		public BlackjackHub(IHubContext<BlackjackHub> hubContext)
		{
			_hubContext = hubContext;
			SetTimer();
		}

		private void OnTimerEvent(object source, ElapsedEventArgs e)
        {
			BeginGame();
        }

		private void SetTimer()
        {
			timer = new System.Timers.Timer(5000);
			timer.Elapsed += OnTimerEvent;
			timer.Enabled = true;
			timer.Start();
		}

		public async Task JoinSeat(string playerData)
		{
			string id = Context.ConnectionId;
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

		private static async Task<bool> CheckPlayers()
        {
			return await Task.Run(() =>
			{
				foreach (PlayerData seat in connectedPlayers.Values.ToList())
				{
					if (seat.seated)
					{
						return true;
					}
				}
				return false;
			});
        }

		public async void Hit()
        {
            if (IsPlaying && !connectedPlayers[Context.ConnectionId].busted)
			{
				connectedPlayers[ Context.ConnectionId ].cards.Append(await GenerateCard());
            }

			await Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
		}

		public async void Stand()
        {
			if (IsPlaying && !connectedPlayers[Context.ConnectionId].busted)
			{
				connectedPlayers[Context.ConnectionId].stand = true;
			}

			await Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
			await Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(seatTurnIndex));
		}

		public async void Bust()
        {
            if (IsPlaying)
            {
				connectedPlayers[Context.ConnectionId].busted = true;
			}

			await Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
		}

		private async void DealCards()
        {
            foreach (PlayerData data in connectedPlayers.Values.ToList())
            {
				data.cards.Add(await GenerateCard());
            }

			houseCards.Add(await GenerateCard());

			foreach (PlayerData data in connectedPlayers.Values.ToList())
			{
				data.cards.Add(await GenerateCard());
			}

			houseCards.Add(await GenerateCard());

			IsPlaying = true;

			await _hubContext.Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(seatTurnIndex));
			await _hubContext.Clients.All.SendAsync("SyncPlaying", JsonConvert.SerializeObject(IsPlaying));
			await _hubContext.Clients.All.SendAsync("DataChanged", DictionaryToJson(connectedPlayers));
			await _hubContext.Clients.All.SendAsync("HouseCards", JsonConvert.SerializeObject(houseCards[0]));
		}

		private async void BeginGame()
        {
			if (IsPlaying || !await CheckPlayers())
				return;

			timer.Stop();
			timer.Dispose();

			RefillCards();

			DealCards();

			await _hubContext.Clients.All.SendAsync("GameStarted");
		}

		public async void EndGame()
        {
			if (!IsPlaying)
				return;

			IsPlaying = false;

			SetTimer();

			await _hubContext.Clients.All.SendAsync("SyncPlaying", JsonConvert.SerializeObject(IsPlaying));
			await _hubContext.Clients.All.SendAsync("GameEnded");
		}

		private static async Task<int> CalculateValue(Card[] cards)
        {
			return await Task.Run(() =>
			{
				int output = 0;
				foreach (Card card in cards)
                {
					output += card.value;
                }
				return output;
			});
        }

		private async Task<Card> GenerateCard()
		{
			return await Task.Run(() =>
			{
				Random rnd = new Random();

				int cardIndex = rnd.Next(availableCards.Count);

				Card card = availableCards[cardIndex];

				availableCards.Remove(card);

				return card;
			});
		}

		private static async void RefillCards()
        {
			availableCards.Clear();

			await Task.Run(() =>
			{
				for (int i = 0; i < ALL_CARDS.Length; i++)
				{
					availableCards.Add(ALL_CARDS[i]);
				}
			});
		}

        public override Task OnDisconnectedAsync(Exception exception)
		{
			string id = Context.ConnectionId;

            if (connectedPlayers.IsEmpty || !connectedPlayers.Any(player => player.Value.seated) )
            {
                EndGame();
            }

			connectedPlayers.TryRemove(new KeyValuePair<string, PlayerData>(id, connectedPlayers[id]));

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

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
    public interface IGameManager
    {
		ConcurrentDictionary<string, PlayerData> ConnectedPlayers { get; }
		ConcurrentDictionary<string, int> Bets { get; }
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
    public class GameManager : IGameManager
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

		// A dictionary that persists between hub instances that contains all connectedPlayer data and their connectionIds.
		public ConcurrentDictionary<string, PlayerData> ConnectedPlayers { get { return connectedPlayers; } }
		private readonly ConcurrentDictionary<string, PlayerData> connectedPlayers = new ConcurrentDictionary<string, PlayerData>();

		public ConcurrentDictionary<string, int> Bets { get { return bets; } }
		private readonly ConcurrentDictionary<string, int> bets = new ConcurrentDictionary<string, int>();

		// A queue that persists between hub instances that contains the turn order of the game.
		public ConcurrentQueue<int> TurnOrder { get { return turnOrder; } }
		private readonly ConcurrentQueue<int> turnOrder = new ConcurrentQueue<int>();

		// A dictionary that persists between hub instances that contains the remaining cards in a game.
		public ConcurrentDictionary<int, Card> AvailableCards { get { return availableCards; } }
		private readonly ConcurrentDictionary<int, Card> availableCards = new ConcurrentDictionary<int, Card>();

		// A dictionary that persists between hub instances that contain the cards held by the house.
		public ConcurrentDictionary<int, Card> HouseCards { get { return houseCards; } }
		private readonly ConcurrentDictionary<int, Card> houseCards = new ConcurrentDictionary<int, Card>();


		// Reference for the timer instance.
		private readonly TimerPlus _timer = TimerPlus.Instance;

		// The seat index whoms turn it is in a game.
		public int SeatTurnIndex { get { return _seatTurnIndex; } private set { _seatTurnIndex = value; } }
		private int _seatTurnIndex;

		// A bool that is changed to true when there is a game running and false when there is not.
		public bool IsPlaying { get { return _isPlaying; } private set { _isPlaying = value; } }
		private bool _isPlaying = false;

		private readonly IServiceScopeFactory _scopeFactory;

		public GameManager(IServiceScopeFactory scopeFactory)
        {
			_scopeFactory = scopeFactory;
			_timer.Elapsed += HubTimer_Elapsed;
        }

        ~GameManager()
        {
			_timer.Elapsed -= HubTimer_Elapsed;
			_timer.Dispose();
        }

		/// <summary>
		/// Local method that is called when the timer event is raised.
		/// </summary>
		private void HubTimer_Elapsed(object sender, ElapsedEventArgs e)
		{
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
			await using(var scope = _scopeFactory.CreateAsyncScope())
            {
				IHubContext<BlackjackHub> hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<BlackjackHub>>();

				await hubContext.Clients.All.SendAsync("HouseCards", JsonConvert.SerializeObject(HouseCards));
            }
		}

		/// <summary>
		/// Finds all seated players whoms bet is above 0 and adds them to the turnOrder.
		/// </summary>
		private void SetTurnOrder()
		{
			TurnOrder.Clear();
			var players = ConnectedPlayers.Where(p => p.Value.seated == true && Bets[p.Key] > 0).ToList();
			foreach (var pair in players)
			{
				if (Bets[pair.Key] <= 0) continue;
				TurnOrder.Enqueue(pair.Value.seatIndex);
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
			foreach (PlayerData data in ConnectedPlayers.Values.ToList())
			{
				data.Reset();
			}
		}

		/// <summary>
		/// Calculates the winners by comparing held card values to the house's held card values.
		/// </summary>
		private void CalculateWinners()
		{
			foreach (var pair in ConnectedPlayers)
			{
				if (pair.Value.seated == false) continue;

				if (pair.Value.busted == true) continue;

				if (CalculateValue(pair.Value.cards) < CalculateValue(HouseCards.Values)) continue;

				PlayerData oldData = new PlayerData(pair.Value);

				pair.Value.winner = true;

				ConnectedPlayers.TryUpdate(pair.Key, pair.Value, oldData);
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
			return output;
		}

		/// <summary>
		/// Generates a new random card from the available cards.
		/// </summary>
		/// <returns><see cref="Card"/>: the generated card instance.</returns>
		public Card GenerateCard()
		{
			Random rnd = new Random();

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
				AvailableCards.AddOrUpdate(AvailableCards.Count, x => AvailableCards[x] = ALL_CARDS[i], (x, v) => v = ALL_CARDS[i]);
			}

			for (int i = 0; i < ALL_CARDS.Length; i++)
			{
				AvailableCards.AddOrUpdate(AvailableCards.Count, x => AvailableCards[x] = ALL_CARDS[i], (x, v) => v = ALL_CARDS[i]);
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
			bool anyBets = Bets.Any(x => x.Value > 0);
			bool anySeated = ConnectedPlayers.Any(x => x.Value.seated == true);
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
			using(var scope = _scopeFactory.CreateScope())
            {
				var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<BlackjackHub>>();

				foreach (var data in ConnectedPlayers.ToList())
				{
					if (Bets[data.Key] <= 0) continue;
					data.Value.cards.Add(GenerateCard());
				}

				HouseCards.TryAdd(HouseCards.Count, GenerateCard());

				hubContext.Clients.All.SendAsync("HouseCards", JsonConvert.SerializeObject(HouseCards));

				foreach (var data in ConnectedPlayers.ToList())
				{
					if (Bets[data.Key] <= 0) continue;
					data.Value.cards.Add(GenerateCard());
				}

				HouseCards.TryAdd(HouseCards.Count, GenerateCard());

				IsPlaying = true;

				hubContext.Clients.All.SendAsync("SyncPlaying", JsonConvert.SerializeObject(IsPlaying));
				hubContext.Clients.All.SendAsync("DataChanged", DictionaryToJson(ConnectedPlayers));
			}
		}

		/// <summary>
		/// This is the method that checks and handles the beginning of a game.
		/// This begins a new game handling everything in order, so a new round can begin.
		/// </summary>
		private async Task BeginGame()
		{
			foreach (var player in Bets)
			{
				Debug.WriteLine($"{player.Key} - {player.Value}");
			}
			Debug.WriteLine("----------------------\n");

			if (IsPlaying || !CheckPlayers())
				return;

			await using(var scope = _scopeFactory.CreateAsyncScope())
            {
				var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<BlackjackHub>>();

				await hubContext.Clients.All.SendAsync("GameStarted");

				HouseCards.Clear();

				ResetPlayers();

				_timer.Stop();

				SetTurnOrder();

				RefillCards();

				DealCards();

				SwitchTurn();

				await hubContext.Clients.All.SendAsync("SyncTurn", JsonConvert.SerializeObject(SeatTurnIndex));
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
				foreach (var player in ConnectedPlayers.Values)
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

			foreach (var player in ConnectedPlayers.Values)
			{
				if (!player.seated) continue;

				string connectionID = ConnectedPlayers.First(x => x.Value.customerID == player.customerID).Key;
				BalanceRequest request = new BalanceRequest(player.customerID, Bets.First(x => x.Key == connectionID).Value);

				Bets[connectionID] = 0;

				if (player.winner == true)
				{
					Win(request, connectionID);
				}

				if (player.winner == false)
				{
					Lose(request, connectionID);
				}
			}

			SeatTurnIndex = -1;

			await using(var scope = _scopeFactory.CreateAsyncScope())
            {
				var hubContext = scope.ServiceProvider.GetRequiredService<IHubContext<BlackjackHub>>();

				await hubContext.Clients.All.SendAsync("SyncPlaying", JsonConvert.SerializeObject(IsPlaying));
				await hubContext.Clients.All.SendAsync("DataChanged", DictionaryToJson(ConnectedPlayers));
				await hubContext.Clients.All.SendAsync("GameEnded");
			}

			_timer.Start();
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
				await hubContext.Clients.Client(connectionID).SendAsync("UpdateBalance");
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
				await hubContext.Clients.Client(connectionID).SendAsync("UpdateBalance");
			}
		}
	}
}

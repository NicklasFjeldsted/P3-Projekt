using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using TEC_KasinoAPI.Models;

namespace TEC_KasinoAPI.Hubs
{
	public class BlackjackHub : Hub
	{
		private static Dictionary<string, string> players = new Dictionary<string, string>();

		public async Task JoinSeat(string playerJSON)
		{
			players[Context.ConnectionId] = playerJSON;
			await Clients.All.SendAsync("SeatsChanged", await DictionaryToJson(players));
		}

		public async Task GetData()
        {
			await Clients.Client(Context.ConnectionId).SendAsync("SeatsChanged", await DictionaryToJson(players));
        }

        public override Task OnDisconnectedAsync(Exception exception)
		{
			players.Remove(Context.ConnectionId);
			return base.OnDisconnectedAsync(exception);
		}

		public override Task OnConnectedAsync()
		{
			players.Add(Context.ConnectionId, null);
			return base.OnConnectedAsync();
		}

		public async Task PingServer(string data, string connectionId)
        {
			await Clients.Client(connectionId).SendAsync("PingClient", data);
        }

		private static async Task<string> DictionaryToJson(Dictionary<string, string> data)
        {
			return await Task.Run(() =>
			{
				IEnumerable<string> entries = data.Select(data =>
					string.Format("\"{0}\": {1}", data.Key, string.Join(",", data.Value)));

				return "{" + string.Join(",", entries) + "}";
			});
		}
	}
}

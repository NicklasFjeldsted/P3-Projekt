using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;

namespace TEC_KasinoAPI.Hubs
{
	public class BlackjackHub : Hub
	{
		public async Task JoinRoom(string user, string message)
		{
			Debug.WriteLine("TEST");
			await Clients.All.SendAsync("JoinRoomResponse", user + ": " + message);
		}
	}
}

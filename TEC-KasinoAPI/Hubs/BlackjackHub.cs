using Microsoft.AspNetCore.SignalR;

namespace TEC_KasinoAPI.Hubs
{
	public class BlackjackHub : Hub
	{
		public async Task JoinRoom(string user, string message)
		{
			await Clients.All.SendAsync("JoinRoomResponse", user + ": " + message);
		}
	}
}

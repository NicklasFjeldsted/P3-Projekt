using Microsoft.AspNetCore.SignalR;
using System.Diagnostics;
using TEC_KasinoAPI.Models;

namespace TEC_KasinoAPI.Hubs
{
	public class BlackjackHub : Hub
	{
		public async Task JoinRoom(User user)
		{
			await Clients.All.SendAsync("JoinRoomResponse", user);
		}
		
		public async Task SendMessage(string author, string message)
		{
			await Clients.All.SendAsync("UpdateMessage", author, message);
		}
	}
}

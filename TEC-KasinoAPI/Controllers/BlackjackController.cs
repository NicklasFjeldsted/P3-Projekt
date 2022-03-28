using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;
using TEC_KasinoAPI.Helpers;
using TEC_KasinoAPI.Hubs;
using TEC_KasinoAPI.Models;

namespace TEC_KasinoAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BlackjackController : ControllerBase
	{
		[HttpGet("GetUser")]
		public async Task<IActionResult> GetUser()
		{
			User user = new User
			{
				email = await HttpContext.User.FindFirstAsync(ClaimTypes.Email),
				fullName = await HttpContext.User.FindFirstAsync(ClaimTypes.GivenName)
			};

			if (!string.IsNullOrEmpty(user.email))
			{
				return Ok(user);
			}
			return BadRequest("Invalid user. " + user);
		}
	}
}

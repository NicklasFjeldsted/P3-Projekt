using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using TEC_KasinoAPI.Models;

namespace TEC_KasinoAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BlackjackController : ControllerBase
	{
		[HttpGet("GetUser")]
		public ActionResult GetUser()
		{
			User user = new User
			{
				email = HttpContext.User.FindFirst(ClaimTypes.Email).Value,
				fullName = HttpContext.User.FindFirst(ClaimTypes.GivenName).Value
			};

			if (!string.IsNullOrEmpty(user.email))
			{
				return Ok(user);
			}
			return BadRequest("Invalid user. " + user);
		}
	}
}

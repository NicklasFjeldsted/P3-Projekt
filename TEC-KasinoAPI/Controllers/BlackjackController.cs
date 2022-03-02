using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace TEC_KasinoAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class BlackjackController : ControllerBase
	{
		[HttpGet("GetEmail")]
		public ActionResult GetEmail()
		{
			string email = HttpContext.User.FindFirst(ClaimTypes.Email).Value;
			if (!string.IsNullOrEmpty(email))
			{
				return Ok(new { email = email });
			}
			return BadRequest();
		}
	}
}

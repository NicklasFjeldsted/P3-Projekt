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
		public ActionResult<string> GetEmail()
		{
			var identity = HttpContext.User.Identity as ClaimsIdentity;
			if (identity != null)
			{
				return identity.FindFirst("ClaimName").Value;
			}
			return BadRequest();
		}
	}
}

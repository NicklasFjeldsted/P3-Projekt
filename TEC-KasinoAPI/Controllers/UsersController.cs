using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using TEC_KasinoAPI.Services;
using TEC_KasinoAPI.Models;
using Microsoft.AspNetCore.Http;
using System;

namespace TEC_KasinoAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/[controller]")]
    public class UsersController : ControllerBase
    {
        private IUserService _userService;

        public UsersController(IUserService userService)
        {
            _userService = userService;
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] AuthenticateRequest model)
        {
            AuthenticateResponse response = _userService.Authenticate(model, IPAddress());

            if(response == null)
            {
                return BadRequest(new { message = "Username or password is incorrect." });
            }

            return Ok(response);
        }

        [AllowAnonymous]
        [HttpPost("refresh-token")]
        public IActionResult RefreshToken()
        {
            string refreshToken = Request.Cookies["refreshToken"];
            AuthenticateResponse response = _userService.RefreshToken(refreshToken, IPAddress());

            if(response == null)
            {
                return Unauthorized(new { message = "Invalid token." });
            }

            return Ok(response);
        }

        [HttpPost("revoke-token")]
        public IActionResult RevokeToken([FromBody] RevokeTokenRequest model)
        {
            string token = model.Token ?? Request.Cookies["refreshToken"];

            if(string.IsNullOrEmpty(token))
            {
                return BadRequest(new { message = "Token not found." });
            }

            return Ok(new { message = "Token revoked." });
        }

        [HttpGet]
        public IActionResult GetAll()
        {
            IEnumerable<Customer> customers = _userService.GetAll();
            return Ok(customers);
        }

        [HttpGet("{id}")]
        public IActionResult GetByID(int id)
        {
            Customer customer = _userService.GetById(id);

            if (customer == null) return NotFound();

            return Ok(customer);
        }

        [HttpGet("{id}/refresh-tokens")]
        public IActionResult GetRefreshTokens(int id)
        {
            Customer customer = _userService.GetById(id);

            if(customer == null) return NotFound();

            return Ok(customer.RefreshTokens);
        }

        // Helper method
        private void SetTokenCookit(string token)
        {
            CookieOptions options = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", token, options);
        }

        // Helper method
        private string IPAddress()
        {
            if(Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                return Request.Headers["X-Forwarded-For"];
            }
            else
            {
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            }
        }
        
    }
}

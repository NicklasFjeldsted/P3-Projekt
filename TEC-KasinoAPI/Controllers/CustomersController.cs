using Microsoft.AspNetCore.Authorization;
using TEC_KasinoAPI.Services;
using TEC_KasinoAPI.Models;
using System.Diagnostics;

namespace TEC_KasinoAPI.Controllers
{
    [Authorize] // Makes it so that the api is by default protected by authorization
    [ApiController]
    [Route("api/[controller]")]
    public class CustomersController : ControllerBase
    {
        private ICustomerService _userService;

        public CustomersController(ICustomerService userService)
        {
            _userService = userService;
        }
        
        /// <summary>
        /// Register a new customer from the <paramref name="model"/>.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [AllowAnonymous, HttpPost("register")]
        public IActionResult Register(CustomerRegisterRequest model)
        {
            // Validate the input.
            if(!ModelState.IsValid)
            {
                return BadRequest("Invalid Model:" + model);
            }

            // Register the new customer from the model parameter
            _userService.Register(model);

            // Return -> Code 200 and "Registration successful."
            return Ok(new { message = "Registration successful." });
        }

        /// <summary>
        /// Update the customer with the <paramref name="customerID"/>.
        /// </summary>
        /// <param name="customerID"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("{customerID}")]
        public IActionResult Update(int customerID, CustomerUpdateRequest model)
        {
            // Update the customer
            _userService.Update(customerID, model);

            // Return -> Code 200 and "Customer updated successfully."
            return Ok(new { message = "Customer updated successfully." });
        }

        /// <summary>
        /// Delete a customer with the <paramref name="customerID"/>.
        /// </summary>
        /// <param name="customerID"></param>
        /// <returns></returns>
        [HttpDelete("{customerID}"), Authorize(Roles = "Admin")]
        public IActionResult Delete(int customerID)
        {
            // Delete the customer
            _userService.Delete(customerID);

            // Return -> Code 200 and "Customer deleted successfully"
            return Ok(new { message = "Customer deleted successfully." });
        }

        /// <summary>
        /// Authenticate the email and password from <paramref name="model"/>.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [AllowAnonymous, HttpPost("authenticate")]
        public IActionResult Authenticate([FromBody] AuthenticateRequest model)
        {
            // Validate the input.
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Model:" + model);
            }

            // Get the refresh token in the HttpRequest cookies.
            string refreshToken = Request.Cookies["refreshToken"];

            // If there is a refresh token in the HttpRequest cookies revoke that token.
            if(!string.IsNullOrEmpty(refreshToken))
            {
                _userService.RevokeToken(refreshToken, IPAddress());
            }

            // Do the actual authentication
            // this also gives us a new refresh token along side a new access token.
            AuthenticateResponse response = _userService.Authenticate(model, IPAddress());

            // Check if the response is null
            if(response == null)
            {
                // Return -> Code 400 and "Username or password is incorrect."
                return BadRequest(new { message = "Username or password is incorrect." });
            }

            // Set the new refresh token in the cookies.
            SetTokenCookie(response.RefreshToken);

            // Return -> Code 200 and the customer, refresh token, and access token.
            return Ok(response);
        }

        /// <summary>
        /// Refresh the current access token AND refresh token.
        /// </summary>
        /// <returns></returns>
        [AllowAnonymous, HttpPost("refresh-token")]
        public IActionResult RefreshToken()
        {
            // Get the current refresh token from the Cookies
            string refreshToken = Request.Cookies["refreshToken"];

            // Do the actual refreshing getting back the new tokens
            RefreshTokenResponse response = _userService.RefreshToken(refreshToken, IPAddress());

            // Check if the response is null
            if(response == null)
            {
                // Return -> Code 401 and "Invalid token."
                return Unauthorized(new { message = "Invalid token." });
            }

            // Set the new refresh token into the storage
            SetTokenCookie(response.RefreshToken);

            // Return -> Code 200 and the customer, refresh token, and access token
            return Ok(response);
        }

        /// <summary>
        /// Revoke a specific token.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPost("revoke-token")]
        public IActionResult RevokeToken([FromBody] RevokeTokenRequest model)
        {
            // Validate the input.
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Model:" + model);
            }

            // If the model.Token is null get the Token from the Cookies instead
            string token = model.Token ?? Request.Cookies["refreshToken"];

            Debug.WriteLine("Model Token: " + model.Token, "CustomerController");
            Debug.WriteLine("Cookies Token: " + Request.Cookies["refreshToken"]?.ToString(), "CustomerController");

            // Check if the token is null or empty
            if(string.IsNullOrEmpty(token))
            {
                // Return -> Code 400 and "Token not found."
                return BadRequest(new { message = "Token not found." });
            }

            // Revoke the token.
            _userService.RevokeToken(token, IPAddress());

            // Return -> Code 200 and "Token revoked."
            return Ok(new { message = "Token revoked." });
        }

        /// <summary>
        /// Get all the customers from the database.
        /// </summary>
        /// <returns></returns>
        [HttpGet, Authorize(Roles = "Admin")]
        public IActionResult GetAll()
        {
            // Get all customers from the database
            IEnumerable<Customer> customers = _userService.GetAll();

            // Return -> Code 200 and all the customers
            return Ok(customers);
        }

        /// <summary>
        /// Get a customer by its <paramref name="customerID"/>.
        /// </summary>
        /// <param name="customerID"></param>
        /// <returns></returns>
        [HttpGet("{customerID}")]
        public IActionResult GetByID(int customerID)
        {
            // Get the customer with the customerID parameter
            Customer customer = _userService.GetById(customerID);

            // If the customer wasnt found return -> Code 404
            if (customer == null) return NotFound();

            // If the customer was found return -> Code 200
            // and respond with the customer
            return Ok(customer);
        }

        /// <summary>
        /// Retrieve all refresh tokens associated with the customer with the <paramref name="customerID"/>.
        /// </summary>
        /// <param name="customerID"></param>
        /// <returns></returns>
        [HttpGet("{customerID}/refresh-tokens"), Authorize(Roles = "Admin")]
        public IActionResult GetRefreshTokens(int customerID)
        {
            // Get the customer with the customerID parameter
            Customer customer = _userService.GetById(customerID);

            // If the customer wasnt found return -> Code 404
            if(customer == null) return NotFound();

            // If the customer was found return -> Code 200
            // and respond with the refresh tokens of that customer
            return Ok(customer.RefreshTokens);
        }

        /// <summary>
        /// Sets a new HttpOnly cookie equal to <paramref name="token"/>.
        /// </summary>
        /// <param name="token"></param>
        private void SetTokenCookie(string token)
        {
            // Configure cookie, setting expiration date and enabling HttpOnly
            CookieOptions options = new CookieOptions
            {
                HttpOnly = true,
                SameSite = SameSiteMode.Strict,
                Expires = DateTimeOffset.UtcNow.AddDays(7)
            };

            // Append the token to the cookies of the current response from the server
            Response.Cookies.Append("refreshToken", token, options);
        }

        /// <summary>
        /// Get the IPv4 address of the client calling the api.
        /// </summary>
        /// <returns><see cref="string"/>: returns the IPv4 address</returns>
        private string IPAddress()
        {
            // Check if the http request contains an IP if not get it from the context instead
            if(Request.Headers.ContainsKey("X-Forwarded-For"))
            {
                // Get the IP from the request
                return Request.Headers["X-Forwarded-For"];
            }
            else
            {
                // Get the IP and map it an IPv4
                return HttpContext.Connection.RemoteIpAddress.MapToIPv4().ToString();
            }
        }
        
    }
}

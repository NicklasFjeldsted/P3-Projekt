using Microsoft.AspNetCore.Authorization;
using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Services;

namespace TEC_KasinoAPI.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class BalanceController : ControllerBase
    {
        private IBalanceService _balanceService;

        public BalanceController(IBalanceService balanceService)
        {
            _balanceService = balanceService;
        }

        /// <summary>
        /// Create a new account balance and set it to the <paramref name="customerID"/>.
        /// </summary>
        /// <param name="customerID"></param>
        /// <returns></returns>
        [HttpPost("create"), Authorize(Roles = "Admin")]
        public async Task<IActionResult> Create(int customerID)
        {
            // Create the account balance.
            await _balanceService.CreateAsync(customerID);

            // Return -> Code 200 and "Account balance created."
            return Ok(new { message = "Account balance created." });
        }

        /// <summary>
        /// Delete an account balance that has the <paramref name="customerID"/>.
        /// </summary>
        /// <param name="customerID"></param>
        /// <returns></returns>
        [HttpDelete("delete"), Authorize(Roles = "Admin")]
        public async Task<IActionResult> Delete(int customerID)
        {
            // Delete the customer with the customerID parameter.
            await _balanceService.DeleteAsync(customerID);

            // Return -> Code 200 and "The account balance was deleted."
            return Ok(new { message = "The account balance was deleted." });
        }

        /// <summary>
        /// Update the account balance with the <paramref name="customerID"/> with the new data of <paramref name="model"/>.
        /// </summary>
        /// <param name="customerID"></param>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("update"), Authorize(Roles = "Customer")]
        public async Task<IActionResult> Update([FromBody] BalanceUpdateRequest model)
        {
            // Validate the input.
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Model:" + model);
            }
            // Update the account balance
            await _balanceService.UpdateAsync(model.CustomerID, model);

            // Return -> Code 200 and "Account balance was updated successfully."
            return Ok(new { message = "Account balance was updated successfully." });
        }

        /// <summary>
        /// Add balance to an account balance.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("add-balance")]
        public async Task<IActionResult> AddBalance([FromBody] BalanceRequest model)
        {
            // Validate the input.
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Model:" + model);
            }

            // Add the balance.
            BalanceResponse response = await _balanceService.AddBalanceAsync(model);

            // Return -> Code 200 and the balance response.
            return Ok(response);
        }

        /// <summary>
        /// Subtract balance from an account balance.
        /// </summary>
        /// <param name="model"></param>
        /// <returns></returns>
        [HttpPut("subtract-balance")]
        public async Task<IActionResult> SubtractBalance([FromBody] BalanceRequest model)
        {
            // Validate the input.
            if (!ModelState.IsValid)
            {
                return BadRequest("Invalid Model:" + model);
            }

            // Subtract the balance.
            BalanceResponse response = await _balanceService.SubtractBalanceAsync(model);

            // Return -> Code 200 and the balance response.
            return Ok(response);
        }

        /// <summary>
        /// Get an account balance by its <paramref name="customerID"/>.
        /// </summary>
        /// <param name="customerID"></param>
        /// <returns></returns>
        [HttpGet("{customerID}")]
        public async Task<IActionResult> GetByID(int customerID)
        {
            // Find the account balance with the customerID parameter.
            AccountBalance accountBalance = await _balanceService.GetByIdAsync(customerID);

            // If the account balance wasnt found return -> Code 404
            if(accountBalance == null) return NotFound();

            // If the account balance was found return -> Code 200
            // and respond with the account balance
            return Ok(accountBalance);
        }
    }
}

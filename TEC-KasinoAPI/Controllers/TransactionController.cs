using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Services;

namespace TEC_KasinoAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class TransactionController : ControllerBase
	{
		private ITransactionService _transactionService;

		public TransactionController(ITransactionService transactionService)
		{
			_transactionService = transactionService;
		}

		[HttpPost("create"), Authorize(Roles = "Admin, Customer")]
		public async Task<IActionResult> Create([FromBody]BalanceResponse model)
		{
			await _transactionService.AddTransaction(model);

			return Ok(new { message = "The transaction completed successfully!" });
		}

		[HttpGet("{customerID}"), Authorize(Roles = "Admin, Customer")]
		public async Task<IActionResult> GetById(int customerID)
		{
			List<Transaction> transactions = await _transactionService.GetByIdAsync(customerID);

			return Ok(transactions);
		}
	}
}

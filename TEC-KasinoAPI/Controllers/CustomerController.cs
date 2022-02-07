using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Data;
using Microsoft.EntityFrameworkCore;

namespace TEC_KasinoAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CustomerController : ControllerBase
	{
		private readonly IConfiguration _configuration;
		private readonly DatabaseContext _context;

		public CustomerController(IConfiguration configuration, DatabaseContext context)
		{
			_configuration = configuration;
			_context = context;
		}

		[HttpGet]
		public JsonResult GetCustomer(string email)
		{
			var customer = _context.Customers
				.FromSqlRaw("spReadCustomer {0}", email)
				.ToList()
				.FirstOrDefault();

			return new JsonResult(customer);
		}

		[HttpPost]
		public JsonResult CreateCustomer(Customer custom)
		{
			return null;
		}
	}
}

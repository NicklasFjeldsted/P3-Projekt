using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.SqlClient;
using System.Data;

namespace TEC_KasinoAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class CustomerController : ControllerBase
	{
		private readonly IConfiguration _configuration;
		private readonly DatabaseContext _context;
		private readonly IWebHostEnvironment _env;

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

		/// <summary>
		/// Creates a customer.
		/// </summary>
		/// <remarks>
		/// Sample request:
		///
		///     POST api/Customer/CreateCustomer
		///     {
		///        "Email":
		///        "Password":
		///        "Country":
		///        "PhoneNumber":
		///        "CPRNumber":
		///        "FirstName":
		///        "LastName":
		///        "Address":
		///        "ZipCode":
		///        "Gender": 
		///     }
		///
		/// </remarks>
		/// <param name="item"></param>
		/// <response code="201">Returns the newly created item</response>
		/// <response code="400">If the item is null</response>  

		[HttpPost]
		[Route("CreateCustomer")]
		[Produces("application/json")]
		public JsonResult CreateCustomer(CustomerModel Custom)
		{
			var paraReturnValue = new SqlParameter{ ParameterName = "@ReturnValue", SqlDbType = SqlDbType.NVarChar, Direction = ParameterDirection.Output};
			try
			{
				var httpRequest = Request.Form;
				var cust = _context.Customers
					.FromSqlRaw($"spCreateCustomer {Custom.Email}, {Custom.Password}, {Custom.Country}, " +
					$"{Custom.PhoneNumber}, {Custom.CPRNumber}, {Custom.FirstName}, {Custom.LastName}, " +
					$"{Custom.Address}, {Custom.ZipCode}, {Custom.Gender}, {paraReturnValue}");

				return new JsonResult((string)paraReturnValue.Value);
			}
			catch (Exception)
			{
				return new JsonResult((string)paraReturnValue.Value);
			}
		}
	}

	public class CustomerModel
	{

		public string Email { get; set; }

		public string Password { get; set; }

		public int Country { get; set; }

		public int PhoneNumber { get; set; }

		public string CPRNumber { get; set; }

		public string FirstName { get; set; }

		public string LastName { get; set; }

		public string Address { get; set; }

		public int ZipCode { get; set; }

		public int Gender { get; set; }

	}
//	  "email": "nicklas4@gmail.com",
//  "password": "Nicklas",
//  "country": 1,
//  "phoneNumber": 29854367,
//  "cprNumber": "1234567890",
//  "firstName": "Nicklas",
//  "lastName": "Fjeldsted",
//  "address": "Brøndbyvestervej 17, 2th",
//  "zipCode": 2600,
//  "gender": 1
}

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
		private readonly string conString;
		private SqlConnection con;
		private SqlCommand cmd;

		public CustomerController(IConfiguration configuration, DatabaseContext context)
		{
			_configuration = configuration;
			_context = context;
			conString = _configuration.GetConnectionString("DefaultConnection");
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
		[Route("CreateCustomer")]
		[Produces("application/json")]
		public JsonResult CreateCustomer(CustomerModel Custom)
		{
			using (con = new (conString))
			using (cmd = new ("sp_create_customer"))
			{
				cmd.CommandType = CommandType.StoredProcedure; // Declaring the command to be a Stored Procedure
				
				// Stored Procedure Parameters
				cmd.Parameters.AddWithValue("@Email", Custom.Email);
				cmd.Parameters.AddWithValue("@Password", Custom.Password);
				cmd.Parameters.AddWithValue("@Country", Custom.Country);
				cmd.Parameters.AddWithValue("@Phone", Custom.PhoneNumber);
				cmd.Parameters.AddWithValue("@CPR", Custom.CPRNumber);
				cmd.Parameters.AddWithValue("@FirstName", Custom.FirstName);
				cmd.Parameters.AddWithValue("@LastName", Custom.LastName);
				cmd.Parameters.AddWithValue("@Address", Custom.Address);
				cmd.Parameters.AddWithValue("@ZipCode", Custom.ZipCode);
				cmd.Parameters.AddWithValue("@Gender", Custom.Gender);
				cmd.Parameters.Add("@returnValue", SqlDbType.NVarChar).Direction = ParameterDirection.Output;

				var result = cmd.Parameters["@returnValue"].Value.ToString();

				con.Open();
				try
				{
					cmd.ExecuteNonQuery();
					return new JsonResult(result);
				}
				catch (Exception ex)
				{
					return new JsonResult(result + " " +  ex);
				}
			}
			//FromSqlRaw($"spCreateCustomer {Custom.Email}, {Custom.Password}, {Custom.Country} {Custom.PhoneNumber}, {Custom.CPRNumber}, {Custom.FirstName}, {Custom.LastName}, {Custom.Address}, {Custom.ZipCode}, {Custom.Gender}");
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
//	"email": "nicklas4@gmail.com",
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

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

		private Customer customer;

		public CustomerController(IConfiguration configuration, DatabaseContext context)
		{
			_configuration = configuration;
			_context = context;
			conString = _configuration.GetConnectionString("DefaultConnection");
		}

		[HttpGet]
		[Route("GetCustomer")]
		public JsonResult GetCustomer(string email)
		{
			string query = $"sp_read_customer @email = '{email}'";
			DataTable dt = new DataTable();
			SqlDataReader rd;
			using (con = new(conString))
			using (cmd = new(query, con))
			{
				con.Open();
				rd = cmd.ExecuteReader();

				dt.Load(rd);

				rd.Close();
				con.Close();

			}
			return new JsonResult(dt);
		}

		[HttpGet]
		[Route("GetAllCustomer")]
		public JsonResult GetAllCustomer(string email)
		{
			_context.Customers.Include(e => e.Country).ToList();
			_context.Customers.AsNoTracking().Include(e => e.ZipCode).ToList();
			_context.Customers.Include(e => e.Acc_balance).ToList();
			_context.Customers.Include(e => e.Gender).ToList();
			var customer = _context.Customers.FromSqlRaw("sp_email_search @email = {0}", email).ToList().FirstOrDefault();
			
			return new JsonResult(customer);
		}

		[HttpPut]
		[Route("AddBalance")]
		public JsonResult AddBalance(double amount, int balanceID)
        {
			string result = "Something went wrong!";
			using (con = new(conString))
			using (cmd = new("sp_balance_add", con))
			{
				Response.ContentType = "application/json";
				cmd.CommandType = CommandType.StoredProcedure;

				cmd.Parameters.AddWithValue("@InputValue", amount);
				cmd.Parameters.AddWithValue("@BalanceID", balanceID);
				cmd.Parameters.Add("@Balance", SqlDbType.Int).Direction = ParameterDirection.Output;

				con.Open();

                try
                {
					cmd.ExecuteNonQuery();
					int newBalance = Convert.ToInt32(cmd.Parameters["@Balance"].Value);
					result = $"Successfully added: {amount} to the account. New balance: {newBalance}";
				}
				catch(Exception ex)
                {
					result = "Error: " + ex.Message;
                }

				con.Close();
			}

			return new JsonResult(result);
        }

		[HttpPut]
		[Route("SubtractBalance")]
		public JsonResult SubtractBalance(double amount, int balanceID)
		{
			string result = "Something went wrong!";
			using (con = new(conString))
			using (cmd = new("sp_balance_subtract", con))
			{
				Response.ContentType = "application/json";
				cmd.CommandType = CommandType.StoredProcedure;

				cmd.Parameters.AddWithValue("@InputValue", amount);
				cmd.Parameters.AddWithValue("@BalanceID", balanceID);
				cmd.Parameters.Add("@Balance", SqlDbType.Int).Direction = ParameterDirection.Output;

				con.Open();

				try
				{
					cmd.ExecuteNonQuery();
					int newBalance = Convert.ToInt32(cmd.Parameters["@Balance"].Value);
					result = $"Successfully removed: {amount} from the account. New balance: {newBalance}";
				}
				catch (Exception ex)
				{
					result = "Error: " + ex.Message;
				}

				con.Close();
			}

			return new JsonResult(result);
		}

		[HttpPost]
		[Route("CreateCustomer")]
		[Produces("application/json")]
		public JsonResult CreateCustomer([FromBody]CustomerModel Custom)
		{
			using (con = new (conString))
			using (cmd = new ("sp_create_customer", con))
			{
				Response.ContentType = "application/json";
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
				cmd.Parameters.Add("@returnValue", SqlDbType.NVarChar, 100).Direction = ParameterDirection.Output;
				var result = "Something went wrong";
				con.Open();
				try
				{
					cmd.ExecuteNonQuery();
					result = cmd.Parameters["@returnValue"].Value.ToString();
					return new JsonResult(result);
				}
				catch (Exception ex)
				{
					return new JsonResult(result + " " +  ex);
				}
			}
		}
	}

	//Customer model for 
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

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;
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
		[Route("Login")]
		public JsonResult Login(string email, string password)
		{
			string result = "Something went wrong!";
			using (con = new(conString))
			using (cmd = new("sp_login", con))
			{
				Response.ContentType = "application/json";
				cmd.CommandType = CommandType.StoredProcedure;

				cmd.Parameters.AddWithValue("@Email", email);
				cmd.Parameters.AddWithValue("@Password", password);
				cmd.Parameters.Add("@Count", SqlDbType.Int).Direction = ParameterDirection.Output;

				con.Open();

				try
				{
					cmd.ExecuteNonQuery();

					result = cmd.Parameters["@Count"].Value.ToString();
				}
				catch (Exception ex)
				{
					result = "Error: " + ex.Message;
				}

				con.Close();
			}

			return new JsonResult(result);
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
			_context.Customers.Include(e => e.ZipCode).ToList();
			_context.Customers.Include(e => e.Acc_balance).ToList();
			_context.Customers.Include(e => e.Gender).ToList();
			var customer = _context.Customers.FromSqlRaw("sp_email_search @email = {0}", email).ToList().FirstOrDefault();
			
			return new JsonResult(customer);
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

				cmd.Parameters.AddRange(new []
				{
					new SqlParameter("@Email", Custom.Email),
					new SqlParameter("@Password", Custom.Password),
					new SqlParameter("@Country", Custom.Country),
					new SqlParameter("@Phone", Custom.PhoneNumber),
					new SqlParameter("@CPR", Custom.CPRNumber),
					new SqlParameter("@FirstName", Custom.FirstName),
					new SqlParameter("@LastName", Custom.LastName),
					new SqlParameter("@Address", Custom.Address),
					new SqlParameter("@ZipCode", Custom.ZipCode),
					new SqlParameter("@Gender", Custom.Gender),
					new SqlParameter("@returnValue", SqlDbType.NVarChar, 100){Direction = ParameterDirection.Output }
				}); // Parameter Range containing all parameters for SQL Query
				var result = "Something went wrong";
				con.Open(); // Opening 
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

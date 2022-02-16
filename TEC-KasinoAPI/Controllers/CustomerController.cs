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

		public CustomerController(IConfiguration configuration, DatabaseContext context) // Constructor
		{
			_configuration = configuration;
			_context = context;
			conString = _configuration.GetConnectionString("DefaultConnection");
		}
		// Customer login using POST to avoid showing login information inside of the URL
		[HttpPost]
		[Route("Login")]
		public JsonResult Login([FromBody]CustomerModel custom)
		{
			using (con = new(conString)) // SQL connection
			using (cmd = new("sp_login", con)) // SQL query
			{
				string result = String.Empty; // Empty string for response

				Response.ContentType = "application/json"; // Declaring the response header's content-type
				cmd.CommandType = CommandType.StoredProcedure; // Declaring the command to be a Stored Procedure

				cmd.Parameters.AddRange(new[]
				{
					new SqlParameter("@Email", custom.Email),
					new SqlParameter("@Password", custom.Password),
					new SqlParameter("@Output", SqlDbType.NVarChar, -1){ Direction = ParameterDirection.Output }
				}); // All parameters of the stored procedure stored in a array

				con.Open(); // Opening connection to the database
				try
				{
					cmd.ExecuteNonQuery(); // Executes the query
					result = cmd.Parameters["@Output"].Value.ToString(); // Takes output parameter and converts its value into a string
					RedirectToAction("index.html");
					return new JsonResult(result);  
				}
				catch (Exception)
				{
					return new JsonResult(result); // Error message
				}
			}
		}

		[HttpGet]
		[Route("GetCustomer")]
		public JsonResult GetCustomer(string email)
		{
			using (con = new(conString)) //SQL connection
			using (cmd = new($"sp_read_customer", con)) // SQL query
			{
				var dt = new DataTable();
				SqlDataReader rd;

				Response.ContentType = "application/json"; // Declaring the response header's content-type
				cmd.CommandType = CommandType.StoredProcedure; // Declaring the command to be a Stored Procedure

				cmd.Parameters.AddWithValue("@email", email); // SQL parameter

				con.Open(); // Opening connection to the database
				try
				{
					using (rd = cmd.ExecuteReader()) // Reads rows from query
					{
						dt.Load(rd); // Fills datatable with data from corresponding rows
						return new JsonResult(dt); // Returns the data
					}
				}
				catch(Exception ex)
				{
					return new JsonResult("Error: " + ex.Message); // Error message
				}
			}
		}

		[HttpPost]
		[Route("CreateCustomer")]
		public JsonResult CreateCustomer([FromBody]CustomerModel Custom)
		{
			using (con = new (conString)) // SQL connection
			using (cmd = new ("sp_create_customer", con)) // SQL query
			{
				Response.ContentType = "application/json"; // Declaring the response header's content-type
				cmd.CommandType = CommandType.StoredProcedure; // Declaring the command to be a Stored Procedure

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
				}); // All parameters of the stored procedure stored in a array

				con.Open(); // Opening connection to the database
				try
				{
					cmd.ExecuteNonQuery(); // Executes query
					string result = cmd.Parameters["@returnValue"].Value.ToString(); // Takes output parameter and converts its value into a string
					return new JsonResult(result);
				}
				catch (Exception ex)
				{
					return new JsonResult("Error: " + ex.Message); // Error message
				}
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
}

using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Data;
using Microsoft.EntityFrameworkCore;
using System.Data.SqlClient;
using System.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.Extensions.Options;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using BC = BCrypt.Net.BCrypt;

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
		public JsonResult GetCustomer(string email, string password)
		{
			using (con = new(conString)) //SQL connection
			using (cmd = new($"sp_login", con)) // SQL query
			{
				var dt = new DataTable();
				SqlDataReader rd;

				Response.ContentType = "application/json"; // Declaring the response header's content-type
				cmd.CommandType = CommandType.StoredProcedure; // Declaring the command to be a Stored Procedure

				cmd.Parameters.AddWithValue("@Email", email); // SQL parameter
				cmd.Parameters.AddWithValue("@Password", password); // SQL parameter

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
					return new JsonResult(ex.Message); // Error message
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

		[HttpGet("Public")]
		public IActionResult Public()
		{
			return Ok("Hi, you're on public property!");
		}

		[HttpGet("Admins"), Authorize(Roles = "Customer")] 
		public IActionResult AdminsEndPoint()
		{
			var currentUser = GetCurrentCustomer();
			System.Diagnostics.Debug.WriteLine("hello" + currentUser.Email);
			return Ok($"Hi, {currentUser.FirstName}");
		}

		private CustomerModel GetCurrentCustomer()
		{
			var identity = HttpContext.User.Identity as ClaimsIdentity;

			if(identity != null)
			{
				System.Diagnostics.Debug.WriteLine("Identity is not null!");
				var userClaims = identity.Claims;
				return new CustomerModel
				{
					Email = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Email)?.Value,
					FirstName = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Name)?.Value,
					Role = userClaims.FirstOrDefault(x => x.Type == ClaimTypes.Role)?.Value
				};

			}
			System.Diagnostics.Debug.WriteLine("Is null");
			return null;
		}

		[HttpGet]
		public async Task<ActionResult<List<Customer>>> Get(int userID)
		{
			var user = await _context.Customers
				.Where(x => x.CustomerID == userID)
				.ToListAsync();

			return user;
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
		public string Role { get; set; }
	}
}

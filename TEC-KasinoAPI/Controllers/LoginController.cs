﻿using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using TEC_KasinoAPI.Data;
using TEC_KasinoAPI.Models;

namespace TEC_KasinoAPI.Controllers
{
	[Route("api/[controller]")]
	[ApiController]
	public class LoginController : Controller
	{
		private readonly IConfiguration _configuration;
		private readonly DatabaseContext _context;
		private string conString;
		private SqlConnection con;
		private SqlCommand cmd;

		public LoginController(IConfiguration configuration, DatabaseContext context)
		{
			_configuration = configuration;
			_context = context;
			conString = _configuration.GetConnectionString("DefaultConnection");
		}

		[HttpPost]
		[Route("Login")]
		public IActionResult Login([FromBody] CustomerLogin login)
		{
			var user = Authenticate(login);

			if (user != null)
			{
				var token = Generate(user);
				return Ok(token);
			}

			return NotFound("User not found");
		}



		// Jwt 

		private string Generate(CustomerModel customer)
		{
			List<Claim> claims = new List<Claim>()
			{
				new Claim(ClaimTypes.Name, customer.FirstName),
				new Claim(ClaimTypes.Role, "Customer")
			};

			var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
				_configuration.GetSection("Jwt:Key").Value));

			var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);

			var token = new JwtSecurityToken(
				claims: claims,
				expires: DateTime.Now.AddHours(1),
				signingCredentials: creds);

			return new JwtSecurityTokenHandler().WriteToken(token);
		}

		private CustomerModel Authenticate(CustomerLogin login)
		{
			using (con = new(conString))
			using (cmd = new("sp_read_customer", con))
			{

				cmd.CommandType = CommandType.StoredProcedure; // Declaring the command to be a Stored Procedure

				cmd.Parameters.AddRange(new[]
				{
					new SqlParameter("@Email", login.Email),
					new SqlParameter("@Password", login.Password)
				});

				con.Open();
				try
				{
					using (SqlDataReader reader = cmd.ExecuteReader())
					{
						while (reader.Read())
						{
							int index = 0;
							CustomerModel customer = new CustomerModel()
							{
								Email = reader.GetString(index++),
								Password = reader.GetString(index++),
								Country = reader.GetInt32(index++),
								PhoneNumber = reader.GetInt32(index++),
								CPRNumber = reader.GetString(index++),
								FirstName = reader.GetString(index++),
								LastName = reader.GetString(index++),
								Address = reader.GetString(index++),
								ZipCode = reader.GetInt32(index++),
								Gender = reader.GetInt32(index++),
								Role = "Customer"
							};

							System.Diagnostics.Debug.WriteLine(customer.Role);
							return customer;
						}
						return null;
					}
				}
				catch (Exception ex)
				{
					System.Diagnostics.Debug.WriteLine(ex.Message);
					return null; // Error message
				}
			}
		}



	}
}

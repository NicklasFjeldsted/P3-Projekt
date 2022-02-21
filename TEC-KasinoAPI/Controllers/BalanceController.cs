using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TEC_KasinoAPI.Data;
using TEC_KasinoAPI.Models;
using System.Data.SqlClient;
using System.Data;

namespace TEC_KasinoAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BalanceController : ControllerBase
    {
		// private variables

		private readonly IConfiguration _configuration;
		private readonly DatabaseContext _context;
		private readonly string conString;
		private SqlConnection con;
		private SqlCommand cmd;

		public BalanceController(IConfiguration configuration, DatabaseContext context) // Constructor
		{
			_configuration = configuration;
			_context = context;
			conString = _configuration.GetConnectionString("DefaultConnection");
		}


		//Update balance on AccountBalance (addition input amount on balance)
		[HttpPut]
		[Route("AddBalance")]
		public JsonResult AddBalance([FromBody]AccountBalanceModel acc, double amount)
		{
			using (con = new(conString)) // SQL connection
			using (cmd = new("sp_balance_add", con)) // SQL query
			{
				Response.ContentType = "application/json"; // Declaring the response header's content-type
				cmd.CommandType = CommandType.StoredProcedure; // Declaring the command type of query
				cmd.Parameters.AddRange(new[]
				{
					new SqlParameter("@InputValue", amount),
					new SqlParameter("@BalanceID", acc.BalanceID),
					new SqlParameter("@Balance", SqlDbType.Int){Direction = ParameterDirection.Output }
				}); // All parameters of the stored procedure stored in a array

				con.Open(); // Opening connection to the database

				try
				{
					cmd.ExecuteNonQuery(); // Executes query
					int newBalance = (int)cmd.Parameters["@Balance"].Value; // Takes output parameter and converts its value into a readable integer
					return new JsonResult($"Successfully added: {amount} to the account. New balance: {newBalance}"); 
				}
				catch (Exception ex)
				{
					return new JsonResult("Error: " + ex.Message); // Error message
				}
			}

		}


		//Update balance on AccountBalance (subtract input amount from balance)
		[HttpPut]
		[Route("SubBalance")]
		public JsonResult SubtractBalance([FromBody]AccountBalanceModel acc, double amount)
		{
			using (con = new(conString)) // SQL connection
			using (cmd = new("sp_balance_subtract", con)) // SQL query
			{
				Response.ContentType = "application/json"; // Declaring the response header's content-type
				cmd.CommandType = CommandType.StoredProcedure; // Declaring the command type of query

				cmd.Parameters.AddRange(new[]
				{
					new SqlParameter("@InputValue", amount),
					new SqlParameter("@BalanceID", acc.BalanceID),
					new SqlParameter("@Balance", SqlDbType.Int){Direction = ParameterDirection.Output }
				}); // All parameters of the stored procedure stored in a array

				con.Open(); // Opening connection to the database

				try
				{
					cmd.ExecuteNonQuery(); // Executes query
					int newBalance = (int)cmd.Parameters["@Balance"].Value; // Takes output parameters value and converts it into a readable integer
					return new JsonResult($"Successfully removed: {amount} from the account. New balance: {newBalance}"); 
				}
				catch (Exception ex)
				{
					return new JsonResult("Error: " + ex.Message); 
				}
			}
		}


		//Update deposit limit on AccountBalance
		[HttpPut]
		[Route("UpdateLimit")] 
		public JsonResult UpdateLimit([FromBody]AccountBalanceModel acc)
		{
			using (con = new(conString)) // SQL connection
			using (cmd = new("sp_save_deposit_limit", con)) // SQL query
			{
				Response.ContentType = "application/json"; // Declaring the response header's content-type
				cmd.CommandType = CommandType.StoredProcedure; // Declaring the command type of query

				cmd.Parameters.AddRange(new []
				{
					new SqlParameter("@BalanceID", acc.BalanceID),
					new SqlParameter("@InputValue", acc.DepositLimit)
				}); // All parameters of the stored procedure stored in a array

				con.Open(); // Opening connection to the database
				try
				{
					cmd.ExecuteNonQuery(); // Executes query
					return new JsonResult($"Updated deposit limit to {acc.DepositLimit} on AccountBalance: {acc.BalanceID}.");
				}
				catch (Exception ex)
				{
					return new JsonResult($"Failed to update deposit limit to {acc.DepositLimit} on AccountBalance: {acc.BalanceID}. Error: {ex.Message}");
				}
			}
		}

	}
}

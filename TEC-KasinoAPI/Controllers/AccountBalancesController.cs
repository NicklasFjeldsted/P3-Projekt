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
    public class AccountBalancesController : ControllerBase
    {
		private readonly IConfiguration _configuration;
		private readonly DatabaseContext _context;
		private readonly string conString;
		private SqlConnection con;
		private SqlCommand cmd;

		public AccountBalancesController(IConfiguration configuration, DatabaseContext context)
		{
			_configuration = configuration;
			_context = context;
			conString = _configuration.GetConnectionString("DefaultConnection");
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
				catch (Exception ex)
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

		private bool AccountBalanceExists(int id)
        {
            return _context.AccountBalances.Any(e => e.BalanceID == id);
        }
    }
}

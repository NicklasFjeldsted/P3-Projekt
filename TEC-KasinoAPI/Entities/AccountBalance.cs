using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TEC_KasinoAPI.Models
{
	public class AccountBalance
	{
		[Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
		public int CustomerID { get; set; }

		public double Balance { get; set; }
		public int DepositLimit { get; set; }

		public IList<Transaction> Transactions { get; } = new List<Transaction>();
	}
}



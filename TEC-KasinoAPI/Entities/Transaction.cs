using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TEC_KasinoAPI.Models
{
	public class Transaction
	{
		[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int TransactionID { get; set; }

		public int? CustomerID { get; set; }
		public AccountBalance Balance { get; set; }

		public DateTime TransactionDate { get; set; }
		public string Amount { get; set; }
		public double CurrentBalance { get; set; }
	}
}

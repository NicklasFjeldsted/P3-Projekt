using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TEC_KasinoAPI.Models
{
	public class AccountBalance
	{
		[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int BalanceID { get; set; }
		public int CustomerID { get; set; }
		public Customer Customer { get; set; }
		public double Balance { get; set; }
		public ICollection<Transaction> Transactions { get; set; }
	}
}



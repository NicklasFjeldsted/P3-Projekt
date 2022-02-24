using System.ComponentModel.DataAnnotations;

namespace TEC_KasinoAPI.Models
{
	public class BalanceRequest
	{
		[Required]
		public int CustomerID { get; set; }
		[Required]
		public double Amount { get; set; }
	}
}

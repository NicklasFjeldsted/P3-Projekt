using System.ComponentModel.DataAnnotations;

namespace TEC_KasinoAPI.Models
{
	public class BalanceRequest
	{
		public BalanceRequest() {}

        public BalanceRequest(int customerID, double amount)
        {
            CustomerID = customerID;
            Amount = amount;
        }

        [Required]

		public int CustomerID { get; set; }
		[Required]
		public double Amount { get; set; }
	}
}

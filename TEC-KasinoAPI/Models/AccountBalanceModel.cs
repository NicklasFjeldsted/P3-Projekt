namespace TEC_KasinoAPI.Models
{
	public class AccountBalanceModel
	{
		public int BalanceID { get; set; }
		public int CustomerID { get; set; }
		public double Balance { get; set; }
		public int DepositLimit { get; set; }
	}
}

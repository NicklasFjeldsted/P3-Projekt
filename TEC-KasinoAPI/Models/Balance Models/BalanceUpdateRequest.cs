namespace TEC_KasinoAPI.Models
{
    public class BalanceUpdateRequest
    {
        public int CustomerID { get; set; }
        public int DepositLimit { get; set; }
    }
}

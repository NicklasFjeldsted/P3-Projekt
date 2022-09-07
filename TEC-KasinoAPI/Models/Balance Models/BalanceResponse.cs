namespace TEC_KasinoAPI.Models
{
    public class BalanceResponse
    {
        public int CustomerID { get; set; }
        public double Balance { get; set; }
        public string Difference { get; set; }
        public int DepositLimit { get; set; }
        public bool IsInternal { get; set; }

        public BalanceResponse(string difference)
        {
            Difference = difference;
        }
    }
}
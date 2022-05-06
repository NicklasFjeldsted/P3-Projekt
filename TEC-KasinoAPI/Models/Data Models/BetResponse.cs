namespace TEC_KasinoAPI.Models.Data_Models
{
    public class BetResponse
    {
        public int amount;
        public int seatIndex;

        public BetResponse(int _amount, int _seatIndex)
        {
            amount = _amount;
            seatIndex = _seatIndex;
        }
    }
}

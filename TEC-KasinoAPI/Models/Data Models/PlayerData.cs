namespace TEC_KasinoAPI.Models
{
    public class PlayerData
    {
        public string fullName;
        public string email;
        public int seatIndex;
        public int customerID;
        public bool seated;
        public bool stand;
        public bool busted;
        public bool winner;
        public List<Card> cards;
        public int betAmount;

        public PlayerData() { }
        public PlayerData(PlayerData newData)
        {
            fullName = newData.fullName;
            email = newData.email;
            customerID = newData.customerID;
            seatIndex = newData.seatIndex;
            seated = newData.seated;
            stand = newData.stand;
            busted = newData.busted;
            winner = newData.winner;
            betAmount = newData.betAmount;
            cards = newData.cards.ToList();
        }

        public void Reset()
        {
            busted = false;
            stand = false;
            winner = false;
            betAmount = 0;
            cards.Clear();
        }
    }
}

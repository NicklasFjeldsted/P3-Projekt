namespace TEC_KasinoAPI.Models
{
    public class PlayerData
    {
        public string fullName;
        public string email;
        public int seatIndex;
        public bool seated;
        public bool stand;
        public bool busted;
        public bool winner;
        public List<Card> cards;

        public PlayerData() { }
        public PlayerData(PlayerData newData)
        {
            fullName = newData.fullName;
            email = newData.email;
            seatIndex = newData.seatIndex;
            seated = newData.seated;
            stand = newData.stand;
            busted = newData.busted;
            winner = newData.winner;
            cards = newData.cards.ToList();
        }
    }
}

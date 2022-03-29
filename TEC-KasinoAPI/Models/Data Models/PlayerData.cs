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
        public List<Card> cards;
    }
}

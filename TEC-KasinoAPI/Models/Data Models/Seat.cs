namespace TEC_KasinoAPI.Models
{
    public class PlayerData
    {
        public string fullName;
        public int seatIndex;
        public bool seated;
        public bool stand;
        public bool busted;
        public List<Card> cards;
    }
}

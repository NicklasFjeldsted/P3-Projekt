namespace TEC_KasinoAPI.Models
{
    public class Seat
    {
        public string fullName;
        public string entityID;
        public int seatIndex;
        public bool seated;
        public bool stand;
        public bool busted;
        public List<Card> cards;
    }
}

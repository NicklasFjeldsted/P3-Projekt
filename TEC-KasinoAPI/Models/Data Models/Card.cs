namespace TEC_KasinoAPI.Models
{
    public class Card
    {
        public int id { get; private set; }
        public string name { get; private set; }
        public int value { get; private set; }

        public Card(int id, int value, string name)
        {
            this.id = id;
            this.name = name;
            this.value = value;
        }
    }
}

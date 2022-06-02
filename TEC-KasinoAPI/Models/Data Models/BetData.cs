namespace TEC_KasinoAPI.Models
{
    public class BetData
    {
        public TileColors color;
        public int number;
        public int betAmount;
        public double odds;
    }

    public enum TileColors
    {
        Red,
        Black,
        Green
    }
}

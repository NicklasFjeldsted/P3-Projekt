namespace TEC_KasinoAPI.Models
{
    public class TileData
    {
        public TileColors color;
        public int number;
        public int betAmount;
    }

    public enum TileColors
    {
        Red,
        Black,
        Green
    }
}

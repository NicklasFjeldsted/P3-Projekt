namespace TEC_KasinoAPI.Models
{
    public class BetData
    {
        public TileColors color;
        public int number;
        public int betAmount;
        public BetType betType;
    }

    public enum TileColors
    {
        Red,
        Black,
        Green
    }

    public enum BetType
    {
        Straight,
        Row1,
        Row2,
        Row3,
        Column1,
        Column2,
        Column3,
        Odd,
        Even,
        Green,
        Red,
        Black,
        High,
        Low
    }

    public struct Odds
    {
        public const double Straight = 35;
        public const double Row = 2;
        public const double Column = 2;
        public const double RedBlack = 1;
        public const double OddEven = 1;
        public const double HighLow = 1;
        // public const double Street = 11;
        // public const double Split = 17;
        // public const double Corner = 8;
        // public const double Basket = 6;
        // public const double Line = 5;
    }
}

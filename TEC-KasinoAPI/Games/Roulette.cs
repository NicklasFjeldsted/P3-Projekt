using TEC_KasinoAPI.Helpers;
using TEC_KasinoAPI.Services;

namespace TEC_KasinoAPI.Games
{
    public interface IRoulette
    {
        
    }
    public class Roulette : IRoulette
    {
        // Reference for the timer instance.
        private readonly TimerPlus _timer = TimerPlus.Timers.GetOrAdd(GameType.Roulette, new TimerPlus(5000, GameType.Roulette));

        private readonly IGameManager _gameManager;

        public Roulette(IGameManager gameManager)
        {
            _gameManager = gameManager;
        }
    }
}

using Timer = System.Timers.Timer;

namespace TEC_KasinoAPI.Helpers
{
    /// <summary>
    /// Timer extension methods encapsulation class.
    /// </summary>
    public static class TimerExtensionMethods
    {
        /// <summary>
        /// Resets the timer, starting it over.
        /// </summary>
        public static void Reset(this Timer timer)
        {
            timer.Stop();
            timer.Start();
        }
    }
}

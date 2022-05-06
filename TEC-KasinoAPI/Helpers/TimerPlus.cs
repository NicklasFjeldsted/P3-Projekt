using System.Diagnostics;
using System.Timers;
using Timer = System.Timers.Timer;

namespace TEC_KasinoAPI.Helpers
{
	public sealed class TimerPlus : Timer
	{
		private static readonly Lazy<TimerPlus> _instance = new Lazy<TimerPlus>(() => new TimerPlus(5000));
		public static TimerPlus Instance { get { return _instance.Value; } }

		public TimerPlus() { }
		public TimerPlus(double interval) : base(interval)
		{
			Elapsed += Timer_Elapsed;
			Start();
		}

		// An extended Dispose method.
		public new void Dispose()
		{
			Stop();
			Elapsed -= Timer_Elapsed;
			base.Dispose();
		}

		/// <summary>
		/// The base method that will be called on the TimerPlus class.
		/// </summary>
		private void Timer_Elapsed(object sender, ElapsedEventArgs e)
		{
			Debug.WriteLine("\n----------------------");
			Debug.WriteLine("\tOnTimerEvent");
			Debug.WriteLine("----------------------\n");
		}
	}
}
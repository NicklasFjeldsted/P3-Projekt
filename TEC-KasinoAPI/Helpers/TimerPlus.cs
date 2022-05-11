using System.Diagnostics;
using System.Timers;
using Timer = System.Timers.Timer;

namespace TEC_KasinoAPI.Helpers
{
	public sealed class TimerPlus : Timer
	{
		private static readonly Lazy<TimerPlus> _instance = new Lazy<TimerPlus>(() => new TimerPlus(15000));
		public static TimerPlus Instance { get { return _instance.Value; } }

		private DateTime _dueTime;
		public DateTime DueTime { get { return _dueTime; } }
		public double TimeLeft => (_dueTime - DateTime.Now).TotalMilliseconds;

		public TimerPlus(double interval) : base(interval)
		{
			Elapsed += Timer_Elapsed;
			Start();
		}

		public new void Start()
        {
			_dueTime = DateTime.Now.AddMilliseconds(Interval);
			base.Start();
        }

		public new void Stop()
        {
			_dueTime = DateTime.Now;
			base.Stop();
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
            if (AutoReset)
            {
				_dueTime = DateTime.Now.AddMilliseconds(Interval);
            }
			Debug.WriteLine("\n----------------------");
			Debug.WriteLine("\tOnTimerEvent");
			Debug.WriteLine("----------------------");
		}
	}
}
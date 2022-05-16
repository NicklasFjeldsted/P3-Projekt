using System.Collections.Concurrent;
using System.Diagnostics;
using System.Net;
using System.Net.Sockets;
using System.Timers;
using TEC_KasinoAPI.Services;
using Timer = System.Timers.Timer;

namespace TEC_KasinoAPI.Helpers
{
	public sealed class TimerPlus : Timer
	{
		public static ConcurrentDictionary<GameType, TimerPlus> Timers = new ConcurrentDictionary<GameType, TimerPlus>();

		public GameType timerGameType;

		private DateTime _startTime;
		public DateTime StartTime { get { return _startTime; } }

		private DateTime _dueTime;
		public DateTime DueTime { get { return _dueTime; } }
		public double Duration => (_dueTime - _startTime).TotalMilliseconds;
		
		public TimerPlus(double interval, GameType gameType) : base(interval)
		{
			Elapsed += Timer_Elapsed;
			timerGameType = gameType;
			Start();
		}

		public class TimerPackage
        {
			public TimerPackage(GameType gameType) 
			{ 
				StartTime = Timers[gameType].StartTime; 
				DueTime = Timers[gameType].DueTime;
			}
			public DateTime StartTime { get; private set; }
			public DateTime DueTime { get; private set; }
        }

		public new void Start()
        {
			_startTime = GetNetworkTime();
			_dueTime = GetNetworkTime().AddMilliseconds(Interval);
			base.Start();
        }

		public new void Stop()
        {
			_dueTime = GetNetworkTime();
			base.Stop();
        }

		// An extended Dispose method.
		public new void Dispose()
		{
			Stop();
			Elapsed -= Timer_Elapsed;
			base.Dispose();
		}

		public static DateTime GetNetworkTime()
        {
			const string ntpServer = "time.windows.com";

			var ntpData = new byte[48];

			ntpData[0] = 0x1B;

			var addresses = Dns.GetHostEntry(ntpServer).AddressList;

			var ipEndPoint = new IPEndPoint(addresses[0], 123);

			using (var socket = new  Socket(AddressFamily.InterNetwork, SocketType.Dgram, ProtocolType.Udp))
            {
                try
                {
					socket.Connect(ipEndPoint);

					socket.ReceiveTimeout = 3000;

					socket.Send(ntpData);
					socket.Receive(ntpData);
					socket.Close();
				}
				catch(Exception ex)
                {
					Debug.WriteLine(ex.Message);
                }
            }

			const byte serverReplyTime = 40;

			ulong intPart = BitConverter.ToUInt32(ntpData, serverReplyTime);

			ulong fractPart = BitConverter.ToUInt32(ntpData, serverReplyTime + 4);

			intPart = SwapEndianness(intPart);
			fractPart = SwapEndianness(fractPart);

			var milliseconds = (intPart * 1000) + ((fractPart * 1000) / 0x100000000L);

			var networkDateTime = (new DateTime(1900, 1, 1, 0, 0, 0, DateTimeKind.Utc)).AddMilliseconds((long)milliseconds);

			return networkDateTime.ToLocalTime();
        }
		private static uint SwapEndianness(ulong x)
        {
			return (uint)	(((x & 0x000000ff) << 24) +
							((x & 0x0000ff00) << 8) +
							((x & 0x00ff0000) >> 8) +
							((x & 0xff000000) >> 24));
		}

		/// <summary>
		/// The base method that will be called on the TimerPlus class.
		/// </summary>
		private void Timer_Elapsed(object sender, ElapsedEventArgs e)
		{
            if (AutoReset)
            {
				_startTime = GetNetworkTime();
				_dueTime = GetNetworkTime().AddMilliseconds(Interval);
            }
			Debug.WriteLine("\nStart:" + _startTime);
			Debug.WriteLine("\nDue:" + _dueTime);
			Debug.WriteLine("\nDuration(MS): " + Duration);
			Debug.WriteLine("\n----------------------");
			Debug.WriteLine("OnTimerEvent - " + timerGameType.ToString());
			Debug.WriteLine("----------------------");
		}
	}
}
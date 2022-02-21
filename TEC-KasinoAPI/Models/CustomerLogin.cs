using System.ComponentModel.DataAnnotations;

namespace TEC_KasinoAPI.Models
{
	public class CustomerLogin
	{
		[Required]
		public string Email { get; set; }
		[Required]
		public string Password { get; set; }

		public CustomerLogin() { }
	}
}

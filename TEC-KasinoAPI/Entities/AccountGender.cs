using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace TEC_KasinoAPI.Models
{
	public class AccountGender
	{
		[Key]
		public int GenderID { get; set; }
		public string GenderName { get; set; }
	}
}

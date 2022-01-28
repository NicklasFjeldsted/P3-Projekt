using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TEC_KasinoAPI.Models
{
	public class AccountGender
	{
		[Key]
		public int GenderID { get; set; }
		public GenderName Gender { get; set; }
	}

	public enum GenderName
	{
		Male, Female
	}
}

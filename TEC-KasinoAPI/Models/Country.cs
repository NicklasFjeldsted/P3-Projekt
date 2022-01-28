using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TEC_KasinoAPI.Models
{
	public class Country
	{
		[Key]
		public int CountryID { get; set; }
		public Countries CountryName { get; set; }
	}

	public enum Countries { 
		Denmark, Sweden, Norway
	}
}

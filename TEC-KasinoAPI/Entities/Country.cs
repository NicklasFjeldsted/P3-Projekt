using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TEC_KasinoAPI.Models
{
	public class Country
	{
		[DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int CountryID { get; set; }
		public string CountryName { get; set; }
	}
}

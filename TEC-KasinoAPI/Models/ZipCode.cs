using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TEC_KasinoAPI.Models
{
	public class ZipCode
	{
		[Key, DatabaseGenerated(DatabaseGeneratedOption.None)]
		public int ZipCodeID { get; set; }
		public string ZipCodeName { get; set; }

		//[HiddenInput(DisplayValue = false)]
		//public virtual ICollection<Customer> Customers { get; set; }
	}
}

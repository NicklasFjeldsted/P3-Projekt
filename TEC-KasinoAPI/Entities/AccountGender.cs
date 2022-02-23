using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TEC_KasinoAPI.Models
{
	public class AccountGender
	{
		[Key]
		public int GenderID { get; set; }
		public string GenderName { get; set; }

		//[HiddenInput(DisplayValue = false)]
		//public virtual ICollection<Customer> Customers { get; set; }
	}
}

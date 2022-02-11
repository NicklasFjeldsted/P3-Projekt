﻿using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TEC_KasinoAPI.Models
{
	public class Country
	{
		[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int CountryID { get; set; }
		public string CountryName { get; set; }

		//[HiddenInput(DisplayValue = false)]
		//public virtual ICollection<Customer> Customers { get; set; }
	}
}

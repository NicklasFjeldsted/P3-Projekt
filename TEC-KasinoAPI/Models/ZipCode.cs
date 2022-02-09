﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TEC_KasinoAPI.Models
{
	public class ZipCode
	{
		[Key]
		public int ZipCodeID { get; set; }
		public string ZipCodeName { get; set; }

		public ICollection<Customer> Customers { get; set; }
	}
}
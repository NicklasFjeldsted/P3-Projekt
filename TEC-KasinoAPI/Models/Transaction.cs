﻿using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace TEC_KasinoAPI.Models
{
	public class Transaction
	{
		[Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
		public int TransactionID { get; set; }
		public AccountBalance Balance { get; set; }
		public DateTime TransactionDate { get; set; }
		public double Amount { get; set; }
		public double CurrentBalance { get; set; }
	}
}

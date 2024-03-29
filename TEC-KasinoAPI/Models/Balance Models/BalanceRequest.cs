﻿using System.ComponentModel.DataAnnotations;

namespace TEC_KasinoAPI.Models
{
    public class BalanceRequest
    {
        public BalanceRequest() { }

        public BalanceRequest(int customerID, double amount, bool isInternal)
        {
            CustomerID = customerID;
            Amount = amount;
            IsInternal = isInternal;
        }

        [Required]

        public int CustomerID { get; set; }
        [Required]
        public double Amount { get; set; }
        [Required]
        public bool IsInternal { get; set; }
    }
}

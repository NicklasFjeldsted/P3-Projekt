﻿using System.ComponentModel.DataAnnotations;

namespace TEC_KasinoAPI.Models
{
    public class AccountGender
    {
        [Key]
        public int GenderID { get; set; }
        public string GenderName { get; set; }
    }
}

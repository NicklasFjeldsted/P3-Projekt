using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;
using TEC_KasinoAPI.Entities;

namespace TEC_KasinoAPI.Models
{
    public class Customer
    {
        [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int CustomerID { get; set; }

        [Required]
        public string Email { get; set; }

        [JsonIgnore]
        [Required]
        public string Password { get; set; }

        [Required]
        public int? CountryID { get; set; }
        public Country Country { get; set; }

        [Required]
        public int PhoneNumber { get; set; }

        [Required]
        public string CPRNumber { get; set; }

        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }

        [Required]
        public string Address { get; set; }

        [Required]
        public int? ZipCodeID { get; set; }
        public ZipCode ZipCode { get; set; }

        public string Role { get; set; }


        [Required]
        public int? GenderID { get; set; }
        public AccountGender Gender { get; set; }

        public AccountBalance Acc_balance { get; set; }

        public DateTime RegisterDate { get; set; }

        [JsonIgnore]
        public List<RefreshToken> RefreshTokens { get; set; }

        public DateTime? Deactivated { get; set; }
        public bool IsActive => Deactivated == null;
        public string DeactivatedBy { get; set; }
    }

}

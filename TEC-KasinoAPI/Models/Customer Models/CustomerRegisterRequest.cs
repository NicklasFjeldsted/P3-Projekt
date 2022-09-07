using System.ComponentModel.DataAnnotations;

namespace TEC_KasinoAPI.Models
{
    public class CustomerRegisterRequest
    {
        [Required]
        public string Email { get; set; }
        [Required]
        public string Password { get; set; }
        [Required]
        public int CountryID { get; set; }
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
        public int ZipCodeID { get; set; }
        [Required]
        public int GenderID { get; set; }
    }
}

namespace TEC_KasinoAPI.Models
{
    public class UpdateRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
        public int CountryID { get; set; }
        public int PhoneNumber { get; set; }
        public string CPRNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public int ZipCodeID { get; set; }
        public int GenderID { get; set; }
    }
}

using System.Text.Json.Serialization;

namespace TEC_KasinoAPI.Models
{
    public class AuthenticateResponse
    {
        public int CustomerID { get; set; }
        public string Email { get; set; }
        public int PhoneNumber { get; set; }
        public string CPRNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public ZipCode ZipCode { get; set; }
        public AccountGender Gender { get; set; }
        public Country Country { get; set; }
        public string JwtToken { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }

        public AuthenticateResponse(Customer customer, string jwtToken, string refreshToken)
        {
            CustomerID = customer.CustomerID;
            FirstName = customer.FirstName;
            LastName = customer.LastName;
            CPRNumber = customer.CPRNumber;
            Email = customer.Email;
            Country = customer.Country;
            PhoneNumber = customer.PhoneNumber;
            Address = customer.Address;
            ZipCode = customer.ZipCode;
            Gender = customer.Gender;
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
        }
    }
}

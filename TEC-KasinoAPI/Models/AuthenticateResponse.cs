using System.Text.Json.Serialization;

namespace TEC_KasinoAPI.Models
{
    public class AuthenticateResponse
    {
        public int CustomerID { get; set; }
        public string Email { get; set; }
        public virtual Country Country { get; set; }
        public int PhoneNumber { get; set; }
        public string CPRNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public virtual ZipCode ZipCode { get; set; }
        public string JwtToken { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }

        public AuthenticateResponse(Customer customer, string jwtToken, string refreshToken)
        {
            CustomerID = customer.CustomerID;
            FirstName = customer.FirstName;
            LastName = customer.LastName;
            Email = customer.Email;
            Country = customer.Country;
            PhoneNumber = customer.PhoneNumber;
            Address = customer.Address;
            ZipCode = customer.ZipCode;
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
        }
    }
}

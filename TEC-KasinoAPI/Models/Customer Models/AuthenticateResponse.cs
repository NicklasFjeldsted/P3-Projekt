using System.Text.Json.Serialization;

namespace TEC_KasinoAPI.Models
{
    public class AuthenticateResponse
    {
        public int Id { get; set; }
        public string Email { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string JwtToken { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }

        public AuthenticateResponse(int id, string email, string firstName, string lastName, string jwtToken, string refreshToken)
        {
            Id = id;
            Email = email;
            FirstName = firstName;
            LastName = lastName;
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
        }
    }
}

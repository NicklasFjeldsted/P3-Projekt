using System.Text.Json.Serialization;

namespace TEC_KasinoAPI.Models
{
    public class AuthenticateResponse
    {
        public string JwtToken { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }

        public AuthenticateResponse(string jwtToken, string refreshToken)
        {
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
        }
    }
}

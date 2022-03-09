using System.Text.Json.Serialization;

namespace TEC_KasinoAPI.Models
{
    public class RefreshTokenResponse
    {
        public string JwtToken { get; set; }

        [JsonIgnore]
        public string RefreshToken { get; set; }

        public RefreshTokenResponse(string jwtToken, string refreshToken)
        {
            JwtToken = jwtToken;
            RefreshToken = refreshToken;
        }
    }
}

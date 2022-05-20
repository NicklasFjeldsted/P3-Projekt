using System.Text.Json.Serialization;

namespace TEC_KasinoAPI.Entities
{
    [Obsolete]
    public class User
    {
        public string Email { get; set; }

        [JsonIgnore]
        public string Password { get; set; }
        public int Country { get; set; }
        public int PhoneNumber { get; set; }
        public string CPRNumber { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Address { get; set; }
        public int ZipCode { get; set; }
        public int Gender { get; set; }
        public string Role { get; set; }

        [JsonIgnore]
        public List<RefreshToken> RefreshTokens { get; set; }
    }
}

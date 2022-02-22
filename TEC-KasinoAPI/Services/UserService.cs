using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TEC_KasinoAPI.Entities;
using TEC_KasinoAPI.Helpers;
using TEC_KasinoAPI.Models;
using BC = BCrypt.Net.BCrypt;

namespace TEC_KasinoAPI.Services
{
    // Define the UserService contract (interface)
    public interface IUserService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress);
        AuthenticateResponse RefreshToken(string token, string ipAddress);
        bool RevokeToken(string token, string ipAddress);
        IEnumerable<Customer> GetAll();
        Customer GetById(int id);
    }

    public class UserService : IUserService
    {
        private readonly DatabaseContext _context;
        private readonly AppSettings _appSettings;
        private readonly IMapper _mapper;

        public UserService(DatabaseContext context, IOptions<AppSettings> appSettings, IConfiguration configuration, IMapper mapper)
        {
            _appSettings = appSettings.Value;
            _context = context;
            _mapper = mapper;
        }

        public void Register([FromBody]RegisterRequest model)
        {
            if (_context.Customers.Any(x => x.Email == model.Email)) return;

            var customer = _mapper

            _context.Customers.Add(customer);
            _context.SaveChanges();
        }

        public AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
        {
            // Find the customer that has both email and password
            Customer customer = _context.Customers.SingleOrDefault(x => x.Email == model.Email);

            // Return false if no user was found with the email or if the password doesnt match
            if (customer == null || !BC.Verify(model.Password, customer.Password)) return null;

            // Authentication successful so generate jwt and refresh tokens
            string jwtToken = GenerateJWTToken(customer);
            RefreshToken refreshToken = GenerateRefreshToken(ipAddress);

            // Add the refresh token to the customer object
            customer.RefreshTokens.Add(refreshToken);

            // Save the changes to the database
            _context.Update(customer);
            _context.SaveChanges();

            // Return the the updated customer object with a new JWT Token and Refresh Token
            return new AuthenticateResponse(customer, jwtToken, refreshToken.Token);
        }

        /// <summary>
        /// Refresh the access token and refresh token.
        /// </summary>
        /// <param name="token"></param>
        /// <param name="ipAddress"></param>
        /// <returns><see cref="AuthenticateResponse"/>: returns the newly updated customer object, with the new access token and refresh token.</returns>
        public AuthenticateResponse RefreshToken(string token, string ipAddress)
        {
            // Find the customer that has the token parameter
            Customer customer = _context.Customers.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));

            // Return false if no user was found with the token
            if (customer == null) return null;

            // Get a reference to that token instance
            RefreshToken refreshToken = customer.RefreshTokens.Single(x => x.Token == token);

            // Return false if the token is not active
            if (!refreshToken.IsActive) return null;

            // Generate a new refresh token
            RefreshToken newRefreshToken = GenerateRefreshToken(ipAddress);

            // Revoke the old refresh token and set its properties
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            refreshToken.ReplacedByToken = newRefreshToken.Token;

            // Add the new refresh token to the list of refresh tokens for that user
            customer.RefreshTokens.Add(newRefreshToken);

            // Save the changes to the database
            _context.Update(customer);
            _context.SaveChanges();

            // Generate a new JWT Token
            string jwtToken = GenerateJWTToken(customer);

            // Return the the updated customer object with a new JWT Token and Refresh Token
            return new AuthenticateResponse(customer, jwtToken, newRefreshToken.Token);
        }

        /// <summary>
        /// Revokes <paramref name="token"/> from the customer.
        /// </summary>
        /// <param name="token"></param>
        /// <param name="ipAddress"></param>
        /// <returns><see cref="bool"/>: returns true if the revoke was successfull otherwise returns false.</returns>
        public bool RevokeToken(string token, string ipAddress)
        {
            // Find the user that has the token parameter.
            Customer user = _context.Customers.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));

            // Return false if no user was found with the token
            if(user == null) return false;

            // Get a reference to that token instance
            RefreshToken refreshToken = user.RefreshTokens.Single(x => x.Token == token);

            // Return false if the token is not active
            if (!refreshToken.IsActive) return false;

            // Revoke the token and set properties
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;

            // Save the changes to the database.
            _context.Update(user);
            _context.SaveChanges();

            return true;
        }

        public IEnumerable<Customer> GetAll()
        {
            return _context.Customers;
        }

        public Customer GetById(int id)
        {
            return _context.Customers.Find(id);
        }

        // Helper method
        private string GenerateJWTToken(Customer customer)
        {
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, customer.CustomerID.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // Helper method
        private RefreshToken GenerateRefreshToken(string ipAddress)
        {
            using (RandomNumberGenerator randomNumberGenerator = RandomNumberGenerator.Create())
            {
                byte[] randomBytes = new byte[64];
                randomNumberGenerator.GetBytes(randomBytes);
                return new RefreshToken
                {
                    Token = Convert.ToBase64String(randomBytes),
                    Expires = DateTime.UtcNow.AddDays(7),
                    Created = DateTime.UtcNow,
                    CreatedByIp = ipAddress
                };
            }
        }
    }
}

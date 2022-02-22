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
        private DatabaseContext _context;
        private readonly AppSettings _appSettings;

        public UserService(DatabaseContext context, IOptions<AppSettings> appSettings, IConfiguration configuration)
        {
            _appSettings = appSettings.Value;
            _context = context;
        }

        public AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
        {
            // Find the customer that has both email and password
            //////// Might not work because database passwords are hashed with SHA2_516 ////////
            Customer customer = _context.Customers.SingleOrDefault(x => x.Email == model.Email && x.Password == model.Password);

            // Return false if no user was found with the email and password
            if (customer == null) return null;

            // authentication successful so generate jwt and refresh tokens
            string jwtToken = GenerateJWTToken(customer);
            RefreshToken refreshToken = GenerateRefreshToken(ipAddress);

            // Add the refresh token to the user object
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
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, customer.CustomerID.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        // Helper method
        private RefreshToken GenerateRefreshToken(string ipAddress)
        {
            using (var randomNumberGenerator = RandomNumberGenerator.Create())
            {
                var randomBytes = new byte[64];
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

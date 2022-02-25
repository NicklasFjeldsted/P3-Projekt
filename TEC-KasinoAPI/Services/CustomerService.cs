using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using TEC_KasinoAPI.Entities;
using TEC_KasinoAPI.Helpers;
using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Data;
using BC = BCrypt.Net.BCrypt;

namespace TEC_KasinoAPI.Services
{
    // Define the UserService contract (interface)
    public interface ICustomerService
    {
        AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress);
        AuthenticateResponse RefreshToken(string token, string ipAddress);
        bool RevokeToken(string token, string ipAddress);
        IEnumerable<Customer> GetAll();
        Customer GetById(int id);
        void Register(CustomerRegisterRequest model);
        void Update(int customerID, CustomerUpdateRequest model);
        void Delete(int customerID);
    }

    public class CustomerService : ICustomerService
    {
        private readonly List<Customer> _customers;
        private readonly DatabaseContext _context;
        private readonly AppSettings _appSettings;
        private readonly IBalanceService _balanceService;
        private readonly IMapper _mapper;

        public CustomerService(DatabaseContext context, IOptions<AppSettings> appSettings, IMapper mapper, IBalanceService balanceService)
        {
            _appSettings = appSettings.Value;

            _context = context;

            // Set the _customers list equal to the database context of the Customers table.
            // While doing so make sure that the Country-, Zipcode-, and AccountGender table are also tracked.
            _customers = context.Customers
                .Include(e => e.Country)
                .Include(e => e.ZipCode)
                .Include(e => e.Gender)
                .ToList();

            _mapper = mapper;

            _balanceService = balanceService;
        }

        /// <summary>
        /// Register a new customer to the database
        /// </summary>
        /// <param name="model"></param>
        /// <exception cref="AppException"></exception>
        public void Register([FromBody]CustomerRegisterRequest model)
        {
            // Check if the Email is already in use
            if (_customers.Any(x => x.Email == model.Email))
            {
                // Throw an Application specific exception if the email is taken
                throw new AppException("Email '" + model.Email + "' is already taken.");
            }

            // Map the model to a new customer object
            Customer customer = _mapper.Map<Customer>(model);

            // Hash the password from the model and insert the hashed password into the customer object
            customer.Password = BC.HashPassword(model.Password);

            // Add the new customer to the entity
            _context.Customers.Add(customer);

            // Save changes to the database
            _context.SaveChanges();

            // Create an account balance for the newly registered customer
            _balanceService.Create(customer.CustomerID);
        }

        /// <summary>
        /// Update a customer's data
        /// </summary>
        /// <param name="customerid"></param>
        /// <param name="model"></param>
        /// <exception cref="AppException"></exception>
        public void Update(int customerID, CustomerUpdateRequest model)
        {
            // Find the customer with the customerID paramter
            Customer customer = GetById(customerID);

            // Check if the Email is already in use
            if (model.Email != customer.Email && _customers.Any(x => x.Email == model.Email))
            {
                // Throw an Application specific exception if the email is taken
                throw new AppException("Email '" + model.Email + "' is already taken.");
            }

            // Check if the Password is null or empty 
            // I.E. If the Password was entered into the model
            if(!string.IsNullOrEmpty(model.Password))
            {
                // Hash the password from the model and insert the hashed password into the customer object
                customer.Password = BC.HashPassword(model.Password);
            }

            // Map the model parameter to the customer object
            _mapper.Map(model, customer);

            // Update the customers entity with the changes
            _context.Customers.Update(customer);

            // Save the changes to the database
            _context.SaveChanges();
        }

        /// <summary>
        /// Delete a customer from the database
        /// </summary>
        /// <param name="customerID"></param>
        public void Delete(int customerID)
        {
            // Find the customer with the customerID paramter.
            Customer customer = GetById(customerID);

            // Delete the account balance associated with the customer.
            _balanceService.Delete(customerID);

            // Remove the customer object from the customer entity.
            _context.Customers.Remove(customer);

            // Save the changes to the database.
            _context.SaveChanges();
        }

        /// <summary>
        /// Authenticate a customer's credentials
        /// </summary>
        /// <param name="model"></param>
        /// <param name="ipAddress"></param>
        /// <returns><see cref="AuthenticateResponse"/>: returns the customer object, a new Json Web Token (JWT), and a new refresh token</returns>
        public AuthenticateResponse Authenticate(AuthenticateRequest model, string ipAddress)
        {
            // Find the customer that has both email and password.
            Customer customer = _customers.SingleOrDefault(x => x.Email == model.Email);

            // Return false if no user was found with the email or if the password doesnt match.
            if (customer == null || !BC.Verify(model.Password, customer.Password)) return null;
            
            // Authentication successful so generate jwt and refresh tokens.
            string jwtToken = GenerateJWTToken(customer);
            RefreshToken refreshToken = GenerateRefreshToken(ipAddress);

            // Add the refresh token to the customer object.
            customer.RefreshTokens.Add(refreshToken);

            // Save the changes to the database.
            _context.Update(customer);
            _context.SaveChanges();

            // Return the the updated customer object with a new JWT Token and Refresh Token.
            return new AuthenticateResponse(jwtToken, refreshToken.Token);
        }

        /// <summary>
        /// Refresh the access token and refresh token.
        /// </summary>
        /// <param name="token"></param>
        /// <param name="ipAddress"></param>
        /// <returns><see cref="AuthenticateResponse"/>: returns the newly updated customer object, with the new access token and refresh token.</returns>
        public AuthenticateResponse RefreshToken(string token, string ipAddress)
        {
            // Find the customer that has the token parameter.
            Customer customer = _customers.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));

            // Return null if no user was found with the token.
            if (customer == null) return null;

            // Get a reference to that token instance.
            RefreshToken refreshToken = customer.RefreshTokens.Single(x => x.Token == token);

            // Return null if the token is not active.
            if (!refreshToken.IsActive) return null;

            // Generate a new refresh token.
            RefreshToken newRefreshToken = GenerateRefreshToken(ipAddress);

            // Revoke the old refresh token and set its properties.
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;
            refreshToken.ReplacedByToken = newRefreshToken.Token;

            // Add the new refresh token to the list of refresh tokens for that user.
            customer.RefreshTokens.Add(newRefreshToken);

            // Update the database about the new changes surrounding the customer object.
            _context.Update(customer);

            // Save the changes to the database.
            _context.SaveChanges();

            // Generate a new JWT Token.
            string jwtToken = GenerateJWTToken(customer);

            // Return the the updated customer object with a new JWT Token and Refresh Token.
            return new AuthenticateResponse(jwtToken, newRefreshToken.Token);
        }

        /// <summary>
        /// Revokes <paramref name="token"/> from the customer.
        /// </summary>
        /// <param name="token"></param>
        /// <param name="ipAddress"></param>
        /// <returns><see cref="bool"/>: returns true if the revoke was successfull otherwise returns false.</returns>
        public bool RevokeToken(string token, string ipAddress)
        {
            // Find the customer that has the token parameter.
            Customer customer = _customers.SingleOrDefault(u => u.RefreshTokens.Any(t => t.Token == token));

            // Return false if no customer was found with the token.
            if(customer == null) return false;

            // Get a reference to that token instance.
            RefreshToken refreshToken = customer.RefreshTokens.Single(x => x.Token == token);

            // Return false if the token is not active.
            if (!refreshToken.IsActive) return false;

            // Revoke the token and set properties.
            refreshToken.Revoked = DateTime.UtcNow;
            refreshToken.RevokedByIp = ipAddress;

            // Update the database about the changes surrounding the customer object.
            _context.Update(customer);

            // Save the changes to the database.
            _context.SaveChanges();

            return true;
        }

        /// <summary>
        /// Gets all customers in the database
        /// </summary>
        /// <returns><see cref="IEnumerable{T}"/> of type <see cref="Customer"/></returns>
        public IEnumerable<Customer> GetAll()
        {
            return _customers;
        }

        /// <summary>
        /// Gets the customer with the <paramref name="id"/> from the database
        /// </summary>
        /// <param name="id"></param>
        /// <returns><see cref="Customer"/>: returns the customer with the <paramref name="id"/></returns>
        /// <exception cref="KeyNotFoundException"></exception>
        public Customer GetById(int id)
        {
            Customer customer = _context.Customers.Find(id);
            if (customer == null) throw new KeyNotFoundException("Customer not found.");
            return customer;
        }

        /// <summary>
        /// Genereates a Jason Web Token (JWT)
        /// </summary>
        /// <param name="customer"></param>
        /// <returns><see cref="string"/>: returns a newly generated Jason Web Token (JWT)</returns>
        private string GenerateJWTToken(Customer customer)
        {
            JwtSecurityTokenHandler tokenHandler = new JwtSecurityTokenHandler();
            byte[] key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            SecurityTokenDescriptor tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, customer.CustomerID.ToString()),
                    new Claim(ClaimTypes.Email, customer.Email),
                    new Claim(ClaimTypes.GivenName, customer.FirstName),
                    new Claim(ClaimTypes.MobilePhone, customer.PhoneNumber.ToString())
                }),
                Expires = DateTime.UtcNow.AddMinutes(15),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            SecurityToken token = tokenHandler.CreateToken(tokenDescriptor);
            return tokenHandler.WriteToken(token);
        }

        /// <summary>
        /// Generate a new refresh token
        /// </summary>
        /// <param name="ipAddress"></param>
        /// <returns><see cref="TEC_KasinoAPI.Entities.RefreshToken"/>: returns the newly generated refresh token</returns>
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

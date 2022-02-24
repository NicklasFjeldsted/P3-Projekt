using TEC_KasinoAPI.Models;
using TEC_KasinoAPI.Data;
using TEC_KasinoAPI.Helpers;
using AutoMapper;
using Microsoft.Extensions.Options;

namespace TEC_KasinoAPI.Services
{
    public interface IBalanceService
    {
        void Create(int customerID);
        void Delete(int customerID);
        void Update(int customerID, BalanceUpdateRequest model);
        BalanceResponse AddBalance(BalanceRequest model);
        BalanceResponse SubtractBalance(BalanceRequest model);
        AccountBalance GetById(int customerID);
    }

    public class BalanceService : IBalanceService
    {
        private readonly DatabaseContext _context;
        private readonly AppSettings _appSettings;
        private readonly IMapper _mapper;

        public BalanceService(DatabaseContext context, IOptions<AppSettings> appSettings, IMapper mapper)
        {
            _appSettings = appSettings.Value;

            _context = context;

            _mapper = mapper;
        }

        /// <summary>
        /// Create a new account balance and assign it to the customer with <paramref name="customerID"/>.
        /// </summary>
        /// <param name="customerID"></param>
        /// <exception cref="AppException"></exception>
        public void Create(int customerID)
        {
            // Check if there already exists an account balance with the customerID parameter.
            if(_context.AccountBalances.Any(x => x.CustomerID == customerID))
            {
                throw new AppException("Customer already have an account balance.");
            }

            // Add the new account balance to the database context.
            _context.AccountBalances.Add(new AccountBalance { CustomerID = customerID });

            // Save the changes to the database.
            _context.SaveChanges();
        }

        /// <summary>
        /// Delete an account balance with the <paramref name="customerID"/>.
        /// </summary>
        /// <param name="customerID"></param>
        public void Delete(int customerID)
        {
            // Get the account balance with the customerID parameter.
            AccountBalance accountBalance = GetById(customerID);

            // Remove that account balance from the database.
            _context.AccountBalances.Remove(accountBalance);

            // Save the changes to the database.
            _context.SaveChanges();
        }

        /// <summary>
        /// Update an account balance with the <paramref name="customerID"/> with the values of the <paramref name="model"/>.
        /// </summary>
        /// <param name="customerID"></param>
        /// <param name="model"></param>
        /// <exception cref="AppException"></exception>
        public void Update(int customerID, BalanceUpdateRequest model)
        {
            // Get the account balance with the customerID parameter.
            AccountBalance accountBalance = GetById(customerID);

            // Check if the CustomerID is already in use.
            if (model.CustomerID != customerID && _context.AccountBalances.Any(x => x.CustomerID == customerID))
            {
                // Throw an Application specific exception if the email is taken.
                throw new AppException("an account balance with the id: " + model.CustomerID + " already exists.");
            }

            // Map the model parameter to the accountBalance object.
            _mapper.Map(model, accountBalance);

            // Update the AccountBalance entity about the changes.
            _context.AccountBalances.Update(accountBalance);

            // Save the changes to the database.
            _context.SaveChanges();
        }

        /// <summary>
        /// Add the <paramref name="model"/>'s Amount property to the account balance with the <paramref name="model"/>'s CustomerID property.
        /// </summary>
        /// <param name="model"></param>
        /// <returns><see cref="BalanceResponse"/>: returns the CustomerID, DepositLimit, and new Balance of the customer.</returns>
        public BalanceResponse AddBalance(BalanceRequest model)
        {
            // Find the account balance with the model.CustomerID parameter.
            AccountBalance accountBalance = _context.AccountBalances.SingleOrDefault(x => x.CustomerID == model.CustomerID);

            // Returns null if the accountBalance wasnt found I.E. it doesnt exist.
            if (accountBalance == null) return null;

            // Add the amount from the model parameter to the account balance.
            accountBalance.Balance += model.Amount;

            // Make the difference string.
            string difference = "+" + model.Amount;

            // Update the AccountBalance entity with the changes from the accountBalance object.
            _context.AccountBalances.Update(accountBalance);

            // Save the changes to the database.
            _context.SaveChanges();

            // Map the accountBalance object to the BalanceResponse model and return it.
            return _mapper.Map(accountBalance, new BalanceResponse(difference));
        }

        /// <summary>
        /// Subtract the <paramref name="model"/>'s Amount property to the account balance with the <paramref name="model"/>'s CustomerID property.
        /// </summary>
        /// <param name="model"></param>
        /// <returns><see cref="BalanceResponse"/>: returns the CustomerID, DepositLimit, and new Balance of the customer.</returns>
        public BalanceResponse SubtractBalance(BalanceRequest model)
        {
            // Find the account balance with the model.CustomerID parameter.
            AccountBalance accountBalance = _context.AccountBalances.SingleOrDefault(x => x.CustomerID == model.CustomerID);

            // Returns null if the accountBalance wasnt found I.E. it doesnt exist.
            if (accountBalance == null) return null;

            // Subtract the amount from the model parameter from the account balance.
            accountBalance.Balance -= model.Amount;

            // Make the difference string.
            string difference = "+" + model.Amount;

            // Update the AccountBalance entity with the changes from the accountBalance object.
            _context.AccountBalances.Update(accountBalance);

            // Save the changes to the database.
            _context.SaveChanges();

            // Map the accountBalance object to the BalanceResponse model and return it.
            return _mapper.Map(accountBalance, new BalanceResponse(difference));
        }

        /// <summary>
        /// Find the account balance with the <paramref name="customerID"/> argument.
        /// </summary>
        /// <param name="customerID"></param>
        /// <returns><see cref="AccountBalance"/>: returns the account balance associated with the <paramref name="customerID"/>.</returns>
        /// <exception cref="KeyNotFoundException"></exception>
        public AccountBalance GetById(int customerID)
        {
            AccountBalance accountBalance = _context.AccountBalances.Find(customerID);
            if (accountBalance == null) throw new KeyNotFoundException("Account balance not found.");
            return accountBalance;
        }
    }
}

﻿using TEC_KasinoAPI.Data;
using TEC_KasinoAPI.Helpers;
using TEC_KasinoAPI.Models;

namespace TEC_KasinoAPI.Services
{
	public interface ITransactionService
	{
		Task AddTransaction(BalanceResponse model);
		Task<List<Transaction>> GetByIdAsync(int customerID);
	}

	public class TransactionService : ITransactionService
	{
		private readonly DatabaseContext _context;

		public TransactionService(DatabaseContext context)
		{
			_context = context;
		}

		/// <summary>
		/// Creates a transaction to the associated customer ID
		/// </summary>
		/// <param name="model"></param>
		/// <exception cref="AppException"></exception>
		public async Task AddTransaction(BalanceResponse model)
		{
			// Adds the transaction to database context
			await _context.Transactions.AddAsync(new Transaction
			{
				CustomerID = model.CustomerID,
				Amount = model.Difference,
				CurrentBalance = model.Balance,
				TransactionDate = DateTime.Now,
			});

			// Save the changes to the database
			await _context.SaveChangesAsync();
		}

		/// <summary>
		/// Gets all transactions from the associated customer ID
		/// </summary>
		/// <param name="customerID"></param>
		/// <exception cref="KeyNotFoundException"></exception>
		public async Task<List<Transaction>> GetByIdAsync(int customerID)
		{
			// Checks if theres any transactions existing with the associated id
			if (await _context.Transactions.AnyAsync(x => x.CustomerID != customerID))
			{
				throw new KeyNotFoundException("No transactions found");
			}

			List<Transaction> transactions = await _context.Transactions.Where(x => x.CustomerID == customerID).ToListAsync();

			return transactions;
		}
	}
}

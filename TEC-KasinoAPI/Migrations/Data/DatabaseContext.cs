using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using TEC_KasinoAPI.Entities;
using TEC_KasinoAPI.Models;

namespace TEC_KasinoAPI.Data
{
	public class DatabaseContext : DbContext
	{
		public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { } // Constructor

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }

		// Models converted to tables that need to be implemented into the database.

		public DbSet<Customer> Customers { get; set; }
		public DbSet<AccountBalance> AccountBalances { get; set; }
		public DbSet<Transaction> Transactions { get; set; }
		public DbSet<AccountGender> AccountGenders { get; set; }
		public DbSet<Country> Countries { get; set; }

		protected override void OnModelCreating(ModelBuilder builder)
		{
			// Property Configurations
			builder.Entity<Customer>(entity => // Configures a model 
			{
				// Create unique indexes for columns
				entity.HasAlternateKey(e => e.Email).HasName("UN_Customers_Email");
				entity.HasAlternateKey(e => e.PhoneNumber).HasName("UN_Customers_PhoneNumber");
				entity.HasAlternateKey(e => e.CPRNumber).HasName("UN_Customers_CPRNumber");
				entity.Property(e => e.RegisterDate).HasDefaultValueSql("getdate()"); // Sets RegisterDate default value to SqlCommand 'GetDate()'
			});

			builder.Entity<AccountBalance>(entity =>
			{
				entity.Property(e => e.Balance).HasDefaultValueSql("0");
				entity.Property(e => e.DepositLimit).HasDefaultValueSql("1000");
			});

			builder.Entity<Country>(e => // Same applies here
			{ 
				e.HasAlternateKey(e => e.CountryName).HasName("UN_Countries_CountryName");
			});
		}
	}
}

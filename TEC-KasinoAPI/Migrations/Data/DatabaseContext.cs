using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using TEC_KasinoAPI.Models;


namespace TEC_KasinoAPI.Data
{
	public class DatabaseContext : DbContext
	{

		public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options) { } // Constructor

		protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder) { }

		// Models converted to tables that need to be implemented into the database

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
				entity.HasIndex(e => e.Email).IsUnique();
				entity.HasIndex(e => e.PhoneNumber).IsUnique();
				entity.HasIndex(e => e.CPRNumber).IsUnique();
				entity.HasOne(e => e.Acc_balance).WithOne(e => e.Customer).HasForeignKey<AccountBalance>(e => e.CustomerID); // Configures a one to one relationship between AccBalanace and Customer
				entity.Property(e => e.RegisterDate).HasDefaultValueSql("getdate()"); // Sets RegisterDate default value to SqlCommand 'GetDate()'
			});

			builder.Entity<AccountBalance>() // Configures relationship so that AccountBalance has many transactions but Transactions only has one balance
				.HasMany(c => c.Transactions)
				.WithOne(e => e.Balance);

			builder.Entity<AccountGender>() // Configures relationship so that AccountGender has many customers but a customer can only have one AccountGender
				.HasMany(e => e.Customers)
				.WithOne(e => e.Gender);

			builder.Entity<Country>() // Same applies here
				.HasMany(e => e.Customers)
				.WithOne(e => e.Country);

			builder.Entity<ZipCode>() // Same applies here
			.HasMany(e => e.Customers)
			.WithOne(e => e.ZipCode);
		}
	}
}

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
				entity.HasAlternateKey(e => e.Email).HasName("UN_Customers_Email");
				entity.HasAlternateKey(e => e.PhoneNumber).HasName("UN_Customers_PhoneNumber");
				entity.HasAlternateKey(e => e.CPRNumber).HasName("UN_Customers_CPRNumber");
				entity.HasOne(e => e.Acc_balance).WithOne(e => e.Customer).HasForeignKey<AccountBalance>(e => e.CustomerID); // Configures a one to one relationship between AccBalanace and Customer
				entity.Property(e => e.RegisterDate).HasDefaultValueSql("getdate()"); // Sets RegisterDate default value to SqlCommand 'GetDate()'
			});

			builder.Entity<AccountBalance>(entity =>
			{
				entity.HasMany(e => e.Transactions).WithOne(e => e.Balance); // Configures relationship so that AccountBalance has many transactions but Transactions only has one balance
				entity.Property(e => e.Balance).HasDefaultValueSql("0");
				entity.Property(e => e.DepositLimit).HasDefaultValueSql("1000");
			});

			builder.Entity<AccountGender>() // Configures relationship so that AccountGender has many customers but a customer can only have one AccountGender
				.HasMany(e => e.Customers)
				.WithOne(e => e.Gender);

			builder.Entity<Country>(e => // Same applies here
			{ 
				e.HasMany(e => e.Customers).WithOne(e => e.Country);
				e.HasAlternateKey(e => e.CountryName).HasName("UN_Countries_CountryName");
			});

			builder.Entity<ZipCode>() // Same applies here
			.HasMany(e => e.Customers)
			.WithOne(e => e.ZipCode);
		}
	}
}

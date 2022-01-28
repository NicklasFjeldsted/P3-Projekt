using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using TEC_KasinoAPI.Models;


namespace TEC_KasinoAPI.Data
{
	public class DataContext : DbContext
	{
		public DataContext(DbContextOptions<DataContext> options) : base(options) { }
		
		protected override void DbCo

		protected override void OnModelCreating(ModelBuilder builder)
		{
			builder.Entity<Customer>(entity => {
				entity.ToTable("Customer");
				entity.HasKey(e => e.CustomerID);
				entity.Property(e => e.CustomerID).HasColumnName("Customer_ID");
				entity.HasIndex(e => new { e.Email, e.PhoneNumber, e.CPRNumber});
			});

			builder.Entity<AccountBalance>(entity => {
				entity.ToTable("Account_balance");
			});

			builder.Entity<Transaction>(entity => {
				entity.ToTable("Transaction");
				entity.Property(e => e.TransactionDate).HasDefaultValueSql("GetDate()");
			});

			builder.Entity<AccountGender>(entity => {
				entity.ToTable("Account_gender");
			});

			builder.Entity<Country>();
		}
	}
}

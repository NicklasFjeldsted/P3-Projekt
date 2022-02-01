﻿// <auto-generated />
using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using TEC_KasinoAPI.Data;

#nullable disable

namespace TEC_KasinoAPI.Migrations
{
    [DbContext(typeof(DatabaseContext))]
    partial class DatabaseContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.1")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("TEC_KasinoAPI.Models.AccountBalance", b =>
                {
                    b.Property<int>("BalanceID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("BalanceID"), 1L, 1);

                    b.Property<double>("Balance")
                        .HasColumnType("float");

                    b.Property<int>("CustomerID")
                        .HasColumnType("int");

                    b.HasKey("BalanceID");

                    b.HasIndex("CustomerID")
                        .IsUnique();

                    b.ToTable("AccountBalances");
                });

            modelBuilder.Entity("TEC_KasinoAPI.Models.AccountGender", b =>
                {
                    b.Property<int>("GenderID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("GenderID"), 1L, 1);

                    b.Property<string>("GenderName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("GenderID");

                    b.ToTable("AccountGenders");
                });

            modelBuilder.Entity("TEC_KasinoAPI.Models.Country", b =>
                {
                    b.Property<int>("CountryID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CountryID"), 1L, 1);

                    b.Property<string>("CountryName")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("CountryID");

                    b.ToTable("Countries");
                });

            modelBuilder.Entity("TEC_KasinoAPI.Models.Customer", b =>
                {
                    b.Property<int>("CustomerID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("CustomerID"), 1L, 1);

                    b.Property<string>("Address")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("CPRNumber")
                        .HasMaxLength(10)
                        .HasColumnType("int");

                    b.Property<string>("City")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("CountryID")
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasColumnType("nvarchar(450)");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("GenderID")
                        .HasColumnType("int");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PhoneNumber")
                        .HasMaxLength(8)
                        .HasColumnType("int");

                    b.Property<int>("PostCode")
                        .HasColumnType("int");

                    b.Property<DateTime>("RegisterDate")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("datetime2")
                        .HasDefaultValueSql("getdate()");

                    b.HasKey("CustomerID");

                    b.HasIndex("CountryID");

                    b.HasIndex("GenderID");

                    b.HasIndex("Email", "PhoneNumber", "CPRNumber")
                        .IsUnique();

                    b.ToTable("Customers");
                });

            modelBuilder.Entity("TEC_KasinoAPI.Models.Transaction", b =>
                {
                    b.Property<int>("TransactionID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("TransactionID"), 1L, 1);

                    b.Property<double>("Amount")
                        .HasColumnType("float");

                    b.Property<int?>("BalanceID")
                        .HasColumnType("int");

                    b.Property<double>("CurrentBalance")
                        .HasColumnType("float");

                    b.Property<DateTime>("TransactionDate")
                        .HasColumnType("datetime2");

                    b.HasKey("TransactionID");

                    b.HasIndex("BalanceID");

                    b.ToTable("Transactions");
                });

            modelBuilder.Entity("TEC_KasinoAPI.Models.AccountBalance", b =>
                {
                    b.HasOne("TEC_KasinoAPI.Models.Customer", "Customer")
                        .WithOne("Acc_balance")
                        .HasForeignKey("TEC_KasinoAPI.Models.AccountBalance", "CustomerID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Customer");
                });

            modelBuilder.Entity("TEC_KasinoAPI.Models.Customer", b =>
                {
                    b.HasOne("TEC_KasinoAPI.Models.Country", "Country")
                        .WithMany("Customers")
                        .HasForeignKey("CountryID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("TEC_KasinoAPI.Models.AccountGender", "Gender")
                        .WithMany("Customers")
                        .HasForeignKey("GenderID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Country");

                    b.Navigation("Gender");
                });

            modelBuilder.Entity("TEC_KasinoAPI.Models.Transaction", b =>
                {
                    b.HasOne("TEC_KasinoAPI.Models.AccountBalance", "Balance")
                        .WithMany("Transactions")
                        .HasForeignKey("BalanceID");

                    b.Navigation("Balance");
                });

            modelBuilder.Entity("TEC_KasinoAPI.Models.AccountBalance", b =>
                {
                    b.Navigation("Transactions");
                });

            modelBuilder.Entity("TEC_KasinoAPI.Models.AccountGender", b =>
                {
                    b.Navigation("Customers");
                });

            modelBuilder.Entity("TEC_KasinoAPI.Models.Country", b =>
                {
                    b.Navigation("Customers");
                });

            modelBuilder.Entity("TEC_KasinoAPI.Models.Customer", b =>
                {
                    b.Navigation("Acc_balance");
                });
#pragma warning restore 612, 618
        }
    }
}

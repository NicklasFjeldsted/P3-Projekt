using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Data.SqlClient;
using System.Data;

namespace AdministratorProgram
{
    internal static class DatabaseHandler
    {
        public static readonly string CONN_STRING = @"Data Source=10.0.6.2;Initial Catalog=TEC-KasinoDB;Persist Security Info=True;User ID=sa;Password=1234";

        public static CustomerDataObject Search(string email)
        {
            if (string.IsNullOrEmpty(email)) return null;

            CustomerDataObject customer = new CustomerDataObject();
            SqlConnection conn = new SqlConnection(CONN_STRING);
            SqlDataReader reader;

            using(conn)
            {
                SqlCommand cmd = new SqlCommand("sp_email_search", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@Email", email);

                conn.Open();

                reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    customer.CustomerID = (int)reader["CustomerID"];
                    customer.Email = reader["email"].ToString();
                    customer.CountryID = (int)reader["CountryID"];
                    customer.CountryName = reader["CountryName"].ToString();
                    customer.PhoneNumber = (int)reader["PhoneNumber"];
                    customer.CPR = reader["CPRNumber"].ToString();
                    customer.Firstname = reader["FirstName"].ToString();
                    customer.Lastname = reader["LastName"].ToString();
                    customer.Address = reader["Address"].ToString();
                    customer.ZipCode = (int)reader["ZipCodeID"];
                    customer.City = reader["ZipCodeName"].ToString();
                    customer.GenderID = (int)reader["GenderID"];
                    customer.GenderName = reader["GenderName"].ToString();
                    customer.RegisterDate = reader["RegisterDate"].ToString();
                    customer.BalanceID = (int)reader["BalanceID"];
                    customer.Balance = (double)reader["Balance"];
                    customer.DepositLimit = (int)reader["DepositLimit"];
                }

                conn.Close();
            }

            return customer;
        }

        public static DataSet FetchTransactions(int balanceID)
        {
            if (balanceID < 1) return null;

            SqlConnection conn = new SqlConnection(CONN_STRING);
            SqlDataAdapter dataAdapter;
            using(conn)
            {
                SqlCommand cmd = new SqlCommand("SELECT * FROM Transactions WHERE BalanceID = @ID",conn);
                cmd.Parameters.AddWithValue("@ID", balanceID);
                conn.Open();

                dataAdapter = new SqlDataAdapter(cmd);

                DataSet ds = new DataSet();
                dataAdapter.Fill(ds);

                conn.Close();

                return ds;
            }
        }

        public static double AddBalance(double amount, int balanceID)
        {
            CustomerDataObject customer = new CustomerDataObject();
            SqlConnection conn = new SqlConnection(CONN_STRING);

            using (conn)
            {
                SqlCommand cmd = new SqlCommand("sp_balance_add", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@InputValue", amount);
                cmd.Parameters.AddWithValue("@BalanceID", balanceID);
                cmd.Parameters.Add("@Balance", SqlDbType.Float).Direction = ParameterDirection.Output;

                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();
                return (double)cmd.Parameters["@Balance"].Value;
            }
        }

        public static double SubtractBalance(double amount, int balanceID)
        {
            CustomerDataObject customer = new CustomerDataObject();
            SqlConnection conn = new SqlConnection(CONN_STRING);

            using (conn)
            {
                SqlCommand cmd = new SqlCommand("sp_balance_subtract", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@InputValue", amount);
                cmd.Parameters.AddWithValue("@BalanceID", balanceID);
                cmd.Parameters.Add("@Balance", SqlDbType.Float).Direction = ParameterDirection.Output;

                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();
                return (double)cmd.Parameters["@Balance"].Value;
            }
        }

        public static void SaveDepositLimit(int amount, int balanceID)
        {
            CustomerDataObject customer = new CustomerDataObject();
            SqlConnection conn = new SqlConnection(CONN_STRING);

            using (conn)
            {
                SqlCommand cmd = new SqlCommand("sp_save_deposit_limit", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@NewLimit", amount);
                cmd.Parameters.AddWithValue("@BalanceID", balanceID);

                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }

        public static void SaveAll(CustomerDataObject newCustomerObject)
        {
            CustomerDataObject customer = new CustomerDataObject();
            SqlConnection conn = new SqlConnection(CONN_STRING);

            using (conn)
            {
                SqlCommand cmd = new SqlCommand("sp_save_all", conn);
                cmd.CommandType = CommandType.StoredProcedure;

                cmd.Parameters.AddWithValue("@CustomerID", newCustomerObject.CustomerID);
                cmd.Parameters.AddWithValue("@Email", newCustomerObject.Email);
                cmd.Parameters.AddWithValue("@CountryName", newCustomerObject.CountryName);
                cmd.Parameters.AddWithValue("@PhoneNumber", newCustomerObject.PhoneNumber);
                cmd.Parameters.AddWithValue("@CPRNumber", newCustomerObject.CPR);
                cmd.Parameters.AddWithValue("@FirstName", newCustomerObject.Firstname);
                cmd.Parameters.AddWithValue("@LastName", newCustomerObject.Lastname);
                cmd.Parameters.AddWithValue("@Address", newCustomerObject.Address);
                cmd.Parameters.AddWithValue("@ZipCodeID", newCustomerObject.ZipCode);
                cmd.Parameters.AddWithValue("@GenderName", newCustomerObject.GenderName);
                cmd.Parameters.AddWithValue("@Balance", newCustomerObject.Balance);

                conn.Open();
                cmd.ExecuteNonQuery();
                conn.Close();
            }
        }
    }
}

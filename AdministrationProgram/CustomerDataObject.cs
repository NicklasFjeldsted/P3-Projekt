using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AdministratorProgram
{
    public class CustomerDataObject
    {
        public CustomerDataObject() { }
        public CustomerDataObject(CustomerDataObject customerData)
        {
            this.CustomerID = customerData.CustomerID;
            this.Email = customerData.Email;
            this.CountryID = customerData.CountryID;
            this.RegisterDate = customerData.RegisterDate;
            this.PhoneNumber = customerData.PhoneNumber;
            this.City = customerData.City;
            this.Address = customerData.Address;
            this.Balance = customerData.Balance;
            this.BalanceID = customerData.BalanceID;
            this.Firstname = customerData.Firstname;
            this.Lastname = customerData.Lastname;
            this.CPR = customerData.CPR;
            this.DepositLimit = customerData.DepositLimit;
            this.ZipCode = customerData.ZipCode;
            this.GenderID = customerData.GenderID;
            this.GenderName = customerData.GenderName;
            this.CountryName = customerData.CountryName;
        }

        public int CustomerID { get; set; }
        public string Email { get; set; }
        public int CountryID { get; set; }
        public string CountryName { get; set; }
        public int PhoneNumber { get; set; }
        public string CPR { get; set; }
        public string Firstname { get; set; }
        public string Lastname { get; set; }
        public string Address { get; set; }
        public int ZipCode { get; set; }
        public string City { get; set; }
        public int GenderID { get; set; }
        public string GenderName { get; set; }
        public string RegisterDate { get; set; }
        public int BalanceID { get; set; }
        public double Balance { get; set; }
        public int DepositLimit { get; set; }
        public string Fullname { get { return Firstname + " " + Lastname; } }
    }
}
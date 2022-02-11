using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using System.Data.SqlClient;
using System.Data;
using System.Text.RegularExpressions;

namespace AdministratorProgram
{
    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        private CustomerDataObject originalCustomerObject;
        public static CustomerDataObject currentCustomer = new CustomerDataObject();
        private static readonly Regex _regex = new Regex("[0-9.]+");
        public static bool IsTextAllowed(string text)
        {
            return _regex.IsMatch(text);
        }

        public MainWindow()
        {
            InitializeComponent();
        }

        private void openTransactions_Click(object sender, RoutedEventArgs e)
        {
            Transaktioner transaktioner = new Transaktioner();
            transaktioner.Show();
        }

        private void SetCustomerObjects(CustomerDataObject customer)
        {
            originalCustomerObject = new CustomerDataObject(customer);

            currentCustomer = new CustomerDataObject(customer);

            RefreshWindow(currentCustomer);
        }

        public void RefreshWindow(CustomerDataObject customer)
        {
            emailBox.Text = customer.Email.ToString();
            landBox.Text = customer.CountryName.ToString();
            phoneBox.Text = customer.PhoneNumber.ToString();
            balanceBox.Text = customer.Balance + " kr.";
            limitBox.Text = customer.DepositLimit.ToString();
            amountBox.Text = "";
        }

        private void searchButton_Click(object sender, RoutedEventArgs e)
        {
            SetCustomerObjects(DatabaseHandler.Search(searchBox.Text));
        }

        private void addButton_Click(object sender, RoutedEventArgs e)
        {
            if(IsTextAllowed(amountBox.Text))
            {
                currentCustomer.Balance = DatabaseHandler.AddBalance(double.Parse(amountBox.Text), currentCustomer.BalanceID);
            }

            RefreshWindow(currentCustomer);
        }

        private void removeButton_Click(object sender, RoutedEventArgs e)
        {
            if (IsTextAllowed(amountBox.Text))
            {
                currentCustomer.Balance = DatabaseHandler.SubtractBalance(double.Parse(amountBox.Text), currentCustomer.BalanceID);
            }

            RefreshWindow(currentCustomer);
        }

        private void limitSaveButton_Click(object sender, RoutedEventArgs e)
        {
            if (IsTextAllowed(limitBox.Text))
            {
                currentCustomer.DepositLimit = int.Parse(limitBox.Text);
                DatabaseHandler.SaveDepositLimit(int.Parse(limitBox.Text), currentCustomer.BalanceID);
            }

            RefreshWindow(currentCustomer);
        }

        private void saveAllButton_Click(object sender, RoutedEventArgs e)
        {
            try
            {
                limitSaveButton_Click(sender, e);

                DatabaseHandler.SaveAll(currentCustomer);

                MessageBox.Show("Save Complete\n" + currentCustomer.Fullname);
            }
            catch (Exception ex)
            {
                MessageBox.Show(ex.Message);
            }
        }

        private void cancelButton_Click(object sender, RoutedEventArgs e)
        {
            currentCustomer = new CustomerDataObject(originalCustomerObject);

            RefreshWindow(originalCustomerObject);
        }

        private void emailBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            currentCustomer.Email = emailBox.Text;
        }

        private void landBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            currentCustomer.CountryName = landBox.Text;
        }

        private void resetPasswordButton_Click(object sender, RoutedEventArgs e)
        {
            MessageBox.Show("Not Implmented.");
        }

        private void detailsButton_Click(object sender, RoutedEventArgs e)
        {
            Detaljer detaljer = new Detaljer();
            detaljer.Show();
        }

        private void phoneBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            if(IsTextAllowed(phoneBox.Text))
            {
                currentCustomer.PhoneNumber = int.Parse(phoneBox.Text);
            }

            RefreshWindow(currentCustomer);
        }
    }
}

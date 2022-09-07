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
using System.Windows.Shapes;

namespace AdministratorProgram
{
    /// <summary>
    /// Interaction logic for Detaljer.xaml
    /// </summary>
    public partial class Detaljer : Window
    {
        public Detaljer()
        {
            InitializeComponent();

            RefreshWindow(MainWindow.currentCustomer);
        }

        private void RefreshWindow(CustomerDataObject customer)
        {
            if (customer == null) return;

            firstnameBox.Text = customer.Firstname;
            lastnameBox.Text = customer.Lastname;
            addressBox.Text = customer.Address;
            zipcodeBox.Text = customer.ZipCode.ToString();
            cityBox.Text = customer.City;
            genderBox.Text = customer.GenderName;
            registerDateBox.Text = customer.RegisterDate;
        }

        private void firstnameBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            MainWindow.currentCustomer.Firstname = firstnameBox.Text;
        }

        private void lastnameBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            MainWindow.currentCustomer.Lastname = lastnameBox.Text;
        }

        private void addressBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            MainWindow.currentCustomer.Address = addressBox.Text;
        }

        private void zipcodeBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            if (!MainWindow.IsTextAllowed(zipcodeBox.Text))
            {
                zipcodeBox.Text = "";
                return;
            }

            MainWindow.currentCustomer.ZipCode = int.Parse(zipcodeBox.Text);
        }

        private void cityBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            MainWindow.currentCustomer.City = cityBox.Text;
        }

        private void genderBox_TextChanged(object sender, TextChangedEventArgs e)
        {
            MainWindow.currentCustomer.GenderName = genderBox.Text;
        }
    }
}

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
using System.Data.SqlClient;
using System.Data;

namespace AdministratorProgram
{
    /// <summary>
    /// Interaction logic for Transaktioner.xaml
    /// </summary>
    public partial class Transaktioner : Window
    {
        public Transaktioner()
        {
            InitializeComponent();

            RefreshData();
        }

        public void RefreshData()
        {
            if(MainWindow.currentCustomer == null) return;

            DataSet ds = DatabaseHandler.FetchTransactions(MainWindow.currentCustomer.BalanceID);
            if (ds.Tables[0].Rows.Count > 0)
            {
                transactionHistoryViewer.ItemsSource = ds.Tables[0].DefaultView;
            }
        }
    }
}

export class Balance 
{
	constructor()
	{
		this.customerID = null;
		this.balance = null;
		this.depositLimit = null;
		this.transactions = null;
	}
  
	customerID: number | null;
	balance: number | null;
	depositLimit: number | null;
	transactions: any[] | null;
}
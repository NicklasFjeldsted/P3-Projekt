export interface Transaction 
{
	transactionID: number,
	customerID: number,
	transactionDate: Date,
	amount: string,
	currentBalance: number
}
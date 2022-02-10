USE [TEC-KasinoDB];
GO
USE [TEC-KasinoDB];
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE sp_email_search
	@Email nvarchar(450)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT Customers.CustomerID, Customers.Email, Customers.CountryID,
	Countries.CountryName, Customers.PhoneNumber, Customers.CPRNumber,
	Customers.FirstName, Customers.LastName, Customers.Address, Customers.ZipCodeID,
	ZipCode.ZipCodeName, Customers.GenderID, AccountGenders.GenderName,
	Customers.RegisterDate, AccountBalances.BalanceID, AccountBalances.Balance, AccountBalances.DepositLimit
	FROM Customers
	INNER JOIN Countries ON Customers.CountryID=Countries.CountryID
	INNER JOIN ZipCode ON Customers.ZipCodeID=ZipCode.ZipCodeID
	INNER JOIN AccountBalances ON Customers.CustomerID=AccountBalances.CustomerID
	INNER JOIN AccountGenders ON Customers.GenderID=AccountGenders.GenderID
	WHERE Customers.Email=@Email;
END
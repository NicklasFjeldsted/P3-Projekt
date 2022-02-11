USE [TEC-KasinoDB];
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID('sp_email_search', 'P') IS NOT NULL
	DROP PROC sp_email_search
GO
CREATE PROCEDURE sp_email_search
	@Email nvarchar(450)
AS
BEGIN
	SET NOCOUNT ON;

	SELECT Customers.CustomerID, Customers.Email, Customers.Password, Customers.CountryID,
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

exec sp_email_search @Email = 'alexanderv.eriksen@gmail.com'
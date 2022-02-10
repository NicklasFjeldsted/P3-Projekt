USE [TEC-KasinoDB];
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE sp_save_all
	@CustomerID INT,
	@Email NVARCHAR(450),
	@CountryID INT,
	@PhoneNumber INT,
	@CPRNumber NVARCHAR(11),
	@FirstName NVARCHAR(MAX),
	@LastName NVARCHAR(MAX),
	@Address NVARCHAR(MAX),
	@ZipCodeID INT,
	@GenderID INT,
	@Balance FLOAT
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE Customers
	SET Email = @Email, CountryID = @CountryID, PhoneNumber = @PhoneNumber,
	CPRNumber = @CPRNumber, FirstName = @FirstName, LastName = @LastName,
	Address = @Address, ZipCodeID = @ZipCodeID, GenderID = @GenderID
	WHERE CustomerID = @CustomerID;

	UPDATE AccountBalances
	SET Balance = @Balance
	WHERE CustomerID = @CustomerID;
END
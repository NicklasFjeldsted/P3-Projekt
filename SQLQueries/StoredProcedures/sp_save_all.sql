USE [TEC-KasinoDB];
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID('sp_save_all', 'P') IS NOT NULL
	DROP PROC sp_save_all
GO
CREATE PROCEDURE sp_save_all
	@CustomerID INT,
	@Email NVARCHAR(450),
	@CountryName NVARCHAR(MAX),
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

	DECLARE @TempCountryID INT;

	SELECT @TempCountryID = CountryID FROM Countries WHERE CountryName = @CountryName;

	UPDATE Customers
	SET Email = @Email, CountryID = @TempCountryID, PhoneNumber = @PhoneNumber,
	CPRNumber = @CPRNumber, FirstName = @FirstName, LastName = @LastName,
	Address = @Address, ZipCodeID = @ZipCodeID, GenderID = @GenderID
	WHERE CustomerID = @CustomerID;

	UPDATE AccountBalances
	SET Balance = @Balance
	WHERE CustomerID = @CustomerID;
END
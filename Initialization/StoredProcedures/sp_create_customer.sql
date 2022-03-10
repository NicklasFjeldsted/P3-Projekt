USE [TEC-KasinoDB];
GO
IF OBJECT_ID('sp_create_customer', 'P') IS NOT NULL
	DROP PROC sp_create_customer
GO
/*  CUSTOMER CRUD   */ 
CREATE PROCEDURE [sp_create_customer] /* CREATE Customer */ 
	@Email nvarchar(255), 
	@Password nvarchar(255), 
	@Country int, 
	@Phone int, 
	@CPR nvarchar(max), 
	@FirstName nvarchar(255),
	@LastName nvarchar(255), 
	@Address nvarchar(255), 
	@ZipCode int, 
	@Gender int,
	@returnValue nvarchar(max) OUTPUT
AS 
	BEGIN
		SET NOCOUNT ON;

		IF NOT EXISTS(SELECT * FROM Customers WHERE Email = @Email)
			BEGIN
				DECLARE @newID int;
				INSERT INTO Customers(Email, [Password], CountryID, PhoneNumber, CPRNumber, FirstName, LastName, Address, ZipCodeID, GenderID)
				VALUES(@Email, HASHBYTES('SHA2_512', @Password), @Country, @Phone, @CPR, @FirstName, @LastName, @Address, @ZipCode, @Gender)
				SET @newID = SCOPE_IDENTITY()
				INSERT INTO AccountBalances(CustomerID)
				VALUES(@newID)

				SET @returnValue = @Email + ' has been registered successfully!';
			END
		ELSE
			BEGIN
				SET @returnValue =  @Email + ' is already registered';
			END
	END
GO
  CREATE PROCEDURE [sp_read_customer] /* READ */
	@Email NVARCHAR(max),
	@Password NVARCHAR(max) 
	AS 
		BEGIN 
			SELECT Email, Password, CountryID, PhoneNumber, CPRNumber, FirstName, LastName, Address, ZipCodeID, GenderID, RegisterDate From Customers Where Email = @Email AND Password = HASHBYTES('SHA2_512', @Password)
		END;
	GO
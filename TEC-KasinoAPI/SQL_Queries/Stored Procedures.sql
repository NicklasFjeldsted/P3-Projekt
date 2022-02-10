
/*  CUSTOMER CRUD   */ 
CREATE PROCEDURE [spCreateCustomer] /* CREATE Customer */ 
	@Email nvarchar(255), 
	@Password nvarchar(255), 
	@Country int, 
	@Phone int, 
	@CPR nvarchar(max), 
	@FirstName nvarchar(255),
	@LastName nvarchar(255), 
	@Address nvarchar(255), 
	@PostalCode int, 
	@gender int,
	@ReturnValue NVARCHAR(max) OUT
AS 
	BEGIN
		SET NOCOUNT ON;

		IF NOT EXISTS(SELECT * FROM Customers WHERE Email = @Email)
			BEGIN
				DECLARE @newID int;
				INSERT INTO Customers(Email, [Password], CountryID, PhoneNumber, CPRNumber, FirstName, LastName, Address, PostCode, City, GenderID)
				VALUES(@Email, @Password, @Country, @Phone, @CPR, @FirstName, @LastName, @Address, @PostalCode, @City, @Gender);
				SELECT @newID = CustomerID as SCOPE_IDENTITY();
				INSERT INTO AccountBalances(CustomerID)
				VALUES(@newID)

				SET @ReturnValue = @Email + 'has been registered successfully!';
			END
		ELSE
			BEGIN
				SET @ReturnValue = @Email + 'is already registered';
			END
	END
GO

CREATE PROCEDURE [spReadCustomer] /* READ */
	@Email NVARCHAR(255) 
	AS 
		BEGIN 
			SELECT * FROM Customers WHERE Email = @Email 
		END;
	GO

CREATE PROCEDURE [spUpdateCustomer] /* UPDATE */
	@Email nvarchar(255), 
	@Password nvarchar(255), 
	@Country int, 
	@Phone int, 
	@CPR int, 
	@FirstName nvarchar(255),
	@LastName nvarchar(255), 
	@Address nvarchar(255), 
	@PostalCode int, 
	@City nvarchar(255), 
	@gender int 
	AS 
		BEGIN
			UPDATE Customers
			SET Email = @Email, [Password] = @Password, CountryID = @Country, PhoneNumber = @Phone, CPRNumber = @CPR, FirstName = @FirstName, LastName = @LastName, Address = @Address, PostCode = @PostalCode, City = @City, GenderID = @Gender
			WHERE Email = @Email
		END;
	GO

CREATE PROCEDURE [spDeleteCustomer] /* DELETE */
	@Email NVARCHAR(255) 
	AS 
		BEGIN 
			DELETE FROM Customers 
			WHERE Email = @Email 
		END
	GO

CREATE PROCEDURE [spCreateBalance] /* CREATE BALANCE */
		@CustomerID int,
		@Balance int
		AS
			BEGIN
				INSERT INTO AccountBalances(CustomerID, Balance)
				VALUES (@CustomerID, @Balance)
			END
		GO

CREATE PROCEDURE [spReadBalance] /* READ BALANCE */
		@CustomerID int
		AS
			BEGIN
				SELECT * FROM AccountBalances WHERE CustomerID = @CustomerID
			END
		GO

CREATE PROCEDURE [spUpdateBalance] /* UPDATE BALANCE */
		@CustomerID int,
		@Balance int
		AS
			BEGIN
				UPDATE AccountBalances
				SET Balance = @Balance
				WHERE CustomerID = @CustomerID
			END
		GO

CREATE PROCEDURE [spDeleteBalance] /* DELETE BALANCE */ 
		@CustomerID int
		AS
			BEGIN
				DELETE FROM AccountBalances
				WHERE CustomerID = @CustomerID
			END
		GO
		

DROP PROC spCreateCustomer
DROP PROC spReadCustomer
DROP PROC spUpdateCustomer
DROP PROC spDeleteCustomer

DROP PROC spCreateBalance
DROP PROC spReadBalance
DROP PROC spUpdateBalance
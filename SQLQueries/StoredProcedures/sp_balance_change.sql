USE [TEC-KasinoDB];
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID('sp_balance_add', 'P') IS NOT NULL
	DROP PROC sp_balance_add
GO
CREATE PROCEDURE sp_balance_add
	@InputValue nvarchar(max),
	@CustomerID int,
	@Balance int OUTPUT
AS
BEGIN
	DECLARE @NewBalance FLOAT;

	UPDATE AccountBalances SET @NewBalance = Balance = Balance + @InputValue WHERE CustomerID = @CustomerID;

	INSERT INTO Transactions (CustomerID, TransactionDate, Amount, CurrentBalance) VALUES (@CustomerID, GETDATE(), CONCAT('+',@InputValue), @NewBalance);

	SELECT @Balance = @NewBalance;
END
GO
IF OBJECT_ID('sp_balance_subtract', 'P') IS NOT NULL
	DROP PROC sp_balance_subtract
GO
CREATE PROCEDURE sp_balance_subtract
	@InputValue nvarchar(max),
	@CustomerID int,
	@Balance int OUTPUT
AS
BEGIN
	DECLARE @NewBalance FLOAT;

	UPDATE AccountBalances SET @NewBalance = Balance = Balance - @InputValue WHERE CustomerID = @CustomerID;

	INSERT INTO Transactions (CustomerID, TransactionDate, Amount, CurrentBalance) VALUES (@CustomerID, GETDATE(), CONCAT('-',@InputValue), @NewBalance);

	SELECT @Balance = @NewBalance;
END
GO
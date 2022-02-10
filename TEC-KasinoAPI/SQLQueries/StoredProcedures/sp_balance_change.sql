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
	@BalanceID int
AS
BEGIN
	DECLARE @NewBalance FLOAT;

	UPDATE AccountBalances SET @NewBalance = Balance = Balance + @InputValue WHERE BalanceID = @BalanceID;

	INSERT INTO Transactions (BalanceID, TransactionDate, Amount, CurrentBalance) VALUES (@BalanceID, GETDATE(), CONCAT('+',@InputValue), @NewBalance);
END
GO
IF OBJECT_ID('sp_balance_subtract', 'P') IS NOT NULL
	DROP PROC sp_balance_subtract
GO
CREATE PROCEDURE sp_balance_subtract
	@InputValue nvarchar(max),
	@BalanceID int
AS
BEGIN
	DECLARE @NewBalance FLOAT;

	UPDATE AccountBalances SET @NewBalance = Balance = Balance - @InputValue WHERE BalanceID = @BalanceID;

	INSERT INTO Transactions (BalanceID, TransactionDate, Amount, CurrentBalance) VALUES (@BalanceID, GETDATE(), CONCAT('-',@InputValue), @NewBalance);
END
GO
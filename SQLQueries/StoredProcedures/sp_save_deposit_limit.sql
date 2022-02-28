USE [TEC-KasinoDB];
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID('sp_save_deposit_limit', 'P') IS NOT NULL
	DROP PROC sp_save_deposit_limit
GO
CREATE PROCEDURE sp_save_deposit_limit
	@InputValue INT,
	@CustomerID INT
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE AccountBalances SET DepositLimit = @InputValue WHERE CustomerID = @CustomerID;
END
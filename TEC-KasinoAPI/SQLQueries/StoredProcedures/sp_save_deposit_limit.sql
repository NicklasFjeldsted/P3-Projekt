USE [TEC-KasinoDB];
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE PROCEDURE sp_save_deposit_limit
	@NewLimit FLOAT,
	@BalanceID INT
AS
BEGIN
	SET NOCOUNT ON;

	UPDATE AccountBalances SET DepositLimit = @NewLimit WHERE BalanceID = @BalanceID;
END
USE [TEC-KasinoDB];
GO
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
IF OBJECT_ID('sp_login', 'P') IS NOT NULL
	DROP PROC sp_login
GO
CREATE PROCEDURE sp_login
	@Email NVARCHAR(450),
	@Password NVARCHAR(MAX),
	@Output NVARCHAR(MAX) OUTPUT
AS
	BEGIN
		IF EXISTS(SELECT CustomerID FROM Customers WHERE Email = @Email AND Password = HASHBYTES('SHA2_512', @Password))
			BEGIN
				SET @output = 'Logged in successfully';
			END
		ELSE
			BEGIN
				SET @output = 'Login Failed: Email and password do not match!';
			END
		END
	
GO


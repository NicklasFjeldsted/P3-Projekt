USE [TEC-KasinoDB]
GO
/****** Object:  StoredProcedure [dbo].[sp_login]    Script Date: 18/02/2022 08.35.24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER PROCEDURE [dbo].[sp_login]
	@Email NVARCHAR(450),
	@Password NVARCHAR(MAX),
	@Output INT OUTPUT
AS
	BEGIN
		IF EXISTS(SELECT Email, Password FROM Customers WHERE Email = @Email AND Password = HASHBYTES('SHA2_512', @Password))
			SET @Output = 1
		ELSE
			SET @Output = 0
	END

	


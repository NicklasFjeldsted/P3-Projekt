USE [TEC-KasinoDB];
GO

INSERT INTO AccountGenders (GenderName) VALUES('Male'),('Female');
GO

EXEC sp_create_customer @Email = 'alexanderv.eriksen@gmail.com', @Password = 'Passw0rd', @Country = 45, @Phone = 01234567, @CPR = '0123456789', @FirstName = 'Alexander', @LastName = 'Eriksen', @Address = 'Auder�d Byvej 12', @ZipCode = 3300, @Gender = 1, @returnValue = "error"
GO

EXEC sp_create_customer @Email = 'dikshyasingh12@gmail.com', @Password = 'Passw0rd', @Country = 45, @Phone = 01234568, @CPR = '012345645', @FirstName = 'Dikshya', @LastName = 'Singh', @Address = 'Lungby hovedgade 106', @ZipCode = 2800, @Gender = 2, @returnValue = "error"
GO
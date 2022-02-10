USE [TEC-KasinoDB];
GO

INSERT INTO Countries (CountryName) VALUES('Denmark');
GO
INSERT INTO AccountGenders (GenderName) VALUES('Male'),('Female');
GO
INSERT INTO Customers (Email, Password, CountryID, PhoneNumber, CPRNumber, FirstName, LastName, Address, ZipCodeID, GenderID)
	VALUES('alexanderv.eriksen@gmail.com', HASHBYTES('SHA2_256', 'Passw0rd'), 1, 40306827, 230801, 'Alexander', 'Eriksen', 'Auderød Byvej 12', 3300, 1);
GO
INSERT INTO AccountBalances (CustomerID, Balance, DepositLimit) VALUES(SCOPE_IDENTITY(), 100000, 100);
GO
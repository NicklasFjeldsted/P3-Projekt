use master;
go

alter database [Tec-KasinoDB]
SET SINGLE_USER
With rollback immediate 
GO

DROP database [Tec-KasinoDB]

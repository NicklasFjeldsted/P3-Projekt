use master;
go
IF EXISTS (SELECT name FROM master.sys.databases WHERE name = N'TEC-KasinoDB')
BEGIN
	alter database [Tec-KasinoDB]
	SET SINGLE_USER
	With rollback immediate 
	DROP database [Tec-KasinoDB]
END
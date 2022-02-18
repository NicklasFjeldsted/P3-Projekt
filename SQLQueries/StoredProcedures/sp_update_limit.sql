USE [TEC-KasinoDB]
GO
IF OBJECT_ID('sp_update_limit', 'P') IS NOT NULL
	DROP PROC sp_update_limit
CREATE PROCEDURE [sp_update_limit]

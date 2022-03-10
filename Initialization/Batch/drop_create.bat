sqlcmd -S 10.0.6.2 -W -i %CD%\Queries\drop_database.sql -Usa -P1234
CD ..\TEC-KasinoAPI
dotnet ef database update
CD ..\Initialization
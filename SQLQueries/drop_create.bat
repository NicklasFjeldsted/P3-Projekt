sqlcmd -S 10.0.6.2 -i dropdatabase.sql -Usa -P1234
cd ..\TEC-KasinoAPI
dotnet ef database update
cd ..\SQLQueries
sqlcmd -S DESKTOP-SRN9QO0 -i dropdatabase.sql -Usa -P1234
PAUSE
cd ..\TEC-KasinoAPI
dotnet ef database update
cd ..\SQLQueries
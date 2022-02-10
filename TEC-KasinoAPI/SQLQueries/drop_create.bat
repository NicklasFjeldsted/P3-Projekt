sqlcmd -S DESKTOP-SRN9QO0 -i dropdatabase.sql -Usa -P1234
pause
cd ../
dotnet ef database update
cd SQLQueries
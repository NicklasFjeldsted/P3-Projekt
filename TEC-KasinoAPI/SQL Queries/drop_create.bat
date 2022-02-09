sqlcmd -S DESKTOP-SRN9QO0 -i dropdatabase.sql
pause 
dotnet ef database update
pause
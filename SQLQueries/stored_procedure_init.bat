@echo off
FOR %%x in (StoredProcedures\sp*.sql) DO sqlcmd -f 65001 -S 10.0.6.2 -i  %%x -Usa -P1234
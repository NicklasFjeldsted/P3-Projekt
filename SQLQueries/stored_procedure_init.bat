@echo off
FOR %%x in (StoredProcedures\sp*.sql) DO sqlcmd -S DESKTOP-SRN9QO0 -i  %%x -Usa -P1234
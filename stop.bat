@echo off
cd server\nginx\nginx-1.25.3
nginx.exe -s stop
echo Nginx stopped.
pause
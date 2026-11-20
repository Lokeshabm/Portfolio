@echo off
title B M LOKESHA - Java SE Portfolio Backend Server
echo ========================================================
echo   Compiling B M LOKESHA Java SE Portfolio Backend...
echo ========================================================

if not exist bin mkdir bin

:: Find all java files and compile with Jakarta Mail libraries
dir /s /b src\main\java\*.java > sources.txt
javac -cp "lib/*" -d bin @sources.txt
del sources.txt

if %ERRORLEVEL% NEQ 0 (
    echo [ERROR] Compilation failed! Please verify Java JDK installation.
    pause
    exit /b %ERRORLEVEL%
)

echo [OK] Compilation successful!
echo Starting Java SE HTTP Server on port 8080...
echo ========================================================
java -cp "bin;lib/*" com.lokesha.portfolio.Main

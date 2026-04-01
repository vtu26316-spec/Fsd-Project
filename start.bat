@echo off
echo.
echo  ==========================================
echo   EventHub - Ticketing Platform
echo  ==========================================
echo.

:: Auto-detect JAVA_HOME from the java.exe location
for /f "tokens=*" %%i in ('where java 2^>nul') do (
    set JAVA_EXE=%%i
    goto :found_java
)

:: If 'where java' fails, try common install paths
if exist "C:\Program Files\Java\jdk-21\bin\java.exe" (
    set JAVA_HOME=C:\Program Files\Java\jdk-21
    goto :start_server
)
if exist "C:\Program Files\Java\jdk-21.0.5\bin\java.exe" (
    set JAVA_HOME=C:\Program Files\Java\jdk-21.0.5
    goto :start_server
)
if exist "C:\Program Files\Eclipse Adoptium\jdk-21.0.5.9-hotspot\bin\java.exe" (
    set JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-21.0.5.9-hotspot
    goto :start_server
)
if exist "C:\Program Files\Microsoft\jdk-21.0.5.11-hotspot\bin\java.exe" (
    set JAVA_HOME=C:\Program Files\Microsoft\jdk-21.0.5.11-hotspot
    goto :start_server
)

echo  ERROR: Java not found on this computer!
echo.
echo  Please install Java 21 from:
echo  https://www.oracle.com/java/technologies/downloads/#java21
echo.
pause
exit

:found_java
:: Strip \bin\java.exe to get JAVA_HOME
set JAVA_HOME=%JAVA_EXE:\bin\java.exe=%
echo  Found Java at: %JAVA_HOME%

:start_server
echo  Starting backend server...
echo  (First run downloads dependencies - may take 2-3 minutes)
echo.

cd /d "%~dp0backend"

start "EventHub Backend" cmd /k "mvnw.cmd spring-boot:run"

echo  Waiting for server to start (30 seconds)...
timeout /t 30 /nobreak >nul

echo  Opening website...
start "" "http://localhost:8080/login.html"

echo.
echo  ==========================================
echo   Website: http://localhost:8080/login.html
echo   Login:   admin / admin123
echo   Signup:  Create your own account
echo  ==========================================
echo.
pause

@echo off
REM Batch script to remove multi-line comments from TypeScript/JavaScript files
REM Usage: scripts\remove-comments.bat [directory]

set "TARGET_PATH=%~1"
if "%TARGET_PATH%"=="" set "TARGET_PATH=.\src"

echo 🧹 Removing multi-line comments from %TARGET_PATH%...
echo.

REM Try Node.js version first
where node >nul 2>nul
if %ERRORLEVEL%==0 (
    echo Using Node.js version...
    node scripts\remove-comments.js "%TARGET_PATH%"
    goto :end
)

REM Fallback to PowerShell version
echo Using PowerShell version...
powershell -ExecutionPolicy Bypass -File scripts\remove-comments.ps1 -TargetPath "%TARGET_PATH%"

:end
echo.
pause
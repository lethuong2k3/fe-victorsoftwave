@echo off
echo Building Docker image...
docker build -t thuongchet2k3/victor-softwave-backend:latest .

if %errorlevel% neq 0 (
    echo Docker build failed!
    exit /b %errorlevel%
)

echo Pushing Docker image...
docker push thuongchet2k3/victor-softwave-backend:latest

if %errorlevel% neq 0 (
    echo Docker push failed!
    exit /b %errorlevel%
)

echo Done!
pause

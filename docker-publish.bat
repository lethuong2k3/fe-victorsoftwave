@echo off
echo Building Frontend Docker image...
docker build -t thuongchet2k3/victor-softwave-frontend:latest .

if %errorlevel% neq 0 (
    echo Docker build failed!
    exit /b %errorlevel%
)

echo Pushing Frontend Docker image...
docker push thuongchet2k3/victor-softwave-frontend:latest

if %errorlevel% neq 0 (
    echo Docker push failed!
    exit /b %errorlevel%
)

echo Done!
pause

@echo off
rem start /min powershell -NoExit -Command "npm run dev"
start /min wt -d "%cd%" powershell -NoExit -Command "npm run dev"

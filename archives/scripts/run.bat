@echo off
rem allow PS and PS+ to run at the same time
start /min python3 -m http.server 8020
start http://localhost:8020/src/editor.html

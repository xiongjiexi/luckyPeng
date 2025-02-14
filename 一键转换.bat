@echo off
echo 将商品文本文件拖放到此窗口，然后按回车...
set /p inputFile=
node "%~dp0convert.js" "%inputFile%"
pause
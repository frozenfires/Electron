rem 关闭自动输出

echo 清空目标目录
mkdir target
cd target
del /s /q /f *.*
for /d %%i in (*) do rd /s /q "%%i"
cd ..

echo 准备复制runtime
pause

xcopy /e .\runtime .\target

echo 准备压缩源码
pause

call asar pack .\src .\target\resources\app.asar

echo 打包完成
pause
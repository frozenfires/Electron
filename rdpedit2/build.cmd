rem �ر��Զ����

echo ���Ŀ��Ŀ¼
mkdir target
cd target
del /s /q /f *.*
for /d %%i in (*) do rd /s /q "%%i"
cd ..

echo ׼������runtime
pause

xcopy /e .\runtime .\target

echo ׼��ѹ��Դ��
pause

call asar pack .\src .\target\resources\app.asar

echo ������
pause
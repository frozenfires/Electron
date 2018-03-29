; 该脚本使用 HM VNISEdit 脚本编辑器向导产生

; 安装程序初始定义常量
!define PRODUCT_NAME "RDPIDE"
!define PRODUCT_VERSION "2.0.3"
!define PRODUCT_PUBLISHER "ETHINK, Inc."
!define PRODUCT_WEB_SITE "http://www.ethinkbank.com"
!define PRODUCT_DIR_REGKEY "Software\Microsoft\Windows\CurrentVersion\App Paths\RDPIDE.exe"
!define PRODUCT_UNINST_KEY "Software\Microsoft\Windows\CurrentVersion\Uninstall\${PRODUCT_NAME}"
!define PRODUCT_UNINST_ROOT_KEY "HKLM"

SetCompressor lzma

; ------ MUI 现代界面定义 (1.67 版本以上兼容) ------
!include "MUI.nsh"

; MUI 预定义常量
!define MUI_ABORTWARNING
!define MUI_ICON "${NSISDIR}\Contrib\Graphics\Icons\modern-install.ico"
!define MUI_UNICON "${NSISDIR}\Contrib\Graphics\Icons\modern-uninstall.ico"

; 欢迎页面
!insertmacro MUI_PAGE_WELCOME
; 安装目录选择页面
!insertmacro MUI_PAGE_DIRECTORY
; 安装过程页面
!insertmacro MUI_PAGE_INSTFILES
; 安装完成页面
!define MUI_FINISHPAGE_RUN "$INSTDIR\RDPIDE.exe"
!insertmacro MUI_PAGE_FINISH

; 安装卸载过程页面
!insertmacro MUI_UNPAGE_INSTFILES

; 安装界面包含的语言设置
!insertmacro MUI_LANGUAGE "SimpChinese"

; 安装预释放文件
!insertmacro MUI_RESERVEFILE_INSTALLOPTIONS
; ------ MUI 现代界面定义结束 ------

Name "${PRODUCT_NAME} ${PRODUCT_VERSION}"
OutFile "RDPIDESetup.exe"
InstallDir "$PROGRAMFILES\RDPIDE"
InstallDirRegKey HKLM "${PRODUCT_UNINST_KEY}" "UninstallString"
ShowInstDetails show
ShowUnInstDetails show
BrandingText " "
BGGradient 0000FF 000000

Section "MainSection" SEC01
  SetOutPath "$INSTDIR"
  SetOverwrite ifnewer
  File "..\target\blink_image_resources_200_percent.pak"
  CreateDirectory "$SMPROGRAMS\RDPIDE"
  CreateShortCut "$SMPROGRAMS\RDPIDE\RDPIDE.lnk" "$INSTDIR\RDPIDE.exe"
  CreateShortCut "$DESKTOP\RDPIDE.lnk" "$INSTDIR\RDPIDE.exe"
  File "..\target\content_resources_200_percent.pak"
  File "..\target\content_shell.pak"
  File "..\target\d3dcompiler_47.dll"
  File "..\target\ffmpeg.dll"
  File "..\target\icudtl.dat"
  File "..\target\libEGL.dll"
  File "..\target\libGLESv2.dll"
  File "..\target\LICENSE"
  File "..\target\LICENSES.chromium.html"
  SetOutPath "$INSTDIR\locales"
  File "..\target\locales\am.pak"
  File "..\target\locales\ar.pak"
  File "..\target\locales\bg.pak"
  File "..\target\locales\bn.pak"
  File "..\target\locales\ca.pak"
  File "..\target\locales\cs.pak"
  File "..\target\locales\da.pak"
  File "..\target\locales\de.pak"
  File "..\target\locales\el.pak"
  File "..\target\locales\en-GB.pak"
  File "..\target\locales\en-US.pak"
  File "..\target\locales\es-419.pak"
  File "..\target\locales\es.pak"
  File "..\target\locales\et.pak"
  File "..\target\locales\fa.pak"
  File "..\target\locales\fake-bidi.pak"
  File "..\target\locales\fi.pak"
  File "..\target\locales\fil.pak"
  File "..\target\locales\fr.pak"
  File "..\target\locales\gu.pak"
  File "..\target\locales\he.pak"
  File "..\target\locales\hi.pak"
  File "..\target\locales\hr.pak"
  File "..\target\locales\hu.pak"
  File "..\target\locales\id.pak"
  File "..\target\locales\it.pak"
  File "..\target\locales\ja.pak"
  File "..\target\locales\kn.pak"
  File "..\target\locales\ko.pak"
  File "..\target\locales\lt.pak"
  File "..\target\locales\lv.pak"
  File "..\target\locales\ml.pak"
  File "..\target\locales\mr.pak"
  File "..\target\locales\ms.pak"
  File "..\target\locales\nb.pak"
  File "..\target\locales\nl.pak"
  File "..\target\locales\pl.pak"
  File "..\target\locales\pt-BR.pak"
  File "..\target\locales\pt-PT.pak"
  File "..\target\locales\ro.pak"
  File "..\target\locales\ru.pak"
  File "..\target\locales\sk.pak"
  File "..\target\locales\sl.pak"
  File "..\target\locales\sr.pak"
  File "..\target\locales\sv.pak"
  File "..\target\locales\sw.pak"
  File "..\target\locales\ta.pak"
  File "..\target\locales\te.pak"
  File "..\target\locales\th.pak"
  File "..\target\locales\tr.pak"
  File "..\target\locales\uk.pak"
  File "..\target\locales\vi.pak"
  File "..\target\locales\zh-CN.pak"
  File "..\target\locales\zh-TW.pak"
  SetOutPath "$INSTDIR"
  File "..\target\natives_blob.bin"
  File "..\target\node.dll"
  File "..\target\RDPIDE.exe"
  SetOutPath "$INSTDIR\resources"
  File "..\target\resources\app.asar"
  File "..\target\resources\default_app.asar"
  File "..\target\resources\electron.asar"
  SetOutPath "$INSTDIR"
  File "..\target\snapshot_blob.bin"
  File "..\target\ui_resources_200_percent.pak"
  File "..\target\version"
  File "..\target\views_resources_200_percent.pak"
  File "..\target\xinput1_3.dll"
SectionEnd

Section -AdditionalIcons
  WriteIniStr "$INSTDIR\${PRODUCT_NAME}.url" "InternetShortcut" "URL" "${PRODUCT_WEB_SITE}"
  CreateShortCut "$SMPROGRAMS\RDPIDE\Website.lnk" "$INSTDIR\${PRODUCT_NAME}.url"
  CreateShortCut "$SMPROGRAMS\RDPIDE\Uninstall.lnk" "$INSTDIR\uninst.exe"
SectionEnd

Section -Post
  WriteUninstaller "$INSTDIR\uninst.exe"
  WriteRegStr HKLM "${PRODUCT_DIR_REGKEY}" "" "$INSTDIR\RDPIDE.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayName" "$(^Name)"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "UninstallString" "$INSTDIR\uninst.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayIcon" "$INSTDIR\RDPIDE.exe"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "DisplayVersion" "${PRODUCT_VERSION}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "URLInfoAbout" "${PRODUCT_WEB_SITE}"
  WriteRegStr ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}" "Publisher" "${PRODUCT_PUBLISHER}"
SectionEnd

/******************************
 *  以下是安装程序的卸载部分  *
 ******************************/

Section Uninstall
  Delete "$INSTDIR\${PRODUCT_NAME}.url"
  Delete "$INSTDIR\uninst.exe"
  Delete "$INSTDIR\xinput1_3.dll"
  Delete "$INSTDIR\views_resources_200_percent.pak"
  Delete "$INSTDIR\version"
  Delete "$INSTDIR\ui_resources_200_percent.pak"
  Delete "$INSTDIR\snapshot_blob.bin"
  Delete "$INSTDIR\resources\electron.asar"
  Delete "$INSTDIR\resources\default_app.asar"
  Delete "$INSTDIR\resources\app.asar"
  Delete "$INSTDIR\RDPIDE.exe"
  Delete "$INSTDIR\node.dll"
  Delete "$INSTDIR\natives_blob.bin"
  Delete "$INSTDIR\locales\zh-TW.pak"
  Delete "$INSTDIR\locales\zh-CN.pak"
  Delete "$INSTDIR\locales\vi.pak"
  Delete "$INSTDIR\locales\uk.pak"
  Delete "$INSTDIR\locales\tr.pak"
  Delete "$INSTDIR\locales\th.pak"
  Delete "$INSTDIR\locales\te.pak"
  Delete "$INSTDIR\locales\ta.pak"
  Delete "$INSTDIR\locales\sw.pak"
  Delete "$INSTDIR\locales\sv.pak"
  Delete "$INSTDIR\locales\sr.pak"
  Delete "$INSTDIR\locales\sl.pak"
  Delete "$INSTDIR\locales\sk.pak"
  Delete "$INSTDIR\locales\ru.pak"
  Delete "$INSTDIR\locales\ro.pak"
  Delete "$INSTDIR\locales\pt-PT.pak"
  Delete "$INSTDIR\locales\pt-BR.pak"
  Delete "$INSTDIR\locales\pl.pak"
  Delete "$INSTDIR\locales\nl.pak"
  Delete "$INSTDIR\locales\nb.pak"
  Delete "$INSTDIR\locales\ms.pak"
  Delete "$INSTDIR\locales\mr.pak"
  Delete "$INSTDIR\locales\ml.pak"
  Delete "$INSTDIR\locales\lv.pak"
  Delete "$INSTDIR\locales\lt.pak"
  Delete "$INSTDIR\locales\ko.pak"
  Delete "$INSTDIR\locales\kn.pak"
  Delete "$INSTDIR\locales\ja.pak"
  Delete "$INSTDIR\locales\it.pak"
  Delete "$INSTDIR\locales\id.pak"
  Delete "$INSTDIR\locales\hu.pak"
  Delete "$INSTDIR\locales\hr.pak"
  Delete "$INSTDIR\locales\hi.pak"
  Delete "$INSTDIR\locales\he.pak"
  Delete "$INSTDIR\locales\gu.pak"
  Delete "$INSTDIR\locales\fr.pak"
  Delete "$INSTDIR\locales\fil.pak"
  Delete "$INSTDIR\locales\fi.pak"
  Delete "$INSTDIR\locales\fake-bidi.pak"
  Delete "$INSTDIR\locales\fa.pak"
  Delete "$INSTDIR\locales\et.pak"
  Delete "$INSTDIR\locales\es.pak"
  Delete "$INSTDIR\locales\es-419.pak"
  Delete "$INSTDIR\locales\en-US.pak"
  Delete "$INSTDIR\locales\en-GB.pak"
  Delete "$INSTDIR\locales\el.pak"
  Delete "$INSTDIR\locales\de.pak"
  Delete "$INSTDIR\locales\da.pak"
  Delete "$INSTDIR\locales\cs.pak"
  Delete "$INSTDIR\locales\ca.pak"
  Delete "$INSTDIR\locales\bn.pak"
  Delete "$INSTDIR\locales\bg.pak"
  Delete "$INSTDIR\locales\ar.pak"
  Delete "$INSTDIR\locales\am.pak"
  Delete "$INSTDIR\LICENSES.chromium.html"
  Delete "$INSTDIR\LICENSE"
  Delete "$INSTDIR\libGLESv2.dll"
  Delete "$INSTDIR\libEGL.dll"
  Delete "$INSTDIR\icudtl.dat"
  Delete "$INSTDIR\ffmpeg.dll"
  Delete "$INSTDIR\d3dcompiler_47.dll"
  Delete "$INSTDIR\content_shell.pak"
  Delete "$INSTDIR\content_resources_200_percent.pak"
  Delete "$INSTDIR\blink_image_resources_200_percent.pak"

  Delete "$SMPROGRAMS\RDPIDE\Uninstall.lnk"
  Delete "$SMPROGRAMS\RDPIDE\Website.lnk"
  Delete "$DESKTOP\RDPIDE.lnk"
  Delete "$SMPROGRAMS\RDPIDE\RDPIDE.lnk"

  RMDir "$SMPROGRAMS\RDPIDE"
  RMDir "$INSTDIR\resources"
  RMDir "$INSTDIR\locales"

  RMDir "$INSTDIR"

  DeleteRegKey ${PRODUCT_UNINST_ROOT_KEY} "${PRODUCT_UNINST_KEY}"
  DeleteRegKey HKLM "${PRODUCT_DIR_REGKEY}"
  SetAutoClose true
SectionEnd

#-- 根据 NSIS 脚本编辑规则，所有 Function 区段必须放置在 Section 区段之后编写，以避免安装程序出现未可预知的问题。--#

Function un.onInit
  MessageBox MB_ICONQUESTION|MB_YESNO|MB_DEFBUTTON2 "您确实要完全移除 $(^Name) ，及其所有的组件？" IDYES +2
  Abort
FunctionEnd

Function un.onUninstSuccess
  HideWindow
  MessageBox MB_ICONINFORMATION|MB_OK "$(^Name) 已成功地从您的计算机移除。"
FunctionEnd

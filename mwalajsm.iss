; MwalaJS Inno Setup Script with Icon, Background, and Features
#define MyAppName "MwalaJS"
#define MyAppVersion "1.0.0"
#define MyAppPublisher "Your Name or Company"
#define MyAppExeName "start.bat"
#define MyIconFile "C:\Users\HP\OneDrive\Desktop\mwalajsm\mwalajs4_RXv_icon.ico"
#define MyBackgroundFile "C:\Users\HP\OneDrive\Desktop\mwalajsm\background.png"

[Setup]
AppId={{F4D0B5A7-EB21-4A4F-BE7D-8E32FBA7E837}
AppName={#MyAppName}
AppVersion={#MyAppVersion}
AppPublisher={#MyAppPublisher}
DefaultDirName={autopf}\MwalaJS
DefaultGroupName={#MyAppName}
UninstallDisplayIcon={app}\{#MyAppExeName}
OutputDir=C:\Users\HP\OneDrive\Desktop\mwalajsm\installer
OutputBaseFilename=MwalaJS-Installer
Compression=lzma
SolidCompression=yes
ArchitecturesInstallIn64BitMode=x64
SetupIconFile={#MyIconFile}
WizardImageFile={#MyBackgroundFile}
DisableWelcomePage=no
ShowLanguageDialog=yes

[Languages]
Name: "english"; MessagesFile: "compiler:Default.isl"

[Files]
; Copy main application files
Source: "C:\Users\HP\OneDrive\Desktop\mwalajsm\bin\mwala.mjs"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\HP\OneDrive\Desktop\mwalajsm\start.bat"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\HP\OneDrive\Desktop\mwalajsm\package.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\HP\OneDrive\Desktop\mwalajsm\node_modules\*"; DestDir: "{app}\node_modules"; Flags: recursesubdirs
Source: "{#MyIconFile}"; DestDir: "{app}"; Flags: ignoreversion
Source: "{#MyBackgroundFile}"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
; Desktop Shortcut
Name: "{commondesktop}\MwalaJS"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; IconFilename: "{app}\mwalajs4_RXv_icon.ico"
; Start Menu Shortcut
Name: "{group}\MwalaJS"; Filename: "{app}\{#MyAppExeName}"; WorkingDir: "{app}"; IconFilename: "{app}\mwalajs4_RXv_icon.ico"

[Run]
; Run the application after installation
Filename: "{app}\start.bat"; Description: "Run MwalaJS"; Flags: nowait postinstall runascurrentuser

[UninstallDelete]
; Remove all installed files when uninstalling
Type: filesandordirs; Name: "{app}"

[Code]
// Custom Installation Wizard with Welcome Message
procedure InitializeWizard;
begin
  MsgBox('Welcome to MwalaJS Installer! Get ready to install MwalaJS.', mbInformation, MB_OK);
end;

// Custom Uninstall Confirmation
procedure CurUninstallStepChanged(CurUninstallStep: TUninstallStep);
begin
  if CurUninstallStep = usUninstall then
  begin
    if MsgBox('Are you sure you want to uninstall MwalaJS?', mbConfirmation, MB_YESNO) = IDNO then
      Abort;
  end;
end;

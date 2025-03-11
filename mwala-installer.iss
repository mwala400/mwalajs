[Setup]
AppName=mwalajs
AppVersion=1.0.0
DefaultDirName={pf}\mwalajs
DefaultGroupName=mwalajs
OutputDir=.
OutputBaseFilename=mwalajs_installer
Compression=lzma
SolidCompression=yes

[Files]
Source: "C:\Users\HP\OneDrive\Desktop\mwalajs\bin\mwala.mjs"; DestDir: "{app}\bin"; Flags: ignoreversion
Source: "C:\Users\HP\OneDrive\Desktop\mwalajs\src\app.mjs"; DestDir: "{app}\src"; Flags: ignoreversion
Source: "C:\Users\HP\OneDrive\Desktop\mwalajs\package.json"; DestDir: "{app}"; Flags: ignoreversion
Source: "C:\Users\HP\OneDrive\Desktop\mwalajs\node_modules\*"; DestDir: "{app}\node_modules"; Flags: recursesubdirs
Source: "C:\Users\HP\OneDrive\Desktop\mwalajs\mwalajs.exe"; DestDir: "{app}"; Flags: ignoreversion

[Icons]
Name: "{userdesktop}\mwalajs"; Filename: "{app}\bin\mwala.mjs"

[Registry]
Root: HKLM; Subkey: "SYSTEM\CurrentControlSet\Control\Session Manager\Environment"; ValueType: expandsz; ValueName: "Path"; ValueData: "{olddata};{app}\bin"; 

[Run]
Filename: "{app}\mwalajs.exe"; Parameters: "install"; WorkingDir: "{app}"; 
Filename: "{app}\mwalajs.exe"; Parameters: "bin/mwala.js"; WorkingDir: "{app}";

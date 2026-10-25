param([string]$Python = 'python')
$ErrorActionPreference = 'Stop'
Set-Location (Join-Path $PSScriptRoot '..')
New-Item -ItemType Directory -Force '.audio-tools' | Out-Null
$revision = 'f019f4079d0ba74c481fa93396b3486a77f22635'
Invoke-WebRequest "https://raw.githubusercontent.com/musescore/MuseScore/$revision/share/sound/MS%20Basic.sf3" -OutFile '.audio-tools/MS-Basic.sf3'
Invoke-WebRequest "https://raw.githubusercontent.com/musescore/MuseScore/$revision/share/sound/MS%20Basic_License.md" -OutFile 'licenses/MS-Basic.txt'
Invoke-WebRequest 'https://github.com/FluidSynth/fluidsynth/releases/download/v2.6.1/fluidsynth-v2.6.1-win10-x64-cpp11.zip' -OutFile '.audio-tools/fluidsynth.zip'
Expand-Archive '.audio-tools/fluidsynth.zip' -DestinationPath '.audio-tools/fluidsynth' -Force
& $Python -m pip install --target '.audio-tools/python' numpy==2.3.5 imageio-ffmpeg==0.6.0
if ($LASTEXITCODE -ne 0) { throw 'Python dependencies failed' }
$fluidLibrary = (Get-ChildItem '.audio-tools/fluidsynth' -Recurse -Filter 'libfluidsynth-3.dll').FullName
& $Python scripts/render-audio.py --soundfont '.audio-tools/MS-Basic.sf3' --library $fluidLibrary
if ($LASTEXITCODE -ne 0) { throw 'Audio rendering failed' }
& $Python scripts/verify-audio.py --decode
if ($LASTEXITCODE -ne 0) { throw 'Audio verification failed' }

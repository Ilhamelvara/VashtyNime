# PowerShell Script to Download and Install Portable Maven
$mavenUrl = "https://archive.apache.org/dist/maven/maven-3/3.9.6/binaries/apache-maven-3.9.6-bin.zip"
$zipPath = "c:\VashtyNime\maven.zip"
$destPath = "c:\VashtyNime"

Write-Host "Downloading Maven from $mavenUrl..."
Invoke-WebRequest -Uri $mavenUrl -OutFile $zipPath

Write-Host "Extracting Maven to $destPath..."
Expand-Archive -Path $zipPath -DestinationPath $destPath -Force

Write-Host "Cleaning up zip file..."
Remove-Item $zipPath

Write-Host "Maven installed successfully at c:\VashtyNime\apache-maven-3.9.6"

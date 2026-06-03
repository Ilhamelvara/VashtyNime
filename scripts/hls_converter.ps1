# HLS Transcoding script for VashtyNime (Windows PowerShell version)
# File: c:\VashtyNime\scripts\hls_converter.ps1

param (
    [Parameter(Mandatory=$true, HelpMessage="Path to the input MP4 file")]
    [string]$InputVideo,

    [Parameter(Mandatory=$true, HelpMessage="Path to the output directory")]
    [string]$OutputDir
)

# Ensure the output directory exists
if (!(Test-Path -Path $OutputDir)) {
    New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
    Write-Host "Created target output directory: $OutputDir" -ForegroundColor Cyan
}

Write-Host "=============================================" -ForegroundColor Green
Write-Host "Starting HLS Transcode: $InputVideo" -ForegroundColor Green
Write-Host "Target Directory: $OutputDir" -ForegroundColor Green
Write-Host "=============================================" -ForegroundColor Green

# Standard FFmpeg command for copying codecs and chunking into 10 second segments
ffmpeg -i $InputVideo -codec: copy -start_number 0 -hls_time 10 -hls_list_size 0 -f hls "$OutputDir\index.m3u8"

if ($LASTEXITCODE -eq 0) {
    Write-Host "=============================================" -ForegroundColor Green
    Write-Host "Success! Transcoding completed." -ForegroundColor Green
    Write-Host "Created playlist file: $OutputDir\index.m3u8" -ForegroundColor Green
    Write-Host "=============================================" -ForegroundColor Green
} else {
    Write-Host "=============================================" -ForegroundColor Red
    Write-Host "Error occurred during FFmpeg transcoding." -ForegroundColor Red
    Write-Host "=============================================" -ForegroundColor Red
}

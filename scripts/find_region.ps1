# Script to find AWS region for IPv6 address
$ranges = Invoke-RestMethod -Uri "https://ip-ranges.amazonaws.com/ip-ranges.json"
$ip = "2406:da1a:b00:1302:c376:22f5:58d1:64fc"
Write-Host "Searching region for IP: $ip..."

$matching = $ranges.ipv6_prefixes | Where-Object {
    $prefix = $_.ipv6_prefix
    # Simple prefix matching for search
    $prefix.StartsWith("2406:da1a")
}

$matching | Select-Object ipv6_prefix, region, service | Format-Table

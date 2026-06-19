# Genera l'icona app (faccia WOOH su viola) con Higgsfield nano_banana_2.
$ErrorActionPreference = "Continue"
$root = "C:\Users\stefa\Desktop\CLAUDE\MARKETING\thewoohgame"
Set-Location $root
New-Item -ItemType Directory -Force -Path "public\icons" | Out-Null

$prompt = "A bold modern mobile app icon for a party game called The WOOH Game. A single bright glossy yellow cartoon emoji face with a wide-open tall U-shaped shouting mouth, two orange raised eyebrows and big excited round eyes, joyfully shouting. The face is centered with generous padding on a solid vibrant purple background. Flat clean app-icon style, thick bold outlines, full-bleed square composition, no text, no letters, no words, no border."

$raw = higgsfield generate create nano_banana_2 --prompt $prompt --aspect_ratio 1:1 --resolution 2k --wait --json | Out-String
try {
  $o = $raw | ConvertFrom-Json
  $first = if ($o -is [array]) { $o[0] } else { $o }
  $ru = $first.result_url
} catch { $ru = $null }

if ($ru) {
  Invoke-WebRequest -Uri $ru -OutFile "public\icons\source.png" -UseBasicParsing
  "ICON OK -> $ru ($((Get-Item 'public\icons\source.png').Length) bytes)"
} else {
  "ICON FAIL"; $raw.Substring(0, [Math]::Min(500, $raw.Length))
}

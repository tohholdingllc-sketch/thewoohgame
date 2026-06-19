# Rigenera icona app + logo con Seedream 4.5 (l'utente segnala problemi con nano-banana).
$ErrorActionPreference = "Continue"
$root = "C:\Users\stefa\Desktop\CLAUDE\MARKETING\thewoohgame"
Set-Location $root
New-Item -ItemType Directory -Force -Path "public\icons", "public\brand" | Out-Null

function Gen($prompt, $out) {
  $raw = higgsfield generate create seedream_v4_5 --prompt $prompt --aspect_ratio 1:1 --wait --json | Out-String
  try { $o = $raw | ConvertFrom-Json; $first = if ($o -is [array]) { $o[0] } else { $o }; $ru = $first.result_url } catch { $ru = $null }
  if ($ru) {
    Invoke-WebRequest -Uri $ru -OutFile $out -UseBasicParsing
    "OK -> $out ($([math]::Round((Get-Item $out).Length/1kb)) KB)  $ru"
  } else { "FAIL $out"; $raw.Substring(0, [Math]::Min(400, $raw.Length)) }
}

"=== ICONA (faccia WOOH, no testo, full-bleed viola) ==="
Gen "A bold modern mobile app icon. A single bright glossy yellow cartoon emoji face with a wide-open tall U-shaped shouting mouth, two thick orange raised eyebrows and big excited round eyes, joyfully shouting. Centered with generous padding on a solid vibrant purple background. Flat clean app-icon style, thick bold black outlines, full-bleed square composition, no text, no letters, no words." "public\icons\source-v2.png"

"=== LOGO (THE WOOH GAME a pennello, sfondo grigio piatto per ritaglio) ==="
Gen "A playful party-game logo on a plain flat light grey background. The word 'WOOH' in huge bold hand-painted brush-stroke letters, white fill with a thick bright orange outline, energetic and fun. Centered. Above it the small word 'THE' and below it the word 'GAME', both in clean bold white sans-serif uppercase. Only these three words, spelled exactly THE WOOH GAME, no other text, crisp and legible." "public\brand\logo-source.png"

"DONE"

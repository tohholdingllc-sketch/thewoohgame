# Genera 20 avatar originali (personaggi cartoon) con Seedream 4.5.
$ErrorActionPreference = "Continue"
$root = "C:\Users\stefa\Desktop\CLAUDE\MARKETING\thewoohgame"
Set-Location $root
New-Item -ItemType Directory -Force -Path "public\avatars\raw" | Out-Null

$style = "A cute bold flat cartoon avatar character: a "
$tail = " with big expressive eyes and a playful, fun, party expression. Head and shoulders, centered. Thick clean black outlines, vibrant saturated colors, simple shapes. Plain flat light grey background, no text, no letters, no border."

$subjects = [ordered]@{
  "fox" = "orange fox"; "cat" = "grey cat"; "panda" = "panda"; "dog" = "golden dog";
  "lion" = "lion"; "tiger" = "tiger"; "bear" = "brown bear"; "koala" = "koala";
  "monkey" = "monkey"; "frog" = "green frog"; "penguin" = "penguin"; "owl" = "owl";
  "unicorn" = "pink unicorn"; "dragon" = "green dragon"; "alien" = "green alien";
  "robot" = "friendly robot"; "ghost" = "white ghost"; "raccoon" = "raccoon";
  "llama" = "llama"; "shark" = "blue shark"
}

$ok = 0
foreach ($id in $subjects.Keys) {
  $raw = higgsfield generate create seedream_v4_5 --prompt ($style + $subjects[$id] + $tail) --aspect_ratio 1:1 --wait --json | Out-String
  try { $o = $raw | ConvertFrom-Json; $first = if ($o -is [array]) { $o[0] } else { $o }; $ru = $first.result_url } catch { $ru = $null }
  if ($ru) {
    Invoke-WebRequest -Uri $ru -OutFile "public\avatars\raw\$id.png" -UseBasicParsing
    $ok++; "OK $id"
  } else { "FAIL $id" }
}
"DONE $ok/20"

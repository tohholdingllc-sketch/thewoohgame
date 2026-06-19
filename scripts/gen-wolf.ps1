# Genera il lupo mascotte in 3 espressioni con Higgsfield nano_banana_2,
# usando lo sketch dell'utente come riferimento. Salva gli URL risultanti.
$ErrorActionPreference = "Continue"
$root = "C:\Users\stefa\Desktop\CLAUDE\MARKETING\thewoohgame"
Set-Location $root
New-Item -ItemType Directory -Force -Path "public\brand" | Out-Null
$ref = "images\references\mascotte.jpg"

$base = "Mascot character for a party drinking game. A confident, charismatic anthropomorphic grey wolf with pointy ears and a tuft of hair, wearing an open white dress shirt with a loosened tie, mouth wide open shouting 'WOOH', one hand raised with palm forward. Bold flat cartoon vector illustration, thick clean black outlines, vibrant saturated colors, upper body, centered, isolated on a plain flat light grey background for easy cutout. "

$exprs = @(
  @{ k = "love";  e = "His eyes are two big red love-hearts, smitten and charming, like a beautiful person just walked by." },
  @{ k = "money"; e = "His eyes are bright green dollar signs, thrilled and greedy like he just won big money." },
  @{ k = "drunk"; e = "His eyes are red, glossy, woozy and half-closed with rosy flushed cheeks, happily tipsy from a strong drink." }
)

$lines = @()
foreach ($x in $exprs) {
  "Generating wolf-$($x.k)..."
  $json = higgsfield generate create nano_banana_2 --prompt ($base + $x.e) --image $ref --aspect_ratio 1:1 --resolution 2k --wait --json 2>&1 | Out-String
  $m = [regex]::Match($json, 'https?://[^"\s]+\.(png|jpg|jpeg|webp)')
  if ($m.Success) {
    $lines += "$($x.k)`t$($m.Value)"
    "  OK -> $($m.Value)"
  } else {
    $lines += "$($x.k)`tNOURL"
    "  NOURL. Head of output:"
    $json.Substring(0, [Math]::Min(500, $json.Length))
  }
}
$lines | Set-Content -Encoding utf8 "public\brand\wolf-urls.txt"
"DONE"

"""Genera le taglie icona PWA + favicon/apple-touch da public/icons/source.png."""
import os
from PIL import Image

base = os.path.join(os.path.dirname(__file__), "..")
src = Image.open(os.path.join(base, "public", "icons", "source.png")).convert("RGBA")

# square-crop centrale (per sicurezza)
w, h = src.size
s = min(w, h)
src = src.crop(((w - s) // 2, (h - s) // 2, (w - s) // 2 + s, (h - s) // 2 + s))

targets = [
    (512, "public/icons/icon-512.png"),
    (192, "public/icons/icon-192.png"),
    (512, "public/icons/icon-maskable-512.png"),
    (256, "src/app/icon.png"),        # favicon (convenzione Next)
    (180, "src/app/apple-icon.png"),  # apple touch icon
]
for size, rel in targets:
    out = os.path.join(base, *rel.split("/"))
    src.resize((size, size), Image.LANCZOS).save(out)
    print(f"{rel} -> {size}px")

# rimuovi il favicon Next di default e la sorgente
for f in ["src/app/favicon.ico", "public/icons/source.png"]:
    p = os.path.join(base, *f.split("/"))
    if os.path.exists(p):
        os.remove(p)
        print(f"removed {f}")
print("DONE")

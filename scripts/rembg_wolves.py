"""Rimuove lo sfondo dei 3 lupi (jpeg) -> PNG trasparenti ritagliati."""
import os
from PIL import Image
from rembg import remove

base = os.path.join(os.path.dirname(__file__), "..", "public", "brand")
for k in ("love", "money", "drunk"):
    src = os.path.join(base, f"wolf-{k}.jpeg")
    if not os.path.exists(src):
        print(f"{k}: manca {src}")
        continue
    img = Image.open(src).convert("RGBA")
    out = remove(img)
    bbox = out.getbbox()
    if bbox:
        out = out.crop(bbox)
    out.save(os.path.join(base, f"wolf-{k}.png"))
    os.remove(src)
    print(f"{k} -> wolf-{k}.png {out.size}")
print("DONE")

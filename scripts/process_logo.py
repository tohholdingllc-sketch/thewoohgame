"""Rimuove lo sfondo del logo (logo-source.png) -> public/brand/logo.png trasparente."""
import os
from PIL import Image
from rembg import remove

base = os.path.join(os.path.dirname(__file__), "..", "public", "brand")
src = os.path.join(base, "logo-source.png")
img = Image.open(src).convert("RGBA")
out = remove(
    img,
    alpha_matting=True,
    alpha_matting_foreground_threshold=245,
    alpha_matting_background_threshold=15,
    alpha_matting_erode_size=10,
)
bbox = out.getbbox()
if bbox:
    out = out.crop(bbox)
out.save(os.path.join(base, "logo.png"))
os.remove(src)
print(f"logo.png {out.size}")

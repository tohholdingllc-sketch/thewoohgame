"""Ottimizza le immagini servite: quantizza (flat cartoon) + ridimensiona + optimize."""
import os
from PIL import Image

ROOT = os.path.join(os.path.dirname(__file__), "..")
PUB = os.path.join(ROOT, "public")


def quantize(path, maxdim, colors=256):
    im = Image.open(path).convert("RGBA")
    if maxdim and max(im.size) > maxdim:
        im.thumbnail((maxdim, maxdim), Image.LANCZOS)
    im.quantize(colors=colors, method=Image.Quantize.FASTOCTREE).save(path, optimize=True)


def just_optimize(path, maxdim):
    im = Image.open(path).convert("RGBA")
    if maxdim and max(im.size) > maxdim:
        im.thumbnail((maxdim, maxdim), Image.LANCZOS)
    im.save(path, optimize=True)


jobs = []
jobs.append((os.path.join(PUB, "brand", "logo.png"), 640, "q"))
for k in ("love", "money", "drunk"):
    jobs.append((os.path.join(PUB, "brand", f"wolf-{k}.png"), 384, "q"))
adir = os.path.join(PUB, "avatars")
for fn in sorted(os.listdir(adir)):
    if fn.endswith(".png"):
        jobs.append((os.path.join(adir, fn), 224, "q"))
# icone: solo optimize (preserva il gradiente glossy)
for fn, md in [("icon-192.png", 192), ("icon-512.png", 512), ("icon-maskable-512.png", 512)]:
    jobs.append((os.path.join(PUB, "icons", fn), md, "o"))
for p, md in [(os.path.join(ROOT, "src", "app", "icon.png"), 256), (os.path.join(ROOT, "src", "app", "apple-icon.png"), 180)]:
    jobs.append((p, md, "o"))

before = after = 0
for path, md, mode in jobs:
    if not os.path.exists(path):
        continue
    b = os.path.getsize(path)
    (quantize if mode == "q" else just_optimize)(path, md)
    a = os.path.getsize(path)
    before += b
    after += a
    print(f"{os.path.basename(path):26s} {round(b/1024):5d}KB -> {round(a/1024):4d}KB")
print(f"TOTALE {round(before/1024)}KB -> {round(after/1024)}KB")

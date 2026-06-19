"""rembg sui raw avatar -> PNG trasparenti quadrati 256px in public/avatars/."""
import os
from PIL import Image
from rembg import remove

base = os.path.join(os.path.dirname(__file__), "..", "public", "avatars")
raw = os.path.join(base, "raw")
done = 0
for fn in sorted(os.listdir(raw)):
    if not fn.endswith(".png"):
        continue
    img = Image.open(os.path.join(raw, fn)).convert("RGBA")
    out = remove(img)
    w, h = out.size
    s = max(w, h)
    canvas = Image.new("RGBA", (s, s), (0, 0, 0, 0))
    canvas.paste(out, ((s - w) // 2, (s - h) // 2), out)
    canvas = canvas.resize((256, 256), Image.LANCZOS)
    canvas.save(os.path.join(base, fn))
    done += 1
print(f"DONE {done} avatar -> public/avatars/")

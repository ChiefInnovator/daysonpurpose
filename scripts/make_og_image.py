from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1200, 630
OUT = Path(__file__).resolve().parent.parent / "og-image.png"

img = Image.new("RGB", (W, H), (12, 14, 22))
draw = ImageDraw.Draw(img)

for y in range(H):
    t = y / H
    r = int(12 + (28 - 12) * t)
    g = int(14 + (20 - 14) * t)
    b = int(22 + (54 - 22) * t)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

accent = (244, 180, 80)
draw.rectangle([(0, 0), (W, 6)], fill=accent)

def load(size, bold=False):
    paths = [
        "/System/Library/Fonts/SFNS.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/System/Library/Fonts/Supplemental/Arial.ttf",
        "/Library/Fonts/Arial.ttf",
    ]
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()

title_font = load(84)
sub_font = load(40)
tag_font = load(28)

margin_x = 80

tag = "DAYS ON PURPOSE"
draw.text((margin_x, 140), tag, font=tag_font, fill=accent)

title = "Turn Time Into\nMeaningful Action"
draw.multiline_text((margin_x, 200), title, font=title_font, fill=(245, 245, 250), spacing=10)

sub = "Calculate your remaining purpose-days.\nFrame your life around clarity, focus, and momentum."
draw.multiline_text((margin_x, 430), sub, font=sub_font, fill=(180, 185, 200), spacing=6)

img.save(OUT, "PNG", optimize=True)
print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")

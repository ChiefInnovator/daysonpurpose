from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1200, 630
OUT = Path(__file__).resolve().parent.parent / "og-image.png"

BG_TOP = (12, 14, 22)
BG_BOTTOM = (28, 20, 54)
PANEL = (17, 22, 32)
CARD = (22, 28, 40)
CARD_STROKE = (40, 50, 68)
TEAL = (45, 212, 191)
ACCENT = (244, 180, 80)
WHITE = (245, 247, 250)
TITLE_WHITE = (245, 245, 250)
MUTED = (180, 185, 200)
SUB = (148, 159, 180)
DIM = (95, 108, 130)


def load(size):
    paths = [
        "/System/Library/Fonts/Supplemental/Arial Bold.ttf",
        "/System/Library/Fonts/Helvetica.ttc",
        "/Library/Fonts/Arial.ttf",
        "/System/Library/Fonts/SFNS.ttf",
    ]
    for p in paths:
        try:
            return ImageFont.truetype(p, size)
        except OSError:
            continue
    return ImageFont.load_default()


img = Image.new("RGB", (W, H))
draw = ImageDraw.Draw(img)
for y in range(H):
    t = y / H
    r = int(BG_TOP[0] + (BG_BOTTOM[0] - BG_TOP[0]) * t)
    g = int(BG_TOP[1] + (BG_BOTTOM[1] - BG_TOP[1]) * t)
    b = int(BG_TOP[2] + (BG_BOTTOM[2] - BG_TOP[2]) * t)
    draw.line([(0, y), (W, y)], fill=(r, g, b))

draw.rectangle([(0, 0), (W, 6)], fill=ACCENT)

tag_font = load(24)
title_font = load(58)
sub_font = load(24)
panel_title_font = load(22)
label_font = load(14)
num_font = load(44)
precise_font = load(13)

LEFT_X = 60
LEFT_W = 590

draw.text((LEFT_X, 130), "DAYS ON PURPOSE", font=tag_font, fill=ACCENT)

title = "Turn Time Into\nMeaningful Action"
draw.multiline_text(
    (LEFT_X, 170), title, font=title_font, fill=TITLE_WHITE, spacing=8
)

sub = "Calculate your remaining\npurpose-days. Frame your life around\nclarity, focus, and momentum."
draw.multiline_text(
    (LEFT_X, 360), sub, font=sub_font, fill=MUTED, spacing=6
)

PANEL_X0 = 680
PANEL_Y0 = 110
PANEL_X1 = W - 60
PANEL_Y1 = H - 90
draw.rounded_rectangle(
    [(PANEL_X0, PANEL_Y0), (PANEL_X1, PANEL_Y1)],
    radius=18,
    fill=PANEL,
    outline=TEAL,
    width=2,
)

PANEL_PAD = 24
draw.text(
    (PANEL_X0 + PANEL_PAD, PANEL_Y0 + 20),
    "Your Purpose Days",
    font=panel_title_font,
    fill=WHITE,
)
draw.text(
    (PANEL_X0 + PANEL_PAD, PANEL_Y0 + 48),
    "Approximate days for your journey",
    font=precise_font,
    fill=SUB,
)

cards = [
    ("DAYS", "7,906", "precise: 7906.30"),
    ("WEEKS", "1,129", "precise: 1129.47"),
    ("YEARS", "21.65", "precise: 21.65"),
    ("100-DAY BLOCKS", "79", "precise: 79.06"),
]

GRID_LEFT = PANEL_X0 + PANEL_PAD
GRID_TOP = PANEL_Y0 + 90
GRID_RIGHT = PANEL_X1 - PANEL_PAD
GRID_BOTTOM = PANEL_Y1 - PANEL_PAD
COLS = 2
ROWS = 2
GUTTER = 14
grid_w = GRID_RIGHT - GRID_LEFT
grid_h = GRID_BOTTOM - GRID_TOP
card_w = (grid_w - GUTTER * (COLS - 1)) / COLS
card_h = (grid_h - GUTTER * (ROWS - 1)) / ROWS

for i, (label, value, precise) in enumerate(cards):
    col = i % COLS
    row = i // COLS
    x0 = GRID_LEFT + col * (card_w + GUTTER)
    y0 = GRID_TOP + row * (card_h + GUTTER)
    x1 = x0 + card_w
    y1 = y0 + card_h
    draw.rounded_rectangle(
        [(x0, y0), (x1, y1)],
        radius=10,
        fill=CARD,
        outline=CARD_STROKE,
        width=1,
    )
    draw.text((x0 + 16, y0 + 14), label, font=label_font, fill=DIM)
    draw.text((x0 + 16, y0 + 36), value, font=num_font, fill=TEAL)
    draw.text((x0 + 16, y1 - 24), precise, font=precise_font, fill=DIM)

img.save(OUT, "PNG", optimize=True)
print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")

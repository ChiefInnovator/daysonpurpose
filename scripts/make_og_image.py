from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

W, H = 1200, 630
OUT = Path(__file__).resolve().parent.parent / "og-image.png"

BG = (11, 15, 23)
PANEL = (17, 22, 32)
CARD = (22, 28, 40)
CARD_STROKE = (40, 50, 68)
TEAL = (45, 212, 191)
WHITE = (245, 247, 250)
MUTED = (148, 159, 180)
DIM = (95, 108, 130)

img = Image.new("RGB", (W, H), BG)
draw = ImageDraw.Draw(img)


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


title_font = load(56)
sub_font = load(22)
label_font = load(16)
num_font = load(52)
precise_font = load(15)
callout_font = load(26)
fine_font = load(14)

PAD = 28
draw.rounded_rectangle(
    [(PAD, PAD), (W - PAD, H - PAD)],
    radius=22,
    fill=PANEL,
    outline=TEAL,
    width=2,
)

INNER_X = PAD + 44
INNER_TOP = PAD + 36

draw.text((INNER_X, INNER_TOP), "Your Purpose Days", font=title_font, fill=WHITE)
draw.text(
    (INNER_X, INNER_TOP + 78),
    "Approximate days for your journey, based on current averages.",
    font=sub_font,
    fill=MUTED,
)

cards = [
    ("DAYS", "7,906", "precise: 7906.30"),
    ("WEEKS", "1,129", "precise: 1129.47"),
    ("MONTHS", "259", "precise: 259.76"),
    ("YEARS", "21.65", "precise: 21.65"),
    ("40-DAY BLOCKS", "197", "precise: 197.66"),
    ("100-DAY BLOCKS", "79", "precise: 79.06"),
]

GRID_LEFT = INNER_X
GRID_TOP = INNER_TOP + 130
GRID_RIGHT = W - PAD - 44
GUTTER = 18
COLS = 3
ROWS = 2
grid_w = GRID_RIGHT - GRID_LEFT
card_w = (grid_w - GUTTER * (COLS - 1)) / COLS
card_h = 118

for i, (label, value, precise) in enumerate(cards):
    col = i % COLS
    row = i // COLS
    x0 = GRID_LEFT + col * (card_w + GUTTER)
    y0 = GRID_TOP + row * (card_h + GUTTER)
    x1 = x0 + card_w
    y1 = y0 + card_h
    draw.rounded_rectangle(
        [(x0, y0), (x1, y1)],
        radius=12,
        fill=CARD,
        outline=CARD_STROKE,
        width=1,
    )
    draw.text((x0 + 18, y0 + 14), label, font=label_font, fill=DIM)
    draw.text((x0 + 18, y0 + 36), value, font=num_font, fill=TEAL)
    draw.text((x0 + 18, y0 + 92), precise, font=precise_font, fill=DIM)

callout_y = GRID_TOP + ROWS * (card_h + GUTTER) + 18
draw.text(
    (INNER_X, callout_y),
    "What will you invest one day in today?",
    font=callout_font,
    fill=WHITE,
)
draw.text(
    (INNER_X, callout_y + 38),
    "daysonpurpose  \u00b7  calculate your remaining purpose-days",
    font=fine_font,
    fill=DIM,
)

img.save(OUT, "PNG", optimize=True)
print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")

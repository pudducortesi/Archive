#!/usr/bin/env python3
"""Generate beautiful placeholder images for the BAFF website."""

import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "images")
os.makedirs(OUT, exist_ok=True)

# Brand colors
RED = (204, 0, 0)
DARK_RED = (140, 0, 0)
BLACK = (26, 26, 26)
NEAR_BLACK = (15, 15, 18)
DARK_GREY = (35, 35, 40)
WHITE = (255, 255, 255)
WARM_GREY = (180, 175, 165)


def lerp_color(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def draw_gradient(draw, w, h, c1, c2, direction="vertical"):
    for i in range(h if direction == "vertical" else w):
        t = i / (h if direction == "vertical" else w)
        c = lerp_color(c1, c2, t)
        if direction == "vertical":
            draw.line([(0, i), (w, i)], fill=c)
        else:
            draw.line([(i, 0), (i, h)], fill=c)


def draw_radial_gradient(img, cx, cy, radius, c_inner, c_outer):
    pixels = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            dist = math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
            t = min(dist / radius, 1.0)
            t = t * t  # ease
            c = lerp_color(c_inner, c_outer, t)
            # blend with existing
            old = pixels[x, y][:3]
            alpha = 0.6
            blended = tuple(int(old[i] * (1 - alpha) + c[i] * alpha) for i in range(3))
            pixels[x, y] = blended


def add_noise(img, amount=8):
    pixels = img.load()
    w, h = img.size
    rng = random.Random(42)
    for y in range(0, h, 2):
        for x in range(0, w, 2):
            n = rng.randint(-amount, amount)
            r, g, b = pixels[x, y][:3]
            pixels[x, y] = (max(0, min(255, r + n)), max(0, min(255, g + n)), max(0, min(255, b + n)))


def draw_film_strip(draw, x, y, h, alpha_color):
    """Draw a subtle film strip element."""
    strip_w = 40
    hole_size = 8
    spacing = 16
    # Main strip
    draw.rectangle([x, y, x + strip_w, y + h], fill=alpha_color)
    # Sprocket holes
    for i in range(y + 8, y + h - 8, spacing):
        draw.rectangle([x + 4, i, x + 4 + hole_size, i + hole_size], fill=(0, 0, 0))
        draw.rectangle([x + strip_w - 4 - hole_size, i, x + strip_w - 4, i + hole_size], fill=(0, 0, 0))


def get_font(size):
    try:
        return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf", size)
    except:
        try:
            return ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf", size)
        except:
            return ImageFont.load_default()


def get_font_regular(size):
    try:
        return ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", size)
    except:
        try:
            return ImageFont.truetype("/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf", size)
        except:
            return ImageFont.load_default()


# ============================================================
# 1. HERO BACKGROUNDS
# ============================================================

def generate_hero_main():
    """Main homepage hero - dark cinematic with red accent light."""
    w, h = 1920, 1080
    img = Image.new("RGB", (w, h), NEAR_BLACK)
    draw = ImageDraw.Draw(img)

    # Dark gradient base
    draw_gradient(draw, w, h, (20, 18, 25), (8, 8, 12))

    # Subtle red glow from bottom-left
    for y in range(h):
        for x in range(0, w, 3):
            dist = math.sqrt((x - w * 0.2) ** 2 + (y - h * 0.8) ** 2)
            if dist < 800:
                t = 1 - dist / 800
                t = t * t * 0.15
                r, g, b = img.getpixel((x, y))
                img.putpixel((x, y), (min(255, int(r + 180 * t)), g, b))

    # Film strip decoration on right
    strip_color = (30, 28, 35)
    draw_film_strip(draw, w - 120, 0, h, strip_color)
    draw_film_strip(draw, w - 60, 0, h, (25, 23, 30))

    # Subtle horizontal lines (cinema feel)
    for y in range(0, h, 4):
        if random.Random(y).random() < 0.03:
            alpha = random.Random(y + 1).randint(5, 15)
            draw.line([(0, y), (w, y)], fill=(255, 255, 255, alpha))

    add_noise(img, 5)
    img.save(os.path.join(OUT, "hero-main.jpg"), quality=85)
    print("  hero-main.jpg")


def generate_hero_page():
    """Inner pages hero - dark cinematic."""
    w, h = 1920, 600
    img = Image.new("RGB", (w, h), NEAR_BLACK)
    draw = ImageDraw.Draw(img)

    # Gradient from dark to slightly lighter
    draw_gradient(draw, w, h, (25, 22, 30), (12, 12, 16))

    # Red accent line at bottom
    for x in range(w):
        t = abs(x - w / 2) / (w / 2)
        intensity = int((1 - t) * 40)
        for y_off in range(3):
            r, g, b = img.getpixel((x, h - 4 + y_off))
            img.putpixel((x, h - 4 + y_off), (min(255, r + intensity), g, b))

    add_noise(img, 4)
    img.save(os.path.join(OUT, "hero-page.jpg"), quality=85)
    print("  hero-page.jpg")


# ============================================================
# 2. NEWS / FEATURED IMAGES
# ============================================================

NEWS_THEMES = [
    ("Selezione Ufficiale", (180, 20, 20), (40, 10, 10)),
    ("Masterclass", (20, 40, 80), (10, 15, 35)),
    ("Biglietteria", (120, 80, 20), (40, 25, 8)),
    ("Frontiere", (60, 20, 80), (20, 8, 35)),
    ("Record iscrizioni", (20, 80, 60), (8, 30, 22)),
    ("Primi Passi", (80, 60, 20), (30, 22, 8)),
    ("Partnership", (40, 40, 80), (15, 15, 30)),
]


def generate_news_image(filename, theme_idx, w=800, h=500):
    """Generate a cinema-themed news image."""
    _, accent, dark = NEWS_THEMES[theme_idx % len(NEWS_THEMES)]

    img = Image.new("RGB", (w, h), dark)
    draw = ImageDraw.Draw(img)

    # Base gradient
    draw_gradient(draw, w, h, lerp_color(dark, (0, 0, 0), 0.3), dark)

    # Geometric cinema elements
    rng = random.Random(theme_idx * 17 + 3)

    # Abstract circles (like film reels)
    for _ in range(3):
        cx = rng.randint(w // 4, w * 3 // 4)
        cy = rng.randint(h // 4, h * 3 // 4)
        radius = rng.randint(60, 180)
        ring_color = lerp_color(accent, dark, 0.5)
        for r in range(radius, radius - 4, -1):
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=ring_color)

    # Light beam effect
    beam_x = rng.randint(w // 3, w * 2 // 3)
    for y in range(h):
        spread = y * 0.4
        for x in range(max(0, int(beam_x - spread)), min(w, int(beam_x + spread))):
            dist = abs(x - beam_x)
            t = 1 - dist / max(spread, 1)
            t = max(0, t) * 0.08
            r, g, b = img.getpixel((x, y))
            img.putpixel((x, y), (min(255, int(r + accent[0] * t)),
                                   min(255, int(g + accent[1] * t)),
                                   min(255, int(b + accent[2] * t))))

    add_noise(img, 6)
    img = img.filter(ImageFilter.GaussianBlur(radius=1))
    img.save(os.path.join(OUT, filename), quality=82)
    print(f"  {filename}")


# ============================================================
# 3. FILM POSTERS (portrait orientation)
# ============================================================

FILM_COLORS = [
    # Italian competition (warm, earthy, passionate)
    ((160, 40, 30), (30, 15, 12)),   # Deep red
    ((40, 50, 90), (12, 15, 30)),    # Dark blue
    ((100, 70, 30), (30, 20, 10)),   # Amber
    ((50, 70, 50), (15, 22, 15)),    # Forest
    ((80, 40, 70), (25, 12, 22)),    # Purple
    ((30, 60, 80), (10, 20, 28)),    # Teal
    # International competition (diverse, global)
    ((70, 30, 30), (22, 10, 10)),    # Burgundy
    ((30, 50, 70), (10, 18, 25)),    # Steel blue
    ((60, 60, 30), (20, 20, 10)),    # Olive
    ((70, 40, 60), (22, 13, 20)),    # Mauve
    ((40, 70, 40), (13, 23, 13)),    # Green
    ((80, 50, 20), (28, 18, 8)),     # Bronze
    # Classics (warm sepia, vintage)
    ((90, 70, 50), (30, 22, 16)),    # Sepia warm
    ((70, 60, 50), (22, 20, 16)),    # Sepia cool
    ((80, 65, 45), (26, 21, 14)),    # Vintage
    ((75, 55, 40), (24, 18, 13)),    # Old film
]


def generate_film_poster(filename, idx, title="", w=400, h=600):
    """Generate an artistic film poster placeholder."""
    accent, dark = FILM_COLORS[idx % len(FILM_COLORS)]

    img = Image.new("RGB", (w, h), dark)
    draw = ImageDraw.Draw(img)

    rng = random.Random(idx * 31 + 7)

    # Diagonal gradient
    for y in range(h):
        for x in range(0, w, 2):
            t = (x / w * 0.4 + y / h * 0.6)
            c = lerp_color(dark, accent, t * 0.7)
            img.putpixel((x, y), c)
            if x + 1 < w:
                img.putpixel((x + 1, y), c)

    # Abstract geometric shapes
    for _ in range(rng.randint(2, 5)):
        shape_type = rng.choice(["line", "circle", "rect"])
        shape_color = lerp_color(accent, (200, 200, 200), rng.uniform(0.2, 0.5))
        shape_color = tuple(max(0, min(255, c)) for c in shape_color)

        if shape_type == "line":
            x1, y1 = rng.randint(0, w), rng.randint(0, h)
            x2, y2 = rng.randint(0, w), rng.randint(0, h)
            draw.line([(x1, y1), (x2, y2)], fill=shape_color, width=rng.randint(1, 3))
        elif shape_type == "circle":
            cx, cy = rng.randint(0, w), rng.randint(0, h)
            r = rng.randint(30, 120)
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], outline=shape_color, width=2)
        else:
            x1, y1 = rng.randint(0, w), rng.randint(0, h)
            x2, y2 = x1 + rng.randint(40, 200), y1 + rng.randint(40, 200)
            draw.rectangle([x1, y1, x2, y2], outline=shape_color, width=1)

    # Spotlight / vignette
    for y in range(h):
        for x in range(0, w, 2):
            # Vignette effect
            dx = (x - w / 2) / (w / 2)
            dy = (y - h / 2) / (h / 2)
            vignette = 1 - (dx * dx + dy * dy) * 0.3
            vignette = max(0.4, min(1.0, vignette))
            r, g, b = img.getpixel((x, y))
            img.putpixel((x, y), (int(r * vignette), int(g * vignette), int(b * vignette)))
            if x + 1 < w:
                r2, g2, b2 = img.getpixel((x + 1, y))
                img.putpixel((x + 1, y), (int(r2 * vignette), int(g2 * vignette), int(b2 * vignette)))

    # Film title text at bottom
    if title:
        font = get_font(20)
        font_sm = get_font_regular(13)
        # Dark overlay at bottom
        for y_bar in range(h - 100, h):
            t = (y_bar - (h - 100)) / 100
            for x_bar in range(w):
                r, g, b = img.getpixel((x_bar, y_bar))
                darken = 0.3 + 0.7 * (1 - t * 0.5)
                img.putpixel((x_bar, y_bar), (int(r * (1 - t * 0.6)), int(g * (1 - t * 0.6)), int(b * (1 - t * 0.6))))

        draw = ImageDraw.Draw(img)  # refresh draw
        bbox = draw.textbbox((0, 0), title, font=font)
        tw = bbox[2] - bbox[0]
        draw.text(((w - tw) // 2, h - 55), title, fill=(240, 240, 240), font=font)

    add_noise(img, 5)
    img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
    img.save(os.path.join(OUT, filename), quality=82)
    print(f"  {filename}")


# ============================================================
# 4. PORTRAIT IMAGES
# ============================================================

PORTRAIT_PALETTES = [
    ((100, 30, 25), (30, 12, 10)),   # Warm dark
    ((30, 50, 80), (10, 18, 28)),    # Cool blue
    ((60, 50, 40), (20, 18, 14)),    # Neutral warm
    ((50, 30, 60), (18, 10, 22)),    # Purple
    ((40, 60, 50), (14, 22, 18)),    # Sage
    ((70, 50, 30), (24, 18, 10)),    # Amber warm
    ((35, 45, 65), (12, 16, 24)),    # Steel
    ((55, 35, 45), (20, 12, 16)),    # Mauve
    ((45, 55, 45), (16, 20, 16)),    # Green
    ((65, 45, 35), (22, 16, 12)),    # Copper
    ((40, 40, 60), (14, 14, 22)),    # Indigo
    ((50, 40, 30), (18, 14, 10)),    # Brown
    ((60, 30, 40), (22, 10, 14)),    # Rose
    ((35, 55, 55), (12, 20, 20)),    # Teal
    ((55, 45, 50), (20, 16, 18)),    # Dusty
    ((45, 35, 55), (16, 12, 20)),    # Violet
    ((60, 55, 35), (22, 20, 12)),    # Gold
    ((40, 50, 40), (14, 18, 14)),    # Forest
    ((50, 35, 35), (18, 12, 12)),    # Brick
    ((35, 40, 55), (12, 14, 20)),    # Navy
]


def generate_portrait(filename, initials, idx, w=400, h=500):
    """Generate a professional portrait placeholder with initials."""
    accent, dark = PORTRAIT_PALETTES[idx % len(PORTRAIT_PALETTES)]

    img = Image.new("RGB", (w, h), dark)
    draw = ImageDraw.Draw(img)

    # Gradient background
    for y in range(h):
        t = y / h
        c = lerp_color(lerp_color(dark, accent, 0.3), dark, t * 0.8)
        draw.line([(0, y), (w, y)], fill=c)

    # Subtle circular highlight (where face would be)
    cx, cy = w // 2, h // 2 - 30
    for y in range(h):
        for x in range(0, w, 2):
            dist = math.sqrt((x - cx) ** 2 + (y - cy) ** 2)
            if dist < 180:
                t = 1 - dist / 180
                t = t * t * 0.25
                r, g, b = img.getpixel((x, y))
                img.putpixel((x, y), (min(255, int(r + accent[0] * t * 2)),
                                       min(255, int(g + accent[1] * t * 2)),
                                       min(255, int(b + accent[2] * t * 2))))
                if x + 1 < w:
                    r2, g2, b2 = img.getpixel((x + 1, y))
                    img.putpixel((x + 1, y), (min(255, int(r2 + accent[0] * t * 2)),
                                               min(255, int(g2 + accent[1] * t * 2)),
                                               min(255, int(b2 + accent[2] * t * 2))))

    # Large initials in center
    font_large = get_font(72)
    bbox = draw.textbbox((0, 0), initials, font=font_large)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    text_color = lerp_color(accent, (220, 220, 220), 0.6)
    draw.text(((w - tw) // 2, (h - th) // 2 - 20), initials, fill=text_color, font=font_large)

    # Subtle border
    draw.rectangle([0, 0, w - 1, h - 1], outline=lerp_color(accent, dark, 0.7), width=1)

    add_noise(img, 4)
    img.save(os.path.join(OUT, filename), quality=82)
    print(f"  {filename}")


# ============================================================
# 5. PAST EDITION IMAGES
# ============================================================

def generate_edition_image(filename, year, idx, w=600, h=400):
    """Generate a past edition atmospheric image."""
    rng = random.Random(year)

    # Each year gets a unique color
    hue_shift = (year - 2015) * 30
    r = int(50 + 30 * math.sin(math.radians(hue_shift)))
    g = int(30 + 20 * math.sin(math.radians(hue_shift + 120)))
    b = int(40 + 25 * math.sin(math.radians(hue_shift + 240)))
    accent = (r, g, b)
    dark = (r // 3, g // 3, b // 3)

    img = Image.new("RGB", (w, h), dark)
    draw = ImageDraw.Draw(img)

    # Gradient
    draw_gradient(draw, w, h, accent, dark)

    # Year text large and faded
    font_year = get_font(120)
    bbox = draw.textbbox((0, 0), str(year), font=font_year)
    tw = bbox[2] - bbox[0]
    th = bbox[3] - bbox[1]
    year_color = lerp_color(accent, (180, 180, 180), 0.4)
    draw.text(((w - tw) // 2, (h - th) // 2 - 10), str(year), fill=year_color, font=font_year)

    # Film strip decoration
    strip_color = lerp_color(dark, (50, 50, 55), 0.5)
    draw_film_strip(draw, 15, 0, h, strip_color)

    # Vignette
    for y in range(h):
        for x in range(0, w, 3):
            dx = (x - w / 2) / (w / 2)
            dy = (y - h / 2) / (h / 2)
            v = 1 - (dx * dx + dy * dy) * 0.35
            v = max(0.3, min(1.0, v))
            r, g, b = img.getpixel((x, y))
            c = (int(r * v), int(g * v), int(b * v))
            img.putpixel((x, y), c)
            if x + 1 < w:
                img.putpixel((x + 1, y), c)
            if x + 2 < w:
                img.putpixel((x + 2, y), c)

    add_noise(img, 5)
    img = img.filter(ImageFilter.GaussianBlur(radius=0.8))
    img.save(os.path.join(OUT, filename), quality=82)
    print(f"  {filename}")


# ============================================================
# MAIN — Generate everything
# ============================================================

if __name__ == "__main__":
    print("Generating BAFF website images...")
    print()

    # 1. Hero backgrounds
    print("[1/5] Hero backgrounds...")
    generate_hero_main()
    generate_hero_page()

    # 2. News images
    print("\n[2/5] News images...")
    generate_news_image("news-featured.jpg", 0, 800, 500)
    for i in range(6):
        generate_news_image(f"news-{i+1}.jpg", i + 1, 600, 400)

    # 3. Film posters
    print("\n[3/5] Film posters...")
    films_it = [
        "La luce che resta", "Cenere e vento", "Nessuno lo sapra",
        "I giorni del silenzio", "Dove comincia il mare", "L'ultimo treno"
    ]
    films_int = [
        "Les heures perdues", "La orilla del rio", "Baram-ui sigan",
        "Die stille Mauer", "El ultimo verano", "Hikari no kawa"
    ]
    films_classic = ["Accattone", "I pugni in tasca", "Prima della rivoluzione", "Ossessione"]

    for i, title in enumerate(films_it):
        generate_film_poster(f"film-it-{i+1}.jpg", i, title)
    for i, title in enumerate(films_int):
        generate_film_poster(f"film-int-{i+1}.jpg", i + 6, title)
    for i, title in enumerate(films_classic):
        generate_film_poster(f"film-classic-{i+1}.jpg", i + 12, title)

    # 4. Portraits
    print("\n[4/5] Portraits...")

    # Guests
    guests = [
        ("guest-main.jpg", "MF", 0),   # Marco Ferretti
        ("guest-1.jpg", "CB", 1),       # Chiara Beltrame
        ("guest-2.jpg", "LS", 2),       # Luca Santoro
        ("guest-3.jpg", "IM", 3),       # Isabelle Moreau
        ("guest-4.jpg", "RM", 4),       # Roberto Mancuso
        ("guest-5.jpg", "EV", 5),       # Elena Vicari
        ("guest-6.jpg", "TL", 6),       # Thomas Lindqvist
        ("guest-7.jpg", "GF", 7),       # Giulia Ferrara
        ("guest-8.jpg", "DO", 8),       # David Okonkwo
    ]
    for fname, initials, idx in guests:
        generate_portrait(fname, initials, idx)

    # Jury
    jury = [
        ("jury-president.jpg", "LM", 9),   # Lucia Mancini
        ("jury-it-1.jpg", "MR", 10),       # Marco Rinaldi
        ("jury-it-2.jpg", "SB", 11),       # Sofia Bellini
        ("jury-it-3.jpg", "GF", 12),       # Giulia Ferretti
        ("jury-it-4.jpg", "AB", 13),       # Alessandro Bianchi
        ("jury-it-5.jpg", "CV", 14),       # Chiara Valentini
        ("jury-int-1.jpg", "HD", 15),      # Helene Duval
        ("jury-int-2.jpg", "CR", 16),      # Carlos Ruiz
        ("jury-int-3.jpg", "AK", 17),      # Anna Kowalski
        ("jury-int-4.jpg", "JN", 18),      # James Nwosu
        ("jury-int-5.jpg", "YT", 19),      # Yuki Tanaka
    ]
    for fname, initials, idx in jury:
        generate_portrait(fname, initials, idx)

    # 5. Past editions
    print("\n[5/5] Past editions...")
    editions = [(2025, 0), (2024, 1), (2022, 2), (2017, 3), (2016, 4)]
    for year, idx in editions:
        generate_edition_image(f"edition-{year}.jpg", year, idx)

    print(f"\nDone! Generated images in {OUT}/")
    print(f"Total files: {len(os.listdir(OUT))}")

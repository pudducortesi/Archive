#!/usr/bin/env python3
"""Generate beautiful, vibrant placeholder images for the BAFF website."""

import os
import math
import random
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUT = os.path.join(os.path.dirname(__file__), "images")
os.makedirs(OUT, exist_ok=True)

RED = (204, 0, 0)


def lerp(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))


def get_font(size):
    for p in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Bold.ttf",
    ]:
        try:
            return ImageFont.truetype(p, size)
        except:
            pass
    return ImageFont.load_default()


def get_font_light(size):
    for p in [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans-ExtraLight.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/share/fonts/truetype/liberation/LiberationSans-Regular.ttf",
    ]:
        try:
            return ImageFont.truetype(p, size)
        except:
            pass
    return ImageFont.load_default()


def add_grain(img, amount=12, seed=42):
    """Add film grain texture."""
    rng = random.Random(seed)
    px = img.load()
    w, h = img.size
    for y in range(h):
        for x in range(w):
            n = rng.randint(-amount, amount)
            r, g, b = px[x, y][:3]
            px[x, y] = (
                max(0, min(255, r + n)),
                max(0, min(255, g + n)),
                max(0, min(255, b + n)),
            )


def vignette(img, strength=0.5):
    """Apply vignette darkening at edges."""
    px = img.load()
    w, h = img.size
    cx, cy = w / 2, h / 2
    max_dist = math.sqrt(cx * cx + cy * cy)
    for y in range(h):
        for x in range(w):
            d = math.sqrt((x - cx) ** 2 + (y - cy) ** 2) / max_dist
            factor = 1.0 - d * d * strength
            factor = max(0.15, factor)
            r, g, b = px[x, y][:3]
            px[x, y] = (int(r * factor), int(g * factor), int(b * factor))


def draw_smooth_gradient(img, c1, c2, angle_deg=0):
    """Draw a smooth gradient at any angle."""
    w, h = img.size
    px = img.load()
    angle = math.radians(angle_deg)
    cos_a, sin_a = math.cos(angle), math.sin(angle)
    # project corners to find range
    corners = [(0, 0), (w, 0), (0, h), (w, h)]
    projs = [x * cos_a + y * sin_a for x, y in corners]
    p_min, p_max = min(projs), max(projs)
    for y in range(h):
        for x in range(w):
            p = x * cos_a + y * sin_a
            t = (p - p_min) / (p_max - p_min)
            px[x, y] = lerp(c1, c2, t)


def draw_bokeh(img, count=15, seed=0):
    """Draw soft bokeh circles (bright, blurred, overlapping)."""
    rng = random.Random(seed)
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for _ in range(count):
        cx = rng.randint(-50, w + 50)
        cy = rng.randint(-50, h + 50)
        r = rng.randint(20, 120)
        alpha = rng.randint(15, 50)
        color = (
            rng.randint(200, 255),
            rng.randint(180, 255),
            rng.randint(150, 255),
            alpha,
        )
        draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=25))
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))


def draw_light_rays(img, source_x, source_y, count=8, seed=0):
    """Draw radiating light rays from a point."""
    rng = random.Random(seed)
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for i in range(count):
        angle = rng.uniform(0, 2 * math.pi)
        length = rng.randint(200, max(w, h))
        spread = rng.uniform(0.03, 0.12)
        ex1 = source_x + length * math.cos(angle - spread)
        ey1 = source_y + length * math.sin(angle - spread)
        ex2 = source_x + length * math.cos(angle + spread)
        ey2 = source_y + length * math.sin(angle + spread)
        alpha = rng.randint(8, 25)
        draw.polygon(
            [(source_x, source_y), (ex1, ey1), (ex2, ey2)],
            fill=(255, 240, 200, alpha),
        )
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=15))
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))


def draw_abstract_shapes(img, seed=0, count=6):
    """Draw abstract geometric shapes."""
    rng = random.Random(seed)
    w, h = img.size
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    draw = ImageDraw.Draw(overlay)
    for _ in range(count):
        shape = rng.choice(["circle", "ring", "line", "triangle"])
        alpha = rng.randint(20, 60)
        color = (
            rng.randint(180, 255),
            rng.randint(160, 255),
            rng.randint(140, 255),
            alpha,
        )
        if shape == "circle":
            cx, cy = rng.randint(0, w), rng.randint(0, h)
            r = rng.randint(20, 100)
            draw.ellipse([cx - r, cy - r, cx + r, cy + r], fill=color)
        elif shape == "ring":
            cx, cy = rng.randint(0, w), rng.randint(0, h)
            r = rng.randint(40, 150)
            draw.ellipse(
                [cx - r, cy - r, cx + r, cy + r],
                outline=color,
                width=rng.randint(2, 5),
            )
        elif shape == "line":
            x1, y1 = rng.randint(0, w), rng.randint(0, h)
            x2, y2 = rng.randint(0, w), rng.randint(0, h)
            draw.line([(x1, y1), (x2, y2)], fill=color, width=rng.randint(1, 4))
        elif shape == "triangle":
            pts = [(rng.randint(0, w), rng.randint(0, h)) for _ in range(3)]
            draw.polygon(pts, outline=color, fill=None)
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=3))
    img.paste(Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB"))


# ============================================================
# HERO BACKGROUNDS
# ============================================================


def gen_hero_main():
    w, h = 1920, 1080
    img = Image.new("RGB", (w, h))
    draw_smooth_gradient(img, (15, 8, 30), (40, 5, 5), angle_deg=135)
    # warm glow
    draw_light_rays(img, w // 3, h, count=12, seed=1)
    draw_bokeh(img, count=20, seed=2)
    # film strip on right edge
    draw = ImageDraw.Draw(img)
    for i in range(0, h, 16):
        draw.rectangle([w - 80, i, w - 42, i + 10], fill=(20, 15, 25))
        draw.rectangle([w - 38, i, w, i + 10], fill=(20, 15, 25))
    vignette(img, 0.7)
    add_grain(img, 8, 1)
    img.save(os.path.join(OUT, "hero-main.jpg"), quality=88)
    print("  hero-main.jpg")


def gen_hero_page():
    w, h = 1920, 600
    img = Image.new("RGB", (w, h))
    draw_smooth_gradient(img, (20, 10, 35), (50, 8, 12), angle_deg=160)
    draw_bokeh(img, count=12, seed=3)
    draw_light_rays(img, w // 2, 0, count=6, seed=4)
    vignette(img, 0.6)
    add_grain(img, 6, 2)
    img.save(os.path.join(OUT, "hero-page.jpg"), quality=88)
    print("  hero-page.jpg")


# ============================================================
# NEWS IMAGES — vibrant, each with unique color
# ============================================================

NEWS_PALETTES = [
    ((180, 30, 30), (60, 10, 40), 120),   # Warm red
    ((30, 60, 120), (10, 20, 50), 45),     # Deep blue
    ((140, 90, 20), (50, 25, 8), 170),     # Golden amber
    ((80, 20, 100), (25, 8, 40), 100),     # Purple
    ((20, 100, 80), (8, 35, 30), 60),      # Teal
    ((100, 60, 20), (35, 20, 8), 140),     # Bronze
    ((50, 50, 100), (18, 15, 40), 30),     # Indigo
]


def gen_news(filename, idx, w=800, h=500):
    c1, c2, angle = NEWS_PALETTES[idx % len(NEWS_PALETTES)]
    img = Image.new("RGB", (w, h))
    draw_smooth_gradient(img, c1, c2, angle_deg=angle)
    draw_bokeh(img, count=10 + idx * 2, seed=idx * 7)
    draw_light_rays(img, w // 2, h // 3, count=5, seed=idx * 11)
    draw_abstract_shapes(img, seed=idx * 13, count=4)
    vignette(img, 0.5)
    add_grain(img, 10, idx)
    img = img.filter(ImageFilter.GaussianBlur(radius=0.5))
    img.save(os.path.join(OUT, filename), quality=84)
    print(f"  {filename}")


# ============================================================
# FILM POSTERS — artistic, portrait, unique per film
# ============================================================

FILM_PALETTES = [
    # Italian
    ((200, 50, 30), (40, 12, 15), 130),
    ((40, 70, 140), (12, 20, 45), 50),
    ((160, 100, 30), (45, 28, 10), 165),
    ((60, 90, 60), (18, 28, 18), 90),
    ((120, 50, 90), (35, 15, 28), 110),
    ((40, 100, 130), (12, 30, 40), 70),
    # International
    ((130, 40, 50), (38, 12, 15), 140),
    ((50, 70, 110), (15, 22, 35), 55),
    ((90, 90, 40), (28, 28, 12), 95),
    ((110, 50, 80), (32, 15, 24), 120),
    ((50, 100, 60), (15, 32, 18), 80),
    ((130, 70, 30), (40, 22, 10), 150),
    # Classics — warm sepia tones
    ((160, 130, 90), (50, 38, 25), 135),
    ((140, 110, 80), (42, 32, 22), 45),
    ((150, 120, 85), (46, 35, 24), 120),
    ((135, 105, 75), (40, 30, 20), 60),
]


def gen_film_poster(filename, idx, title, w=400, h=600):
    c1, c2, angle = FILM_PALETTES[idx % len(FILM_PALETTES)]
    img = Image.new("RGB", (w, h))
    draw_smooth_gradient(img, c1, c2, angle_deg=angle)
    draw_bokeh(img, count=8, seed=idx * 17 + 3)
    draw_abstract_shapes(img, seed=idx * 23 + 5, count=5)
    draw_light_rays(img, w // 2, h // 4, count=4, seed=idx * 19)
    vignette(img, 0.55)

    # Title at bottom with dark band
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    for yy in range(h - 90, h):
        a = int(180 * ((yy - (h - 90)) / 90))
        d.line([(0, yy), (w, yy)], fill=(0, 0, 0, a))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

    draw = ImageDraw.Draw(img)
    font = get_font(22)
    bbox = draw.textbbox((0, 0), title, font=font)
    tw = bbox[2] - bbox[0]
    draw.text(
        ((w - tw) // 2, h - 45),
        title,
        fill=(255, 255, 255),
        font=font,
    )

    # Small "BAFF 2026" badge
    font_sm = get_font_light(11)
    draw.text((15, 15), "BAFF 2026", fill=(255, 255, 255, 180), font=font_sm)

    add_grain(img, 8, idx + 100)
    img.save(os.path.join(OUT, filename), quality=84)
    print(f"  {filename}")


# ============================================================
# PORTRAITS — vibrant backgrounds with large initials
# ============================================================

PORTRAIT_PALETTES = [
    ((180, 60, 40), (55, 15, 12), 135),    # Terracotta
    ((45, 80, 140), (12, 25, 45), 50),      # Ocean blue
    ((120, 90, 50), (38, 28, 15), 110),     # Warm earth
    ((90, 45, 110), (28, 14, 35), 70),      # Amethyst
    ((55, 110, 80), (16, 34, 24), 130),     # Emerald
    ((140, 80, 35), (42, 24, 10), 160),     # Copper
    ((50, 65, 120), (15, 20, 38), 40),      # Slate blue
    ((110, 55, 75), (34, 16, 22), 100),     # Dusty rose
    ((65, 100, 65), (20, 32, 20), 85),      # Sage green
    ((130, 70, 45), (40, 20, 13), 145),     # Sienna
    ((60, 60, 110), (18, 18, 35), 55),      # Twilight
    ((100, 50, 50), (30, 15, 15), 120),     # Brick
    ((75, 45, 95), (22, 13, 28), 75),       # Plum
    ((50, 90, 100), (15, 28, 30), 65),      # Teal
    ((95, 75, 55), (28, 22, 16), 95),       # Hazelnut
    ((70, 55, 100), (20, 16, 30), 50),      # Iris
    ((120, 95, 45), (36, 28, 13), 140),     # Goldenrod
    ((55, 85, 60), (16, 26, 18), 80),       # Forest
    ((100, 55, 55), (30, 16, 16), 110),     # Clay
    ((50, 70, 95), (15, 20, 28), 60),       # Steel
]


def gen_portrait(filename, initials, idx, w=400, h=500):
    c1, c2, angle = PORTRAIT_PALETTES[idx % len(PORTRAIT_PALETTES)]
    img = Image.new("RGB", (w, h))
    draw_smooth_gradient(img, c1, c2, angle_deg=angle)

    # Rich light effect in center-upper area
    draw_light_rays(img, w // 2, h // 3, count=6, seed=idx * 31)
    draw_bokeh(img, count=8, seed=idx * 37)

    # Bright circular glow where "face" would be
    overlay = Image.new("RGBA", (w, h), (0, 0, 0, 0))
    d = ImageDraw.Draw(overlay)
    cx, cy = w // 2, h * 2 // 5
    for r in range(180, 0, -1):
        a = int(35 * (1 - r / 180))
        bright = lerp(c1, (255, 240, 220), 0.4)
        d.ellipse(
            [cx - r, cy - r, cx + r, cy + r],
            fill=(bright[0], bright[1], bright[2], a),
        )
    overlay = overlay.filter(ImageFilter.GaussianBlur(radius=30))
    img = Image.alpha_composite(img.convert("RGBA"), overlay).convert("RGB")

    vignette(img, 0.5)

    # Large initials with shadow
    draw = ImageDraw.Draw(img)
    font = get_font(90)
    bbox = draw.textbbox((0, 0), initials, font=font)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx, ty = (w - tw) // 2, (h - th) // 2 - 15
    # shadow
    draw.text((tx + 3, ty + 3), initials, fill=(0, 0, 0, 80), font=font)
    # main
    draw.text((tx, ty), initials, fill=(255, 255, 255), font=font)

    add_grain(img, 8, idx + 200)
    img.save(os.path.join(OUT, filename), quality=84)
    print(f"  {filename}")


# ============================================================
# EDITIONS — atmospheric with bold year
# ============================================================


def gen_edition(filename, year, idx, w=600, h=400):
    rng = random.Random(year)
    h_shift = (year - 2014) * 45
    r = int(80 + 60 * math.sin(math.radians(h_shift)))
    g = int(50 + 40 * math.sin(math.radians(h_shift + 120)))
    b = int(70 + 50 * math.sin(math.radians(h_shift + 240)))
    c1 = (r, g, b)
    c2 = (r // 3, g // 3, b // 3)

    img = Image.new("RGB", (w, h))
    draw_smooth_gradient(img, c1, c2, angle_deg=rng.randint(30, 160))
    draw_bokeh(img, count=10, seed=year)
    draw_light_rays(img, w // 2, h // 2, count=5, seed=year + 1)
    vignette(img, 0.45)

    # Bold year
    draw = ImageDraw.Draw(img)
    font_big = get_font(140)
    txt = str(year)
    bbox = draw.textbbox((0, 0), txt, font=font_big)
    tw, th = bbox[2] - bbox[0], bbox[3] - bbox[1]
    tx, ty = (w - tw) // 2, (h - th) // 2 - 10
    draw.text((tx + 3, ty + 3), txt, fill=(0, 0, 0, 50), font=font_big)
    draw.text((tx, ty), txt, fill=(255, 255, 255), font=font_big)

    # "BAFF" subtitle
    font_sm = get_font_light(16)
    bbox2 = draw.textbbox((0, 0), "B.A. FILM FESTIVAL", font=font_sm)
    tw2 = bbox2[2] - bbox2[0]
    draw.text(
        ((w - tw2) // 2, ty + th + 8),
        "B.A. FILM FESTIVAL",
        fill=(255, 255, 255, 200),
        font=font_sm,
    )

    add_grain(img, 8, year + 300)
    img.save(os.path.join(OUT, filename), quality=84)
    print(f"  {filename}")


# ============================================================
# MAIN
# ============================================================

if __name__ == "__main__":
    print("Generating BAFF website images (v2 — vibrant)...\n")

    print("[1/5] Hero backgrounds...")
    gen_hero_main()
    gen_hero_page()

    print("\n[2/5] News images...")
    gen_news("news-featured.jpg", 0, 800, 500)
    for i in range(6):
        gen_news(f"news-{i+1}.jpg", i + 1, 600, 400)

    print("\n[3/5] Film posters...")
    films_it = [
        "La luce che resta",
        "Cenere e vento",
        "Nessuno lo saprà",
        "I giorni del silenzio",
        "Dove comincia il mare",
        "L'ultimo treno",
    ]
    films_int = [
        "Les heures perdues",
        "La orilla del río",
        "Baram-ui sigan",
        "Die stille Mauer",
        "El último verano",
        "Hikari no kawa",
    ]
    films_classic = [
        "Accattone",
        "I pugni in tasca",
        "Prima della rivoluzione",
        "Ossessione",
    ]
    for i, t in enumerate(films_it):
        gen_film_poster(f"film-it-{i+1}.jpg", i, t)
    for i, t in enumerate(films_int):
        gen_film_poster(f"film-int-{i+1}.jpg", i + 6, t)
    for i, t in enumerate(films_classic):
        gen_film_poster(f"film-classic-{i+1}.jpg", i + 12, t)

    print("\n[4/5] Portraits...")
    guests = [
        ("guest-main.jpg", "MF", 0),
        ("guest-1.jpg", "CB", 1),
        ("guest-2.jpg", "LS", 2),
        ("guest-3.jpg", "IM", 3),
        ("guest-4.jpg", "RM", 4),
        ("guest-5.jpg", "EV", 5),
        ("guest-6.jpg", "TL", 6),
        ("guest-7.jpg", "GF", 7),
        ("guest-8.jpg", "DO", 8),
    ]
    jury = [
        ("jury-president.jpg", "LM", 9),
        ("jury-it-1.jpg", "MR", 10),
        ("jury-it-2.jpg", "SB", 11),
        ("jury-it-3.jpg", "GF", 12),
        ("jury-it-4.jpg", "AB", 13),
        ("jury-it-5.jpg", "CV", 14),
        ("jury-int-1.jpg", "HD", 15),
        ("jury-int-2.jpg", "CR", 16),
        ("jury-int-3.jpg", "AK", 17),
        ("jury-int-4.jpg", "JN", 18),
        ("jury-int-5.jpg", "YT", 19),
    ]
    for f, ini, i in guests:
        gen_portrait(f, ini, i)
    for f, ini, i in jury:
        gen_portrait(f, ini, i)

    print("\n[5/5] Past editions...")
    for year, idx in [(2025, 0), (2024, 1), (2022, 2), (2017, 3), (2016, 4)]:
        gen_edition(f"edition-{year}.jpg", year, idx)

    print(f"\nDone! {len([f for f in os.listdir(OUT) if f.endswith('.jpg')])} images in {OUT}/")

from PIL import Image
import os
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
shots = os.path.join(ROOT, "tools", "shots")
prev = os.path.join(ROOT, "preview")
os.makedirs(prev, exist_ok=True)
plan = [
    ("home-hero.png", "01-home-hero.jpg", 1400),
    ("home-welcome.png", "02-home-welcome.jpg", 1400),
    ("home-rooms.png", "03-home-accommodation.jpg", 1400),
    ("home-features.png", "04-home-services.jpg", 1400),
    ("home-gallery-band.png", "05-home-gallery-band.jpg", 1400),
    ("home-footer.png", "06-home-footer.jpg", 1400),
    ("room-full.png", "07-room-page.jpg", 1000),
    ("gallery-full.png", "08-gallery-page.jpg", 1000),
    ("gallery-lightbox.png", "09-gallery-lightbox.jpg", 1400),
    ("contact-full.png", "10-contact-page.jpg", 1000),
    ("location-full.png", "11-location-page.jpg", 1000),
    ("credits-full.png", "12-photo-credits.jpg", 1000),
    ("404-full.png", "13-404.jpg", 1400),
    ("home-hero-mobile.png", "14-mobile-home.jpg", 414),
    ("mobile-menu.png", "15-mobile-menu.jpg", 414),
    ("room-mobile.png", "16-mobile-room.jpg", 414),
]
for src, dest, width in plan:
    p = os.path.join(shots, src)
    if not os.path.exists(p):
        print("missing", src); continue
    im = Image.open(p).convert("RGB")
    w, h = im.size
    if w > width:
        im = im.resize((width, int(h * width / w)), Image.LANCZOS)
    if im.height > 2400:
        im = im.resize((int(im.width * 2400 / im.height), 2400), Image.LANCZOS)
    im.save(os.path.join(prev, dest), "JPEG", quality=86, optimize=True, progressive=True)
    print(dest, im.size)

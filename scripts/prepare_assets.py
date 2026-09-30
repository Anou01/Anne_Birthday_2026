"""Build local delivery copies; never modify the supplied originals."""
from pathlib import Path
from zipfile import ZipFile
import json
import shutil
import subprocess
from PIL import Image, ImageOps, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'public' / 'assets'
(OUT / 'models').mkdir(parents=True, exist_ok=True)
(OUT / 'photos').mkdir(parents=True, exist_ok=True)
with ZipFile(ROOT / 'cake/source/Cake_333.zip') as archive:
    for source, target in [('Cake_333/Cakee.obj', 'cake.obj'), ('Cake_333/Cake_3.png', 'cake.png')]:
        (OUT / 'models' / target).write_bytes(archive.read(source))
shutil.copy2(ROOT / 'letter/source/PaperAndInk.fbx', OUT / 'models/letter.fbx')
shutil.copy2(ROOT / 'letter/textures/PaperAndInk_Texture.png', OUT / 'models/letter.png')
# Keep only the typing part (2.35-9.0 s) of the supplied keyboard recording.
# src/audio.js lists the keystroke onsets measured in this exact cut.
if shutil.which('ffmpeg'):
    (OUT / 'audio').mkdir(exist_ok=True)
    subprocess.run(['ffmpeg', '-hide_banner', '-loglevel', 'error', '-y', '-ss', '2.35', '-to', '9.0',
                    '-i', str(ROOT / 'music/Sound_keybord.mp3'), '-ac', '1', '-ar', '44100', '-b:a', '128k',
                    str(OUT / 'audio/keys.mp3')], check=True)
else:
    print('ffmpeg not found; kept the existing public/assets/audio/keys.mp3')
(OUT / 'audio').mkdir(exist_ok=True)
shutil.copy2(ROOT / 'music/soulprodmusic-happy-birthday-piano-508359.mp3', OUT / 'audio/birthday-piano.mp3')
shutil.copy2(ROOT / 'Bless.txt', OUT / 'letter.txt')
shutil.copy2(ROOT / 'Name.txt', OUT / 'name.txt')
sources = sorted((ROOT / 'photo/Couple').glob('*')) + [ROOT / 'photo/naughty.jpg']
manifest = []
sheet = Image.new('RGB', (1000, 260 * 4), '#f6eee4')
draw = ImageDraw.Draw(sheet)
for index, source in enumerate(sources):
    with Image.open(source) as original:
        photo = ImageOps.exif_transpose(original).convert('RGB')
        photo.thumbnail((1500, 1500), Image.Resampling.LANCZOS)
        target = f'memory-{index + 1:02d}.webp'
        photo.save(OUT / 'photos' / target, 'WEBP', quality=86, method=6)
        manifest.append({'src': f'assets/photos/{target}', 'width': photo.width, 'height': photo.height, 'alt': f'Our memory {index + 1}'})
        thumb = ImageOps.contain(photo, (230, 220))
        x, y = (index % 4) * 250, (index // 4) * 260
        sheet.paste(thumb, (x + (250-thumb.width)//2, y))
        draw.text((x+10, y+225), f'{index+1:02d}: {source.name[:26]}', fill='#653641')
# The welcome portrait the user made for Ani (kept out of the gallery list).
with Image.open(ROOT / 'photo/Anne_Birthday.png') as original:
    portrait = ImageOps.exif_transpose(original).convert('RGB')
    for size, target in [((1200, 1500), 'anne-birthday.webp'), ((720, 900), 'anne-birthday-720.webp')]:
        copy = portrait.copy()
        copy.thumbnail(size, Image.Resampling.LANCZOS)
        copy.save(OUT / 'photos' / target, 'WEBP', quality=88, method=6)
(OUT / 'photos.json').write_text(json.dumps(manifest, indent=2), encoding='utf-8')
(ROOT / '.local').mkdir(exist_ok=True)
sheet.save(ROOT / '.local/photo-contact-sheet.jpg')
print(f'Prepared two models, exact letter and name, and {len(manifest)} photos.')

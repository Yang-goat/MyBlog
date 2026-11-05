"""Publish generated PNG assets as size-bounded WebP without changing their composition.

Only encoding/resampling occurs here. All illustrations originate from image_gen.
Usage: python scripts/art-publish.py SOURCE ID [scene|character|item|equipment]
"""
from pathlib import Path
import sys
from PIL import Image

source, asset_id, kind = sys.argv[1:4]
root = Path(__file__).resolve().parents[1]
destination = root / 'public' / 'art' / f'{asset_id}.webp'
if destination.exists():
    raise SystemExit(f'Refusing to overwrite {destination}')
im = Image.open(source)
size = (1920, 1080) if kind == 'scene' else (768, 1024) if kind == 'character' else (512, 512)
im.thumbnail(size, Image.Resampling.LANCZOS)
im.save(destination, 'WEBP', quality=88, method=6)
print(f'{asset_id}: {im.width}x{im.height}, {im.mode}, {destination.stat().st_size} bytes')

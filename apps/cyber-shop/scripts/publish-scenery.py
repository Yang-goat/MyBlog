"""Encode generated scenery without altering composition; preserve source PNG and alpha."""
from pathlib import Path
import hashlib
import json
import sys
from PIL import Image

root = Path(__file__).resolve().parents[1]
asset_id, max_width = sys.argv[1], int(sys.argv[2])
assert asset_id.replace('-', '').isalnum() and asset_id.isascii()
source = root / 'public/scenery' / f'{asset_id}.png'
archive = root / 'docs/art-revisions/living-shop' / source.name
destination = root / 'public/scenery' / f'{asset_id}.webp'
if destination.exists() or archive.exists():
    raise SystemExit('Destination exists; refuse to overwrite source artwork.')
archive.parent.mkdir(parents=True, exist_ok=True)
archive.write_bytes(source.read_bytes())
im = Image.open(source)
im.thumbnail((max_width, max_width), Image.Resampling.LANCZOS)
im.save(destination, 'WEBP', quality=88, method=6)
with Image.open(destination) as check:
    check.load()
    assert check.size == im.size and ('A' in check.mode) == ('A' in im.mode)
print(json.dumps({'id': asset_id, 'path': 'scenery/' + destination.name, 'source': str(archive.relative_to(root)).replace('\\', '/'), 'width': im.width, 'height': im.height, 'alpha': 'A' in im.mode, 'bytes': destination.stat().st_size, 'sha256': hashlib.sha256(destination.read_bytes()).hexdigest()}))
# Remove only the copied, superseded public PNG, after both replacements were verified.
assert source.resolve().parent == (root / 'public/scenery').resolve()
assert archive.read_bytes() == source.read_bytes()
source.unlink()

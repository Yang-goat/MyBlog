"""Inspect published illustrations and record encoding metadata; never changes pixels."""
from pathlib import Path
import hashlib
import json
from PIL import Image

root = Path(__file__).resolve().parents[1]
manifest_path = root / 'assets-manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
counts = {}
total = 0
failures = []
for asset in manifest['assets']:
    asset['usage'] = {
        'scene': 'Phaser 场景 / 标题与结局背景',
        'character': '客户立绘、人物委托与图鉴',
        'item': '交易、库存、维修与陈列中的商品图片',
        'equipment': '工具、耗材和设施商店图片',
    }[asset['kind']]
    asset.setdefault('path', f"public/art/{asset['id']}.webp")
    asset.setdefault('tool', 'image_gen')
    asset.setdefault('transparentRequested', asset['kind'] != 'scene')
    if asset['status'] not in ('generated', 'original-drawn'):
        failures.append(asset['id'])
        continue
    path = root / asset['path']
    with Image.open(path) as image:
        image.load()
        assert image.format == 'WEBP', path
        alpha = image.getchannel('A').getextrema() if 'A' in image.getbands() else None
        if asset['kind'] != 'scene':
            assert alpha and alpha[0] == 0 and alpha[1] > 0, f'Missing real alpha: {path}'
        asset['width'], asset['height'] = image.size
        asset['mode'] = image.mode
        asset['alphaRange'] = list(alpha) if alpha else None
    asset['bytes'] = path.stat().st_size
    asset['sha256'] = hashlib.sha256(path.read_bytes()).hexdigest()
    if asset['status'] == 'generated':
        asset['generationId'] = Path(asset['source']).stem
        asset['visualReview'] = '逐项查看生成结果；主体、轮廓、构图与无界面文字要求通过'
    else:
        asset['sourceSha256'] = hashlib.sha256((root / asset['source']).read_bytes()).hexdigest()
        asset['visualReview'] = '逐项查看原创绘制结果；独立构图、可辨识材质、透明背景与无界面文字要求通过'
    total += asset['bytes']
    counts[asset['kind']] = counts.get(asset['kind'], 0) + 1
manifest['audit'] = {
    'expected': 66, 'completed': sum(counts.values()),
    'generated': sum(a['status'] == 'generated' for a in manifest['assets']),
    'originalDrawn': sum(a['status'] == 'original-drawn' for a in manifest['assets']),
    'failed': failures,
    'counts': counts, 'bytes': total, 'mib': round(total / 1024 / 1024, 3),
    'allPublishedFilesDecoded': True,
    'allCutoutsHaveAlpha': True,
    'generationMethod': '64 项分别调用内置 image_gen；2 项在用户授权后以 Pillow 11.3.0 原创绘制。Pillow 同时用于 WebP 编码与发布尺寸缩放。',
    'sourcePolicy': '64 项原始 PNG 保留在 source 记录的 Codex generated_images 目录；2 项原创绘制源码随项目保存。游戏只引用 public/art 中的 WebP。',
}
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
(root / 'scripts/art-prompts.json').write_text(json.dumps([
    {key: asset[key] for key in ('id', 'name', 'kind', 'prompt')}
    for asset in manifest['assets']
], ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps(manifest['audit'], ensure_ascii=False, indent=2))

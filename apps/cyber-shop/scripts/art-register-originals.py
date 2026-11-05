"""Register only the two explicitly authorized original drawings.

This preserves original prompts, raw tool error and both failed attempts. Run
after the two independent drawing scripts, then run art-audit.py and validate-art.
"""
from pathlib import Path
import json

root = Path(__file__).resolve().parents[1]
manifest_path = root / 'assets-manifest.json'
manifest = json.loads(manifest_path.read_text(encoding='utf-8'))
descriptions = {
    'electronic-parts': '原创绘制：使用 Pillow 分层绘制独立维修盒、铜线路板、集成电路、电容与陶瓷保险件；包含渐变金属、确定性磨损纹理和透明背景。',
    'insulation': '原创绘制：使用 Pillow 分层绘制独立绝缘胶带卷、琥珀介电薄片与青绿热缩套管；包含绕卷纹理、渐变材质和透明背景。',
}
for asset in manifest['assets']:
    if asset['id'] not in descriptions:
        continue
    asset_id = asset['id']
    asset.update({
        'status': 'original-drawn',
        'tool': 'original-drawing',
        'source': f'scripts/art-{asset_id}.py',
        'sourceDependencies': ['scripts/art-draw-lib.py'],
        'sourceDescription': descriptions[asset_id],
        'authorization': '2026-11-05 用户明确允许 electronic-parts 和 insulation 两项改为原创绘制插画并继续发布。',
        'generationAttempts': asset['attempts'],
        'transparentRequested': True,
        'path': f'public/art/{asset_id}.webp',
        'reproduce': f'python scripts/art-{asset_id}.py',
    })
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print('Registered exactly two authorized original drawings; image-generation failure history retained.')

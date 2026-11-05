"""Small deterministic Pillow drawing helpers for two user-authorized originals.

No external image, generated object, texture, or AI API is used. Coordinates are
art-directed at 512 px and rendered at 3x for clean transparent game cutouts.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter
import math
import random

S = 3
SIZE = 512


class Drawing:
    def __init__(self, seed):
        self.im = Image.new('RGBA', (SIZE*S, SIZE*S), (0, 0, 0, 0))
        self.rng = random.Random(seed)

    def points(self, points):
        return [(round(x*S), round(y*S)) for x, y in points]

    def poly(self, points, fill, outline=None, width=1):
        d = ImageDraw.Draw(self.im)
        p = self.points(points)
        d.polygon(p, fill=fill)
        if outline:
            d.line(p+[p[0]], fill=outline, width=max(1, round(width*S)), joint='curve')

    def line(self, points, fill, width=1):
        ImageDraw.Draw(self.im).line(self.points(points), fill=fill, width=max(1, round(width*S)), joint='curve')

    def ellipse(self, box, fill, outline=None, width=1):
        ImageDraw.Draw(self.im).ellipse(tuple(round(v*S) for v in box), fill=fill, outline=outline, width=max(1, round(width*S)))

    def gradient(self, points, top, bottom, grain=0, horizontal=False):
        p = self.points(points)
        mask = Image.new('L', self.im.size, 0)
        ImageDraw.Draw(mask).polygon(p, fill=255)
        x0,y0,x1,y1 = mask.getbbox()
        layer = Image.new('RGBA', (x1-x0,y1-y0))
        pixels = layer.load()
        span = max(1, (x1-x0-1) if horizontal else (y1-y0-1))
        for y in range(y1-y0):
            for x in range(x1-x0):
                t = (x if horizontal else y)/span
                n = self.rng.gauss(0,grain) if grain else 0
                c = tuple(max(0,min(255,round(a*(1-t)+b*t+n))) for a,b in zip(top[:3],bottom[:3]))
                pixels[x,y] = (*c,255)
        whole = Image.new('RGBA',self.im.size)
        whole.paste(layer,(x0,y0))
        self.im.alpha_composite(Image.composite(whole,Image.new('RGBA',self.im.size),mask))

    def shadow(self, box, opacity=70, blur=8):
        layer = Image.new('RGBA',self.im.size)
        ImageDraw.Draw(layer).ellipse(tuple(round(v*S) for v in box),fill=(4,12,15,opacity))
        self.im.alpha_composite(layer.filter(ImageFilter.GaussianBlur(blur*S)))

    def glow(self, box, color=(58,222,205), opacity=70, blur=3):
        layer = Image.new('RGBA',self.im.size)
        ImageDraw.Draw(layer).ellipse(tuple(round(v*S) for v in box),fill=(*color,opacity))
        self.im.alpha_composite(layer.filter(ImageFilter.GaussianBlur(blur*S)))

    def scratches(self, points, count=70, color=(180,155,110,90)):
        mask = Image.new('L',self.im.size)
        ImageDraw.Draw(mask).polygon(self.points(points),fill=255)
        layer = Image.new('RGBA',self.im.size)
        d = ImageDraw.Draw(layer)
        x0,y0,x1,y1 = mask.getbbox()
        for _ in range(count):
            x=self.rng.uniform(x0,x1); y=self.rng.uniform(y0,y1)
            length=self.rng.uniform(1,8)*S
            d.line([(x,y),(x+length,y-length*.18)],fill=color,width=self.rng.choice([1,1,2]))
        layer.putalpha(Image.composite(layer.getchannel('A'),Image.new('L',self.im.size),mask))
        self.im.alpha_composite(layer)

    def screw(self,x,y,r=3):
        self.ellipse((x-r-1,y-r-1,x+r+1,y+r+1),(10,17,19))
        self.ellipse((x-r,y-r,x+r,y+r),(115,113,98), (153,144,116),.5)
        self.line([(x-r*.6,y+r*.3),(x+r*.6,y-r*.3)],(28,35,35),.9)

    def save(self,asset_id):
        root=Path(__file__).resolve().parents[1]
        path=root/'public'/'art'/f'{asset_id}.webp'
        self.im.resize((SIZE,SIZE),Image.Resampling.LANCZOS).save(path,'WEBP',quality=92,method=6)
        print(f'{asset_id}: original-drawing, 512x512 RGBA, {path.stat().st_size} bytes')


def plane(origin, u, v):
    """Return a simple hand-chosen oblique projection, used for board details."""
    return lambda x,y:(origin[0]+x*u[0]+y*v[0],origin[1]+x*u[1]+y*v[1])


def quad(p,x,y,w,h):
    return [p(x,y),p(x+w,y),p(x+w,y+h),p(x,y+h)]


def bezier(points,steps=60):
    p0,p1,p2,p3=points
    return [((1-t)**3*p0[0]+3*(1-t)**2*t*p1[0]+3*(1-t)*t*t*p2[0]+t**3*p3[0],
             (1-t)**3*p0[1]+3*(1-t)**2*t*p1[1]+3*(1-t)*t*t*p2[1]+t**3*p3[1])
            for t in [i/steps for i in range(steps+1)]]

"""Original insulation-supplies illustration, explicitly authorized 2026-11-05.

Hand-drawn graphite tape reel, translucent amber dielectric sheets and teal
heat-shrink sleeves. Reproduce: python scripts/art-insulation.py
Uses no reference image pixels or image-generation service.
"""
from importlib.util import spec_from_file_location, module_from_spec
from pathlib import Path
import math
import sys
sys.dont_write_bytecode = True
spec=spec_from_file_location('drawing',Path(__file__).with_name('art-draw-lib.py'))
lib=module_from_spec(spec); spec.loader.exec_module(lib)
D=lib.Drawing(110502)
D.shadow((48,336,471,430),70,10)

# A stack of amber polymer dielectric sheets with separate cut edges.
sheet=[(251,137),(406,167),(453,334),(280,303)]
for dy in [18,12,6,0]:
    pts=[(x,y+dy) for x,y in sheet]
    D.gradient(pts,(199,136,57),(109,61,29),1.6)
    D.poly(pts,None,(232,179,93),1.2)
D.gradient([(262,149),(397,176),(438,319),(289,291)],(152,103,45),(196,128,48),1.5)
D.line([(261,148),(396,175)],(255,214,141),1.4)
D.line([(397,176),(439,319)],(240,185,100),1.3)
# Broad, subtle reflective bands describe the smooth dielectric surface.
D.poly([(276,154),(296,158),(333,300),(313,295)],(215,162,83,255))
D.poly([(299,159),(307,160),(345,302),(337,301)],(205,149,69,255))
D.line([(354,175),(389,287),(402,301)],(232,175,84),.6)
D.scratches(sheet,65,(244,194,118,70))
# Folded graphite retaining clasp and small round rivets.
D.gradient([(318,155),(355,162),(398,323),(360,316)],(45,65,60),(17,31,31),1.7)
D.line([(321,157),(362,314)],(99,125,104),1.2)
D.line([(351,164),(393,320)],(65,102,87),1)
for x,y in [(331,176),(379,306)]:D.screw(x,y,3.2)
D.poly([(338,204),(354,207),(362,236),(345,232)],(30,95,84),(106,169,140),1)

# Substantial tape spool: oblique elliptical top, cylindrical wound body.
cx,cy=174,221
rx,ry=111,74
bottom=298
D.gradient([(cx-rx,cy),(cx+rx,cy),(cx+rx,bottom),(cx-rx,bottom)],(71,82,76),(25,34,34),2,True)
D.ellipse((cx-rx,bottom-ry,cx+rx,bottom+ry),(41,48,45),(105,105,84),1)
# Lower front curved bands retain the layered reel texture.
for j in range(22):
    yy=cy+6+j*3.25
    pts=[]
    for i in range(81):
        t=math.pi*i/80
        pts.append((cx+rx*math.cos(t),yy+ry*math.sin(t)))
    D.line(pts,(62+j%3*5,69+j%3*4,61+j%3*3),.7)
D.ellipse((cx-rx,cy-ry,cx+rx,cy+ry),(81,88,78),(159,151,113),1.5)
# Individual concentric winding strokes, each ellipse hand-shaded.
for r in range(108,42,-2):
    ratio=r/rx
    tone=94+(r%7)*2
    D.ellipse((cx-r,cy-ry*ratio,cx+r,cy+ry*ratio),None,(tone,tone+4,tone-15),.6)
D.ellipse((cx-45,cy-31,cx+45,cy+31),(190,165,113),(225,202,149),1.2)
D.ellipse((cx-37,cy-25,cx+37,cy+25),(19,28,28),(81,80,60),1.4)
D.ellipse((cx-36,cy-14,cx+36,cy+32),(29,41,38))
D.ellipse((cx-33,cy-11,cx+33,cy+20),(10,24,25))
# Core wall highlights stay inside the opening.
D.line([(cx-35,cy-10),(cx-29,cy+10),(cx-18,cy+20)],(96,90,60),2.2)
D.line([(cx-44,cy-29),(cx-40,cy-16)],(241,220,161),1)
# A peeling tail of insulation tape creates a strong silhouette.
tail=[(102,286),(127,306),(121,345),(143,372),(191,378),(205,397),(139,399),(100,366),(91,326)]
D.gradient(tail,(58,69,61),(28,40,38),2)
D.poly(tail,None,(112,115,88),1)
D.line([(103,291),(103,324),(112,358),(142,386),(193,389)],(75,96,78),1.2)
D.line([(124,308),(118,343),(142,373),(185,379)],(179,162,110),.8)
# A small bronze fastening tab on the loose tail.
D.gradient([(145,378),(170,381),(177,394),(149,394)],(156,132,83),(76,75,55),2)
D.line([(150,382),(169,384)],(218,193,125),1)
D.scratches(tail,45)

# Three individually drawn sleeves arranged in front of the sheets.
def tube(x,y,length,r,color):
    endx=x+length;endy=y-26
    top=[(x,y-r),(endx,endy-r),(endx,endy+r),(x,y+r)]
    D.line([(x+4,y+6),(endx+3,endy+6)],(7,20,22),r*2+4)
    D.gradient(top,tuple(min(255,v+24) for v in color),tuple(max(0,v-18) for v in color),2)
    D.ellipse((endx-r*.5,endy-r,endx+r*.5,endy+r),color,(93,144,116),.9)
    D.ellipse((x-r*.6,y-r,x+r*.6,y+r),(85,132,107),(154,175,132),1)
    D.ellipse((x-r*.37,y-r*.7,x+r*.37,y+r*.7),(12,34,33),(48,85,71),.7)
    D.line([(x+5,y-r*.55),(endx-5,endy-r*.55)],(109,163,133),1.2)
    for k in range(3):
        tx=x+length*(.2+k*.25);ty=y-26*(.2+k*.25)
        D.line([(tx,ty-r*.85),(tx+2,ty+r*.85)],(30,70,60),.7)
tube(248,386,172,11,(37,96,80))
tube(267,360,162,9,(36,84,72))
tube(283,335,134,7,(67,99,74))
# Thin amber sleeve, independently placed above the teal group.
tube(318,315,92,5,(142,105,54))

# Edge-mounted keeper joins the sleeves without obscuring the hollow ends.
D.gradient([(352,322),(367,319),(382,387),(367,390)],(153,126,77),(74,70,47),2)
D.poly([(352,322),(367,319),(382,387),(367,390)],None,(198,172,106),.9)
D.line([(356,326),(370,384)],(233,204,130),.8)
D.screw(367,347,2.5)
D.save('insulation')

"""Original electronic spare-parts illustration, explicitly authorized 2026-11-05.

Hand-composed open service cassette, populated copper PCB, ceramic fuses,
capacitors and connectors. Reproduce: python scripts/art-electronic-parts.py
Uses no reference image pixels or image-generation service.
"""
from importlib.util import spec_from_file_location, module_from_spec
from pathlib import Path
import sys
sys.dont_write_bytecode = True
spec=spec_from_file_location('drawing',Path(__file__).with_name('art-draw-lib.py'))
lib=module_from_spec(spec); spec.loader.exec_module(lib)
D=lib.Drawing(110501)

# Die-cast cassette: the stepped rim and deep side wall give the kit its weight.
D.shadow((65,330,470,440),75,10)
top=[(69,167),(334,102),(447,190),(458,339),(186,424),(61,333)]
front=[(61,333),(186,424),(458,339),(455,366),(184,454),(58,359)]
D.gradient(front,(79,90,87),(22,31,34),3)
D.poly(front,None,(120,119,96),1.6)
D.gradient(top,(90,104,100),(39,48,48),2)
D.poly(top,None,(161,147,108),2.4)
inner=[(83,180),(330,122),(430,200),(439,328),(189,404),(78,323)]
D.gradient(inner,(12,25,27),(24,34,34),2)
D.poly(inner,None,(12,20,22),4)
D.line([(87,181),(329,124),(427,201)],(116,126,107),1.2)
D.line([(78,325),(190,407),(440,331)],(163,139,91),1.2)

# Open lid behind the components, with an inset teal plate and ribs.
lid=[(69,167),(47,81),(294,30),(335,102)]
D.gradient(lid,(95,108,102),(32,45,45),2)
D.poly(lid,None,(142,134,106),2)
lidin=[(70,91),(283,48),(309,94),(86,146)]
D.gradient(lidin,(27,46,46),(16,28,30),2)
D.poly(lidin,None,(14,23,24),3)
D.line([(80,96),(279,56),(298,91)],(99,115,103),1)
D.line([(98,129),(163,113),(173,98),(243,83)],(68,158,146),2)
D.line([(100,134),(167,118),(177,103),(245,88)],(21,47,48),1)
for x,y in [(67,86),(284,42),(82,151),(316,99)]:D.screw(x,y,2.4)
for x,y in [(112,158),(282,117)]:
    D.poly([(x-11,y-3),(x+10,y-8),(x+15,y+5),(x-7,y+11)],(88,93,83),(150,137,103),1)
    D.line([(x-8,y+2),(x+11,y-3)],(25,33,32),2)

# A large removable circuit board, drawn in a separate projected plane.
p=lib.plane((100,230),(.91,-.23),(.40,.53))
board=lib.quad(p,0,0,207,158)
side=[p(0,158),p(207,158),(p(207,158)[0],p(207,158)[1]+8),(p(0,158)[0],p(0,158)[1]+8)]
D.gradient(side,(48,80,68),(17,41,35),1)
D.gradient(board,(26,76,66),(14,49,45),1.8)
D.poly(board,None,(96,135,100),1.3)
for x,y in [(8,8),(197,8),(8,148),(197,148)]:
    q=p(x,y);D.ellipse((q[0]-3,q[1]-2,q[0]+3,q[1]+2),(141,121,75),(192,166,95),.6)

# Fine etched copper tracks use right angles and small circular solder pads.
tracks=[[(18,29),(54,29),(54,48),(76,48)],[(17,39),(45,39),(45,61),(76,61)],
 [(124,48),(164,48),(164,19),(190,19)],[(124,58),(180,58),(180,83)],
 [(122,72),(148,72),(148,112),(184,112)],[(80,89),(48,89),(48,133),(18,133)],
 [(91,90),(91,119),(111,119),(111,144)],[(103,90),(103,109),(129,109),(129,140)],
 [(20,57),(32,57),(32,108),(15,108)],[(158,89),(197,89)],[(159,97),(193,97),(193,138)]]
for track in tracks:
    D.line([p(x,y) for x,y in track],(168,134,66),1)
    for x,y in [track[0],track[-1]]:
        q=p(x,y);D.ellipse((q[0]-1.4,q[1]-1,q[0]+1.4,q[1]+1),(218,184,105))
# Graphite controller with metal legs.
for i in range(8):
    D.poly(lib.quad(p,72+i*6,40,2.7,7),(168,167,132))
    D.poly(lib.quad(p,72+i*6,87,2.7,7),(168,167,132))
for i in range(6):
    D.poly(lib.quad(p,65,48+i*6,8,2.4),(171,169,135))
    D.poly(lib.quad(p,119,48+i*6,8,2.4),(171,169,135))
D.gradient(lib.quad(p,72,47,48,40),(63,70,65),(20,29,29),2)
D.poly(lib.quad(p,72,47,48,40),None,(110,117,98),.6)
D.line([p(78,52),p(114,52)],(119,128,112),.5)
q=p(80,56);D.ellipse((q[0]-1,q[1]-1,q[0]+1,q[1]+1),(197,185,131))
# Ceramic surface components and copper transformer.
for x,y in [(29,65),(29,80),(145,25),(158,25),(142,128),(157,128),(172,128)]:
    D.poly(lib.quad(p,x,y,12,6),(178,163,117),(222,204,154),.6)
    D.poly(lib.quad(p,x,y,2,6),(103,118,108))
    D.poly(lib.quad(p,x+10,y,2,6),(103,118,108))
for i in range(9):
    D.line([p(144+i*3,66),p(144+i*3,80)],(145+6*(i%3),91+8*(i%3),42),2.1)
# Board-side sockets and tiny powered diagnostic point.
for i in range(10):D.poly(lib.quad(p,49+i*5,147,3,11),(180,146,71),(218,183,105),.4)
q=p(177,40);D.glow((q[0]-6,q[1]-5,q[0]+6,q[1]+5),opacity=60)
D.ellipse((q[0]-2.8,q[1]-2,q[0]+2.8,q[1]+2),(113,231,208),(187,255,238),.6)

# Three spare capacitors seated in a fitted compartment at the upper right.
for cx,cy,r,h in [(352,191,17,37),(391,218,16,31),(334,235,13,27)]:
    D.ellipse((cx-r-3,cy-5,cx+r+4,cy+17),(7,17,19))
    D.gradient([(cx-r,cy-h),(cx+r,cy-h),(cx+r,cy+6),(cx-r,cy+6)],(66,86,82),(24,40,42),2,True)
    D.ellipse((cx-r,cy-3,cx+r,cy+12),(28,46,46),(75,92,78),1)
    D.ellipse((cx-r,cy-h-8,cx+r,cy-h+8),(148,156,135),(200,199,161),1)
    D.line([(cx-r*.6,cy-h),(cx+r*.6,cy-h)],(70,84,78),1)
    D.line([(cx,cy-h-5),(cx,cy-h+5)],(70,84,78),1)
    D.line([(cx-r+5,cy-h+11),(cx-r+5,cy+1)],(84,137,119),2)
# Recessed two-pin ceramic fuses and a brass connector along the right edge.
for i in range(3):
    x=352+i*22;y=285-i*5
    D.line([(x-3,y-13),(x+13,y+18)],(7,16,18),13)
    D.line([(x-3,y-13),(x+13,y+18)],(157,154,123),9)
    D.line([(x,y-7),(x+10,y+12)],(224,217,174),8)
    D.line([(x-4,y-15),(x-1,y-9)],(176,133,64),9)
    D.line([(x+10,y+12),(x+14,y+20)],(167,124,58),9)

# Protective corner bumpers, latch and gentle edge wear.
for points in [[(61,307),(80,324),(82,352),(59,336)],[(183,410),(207,405),(207,438),(185,445)],[(426,344),(456,335),(453,362),(425,371)]]:
    D.gradient(points,(47,70,66),(20,37,38),2)
    D.poly(points,None,(88,106,91),1)
D.gradient([(271,393),(309,381),(309,408),(270,421)],(135,124,92),(59,63,55),2)
D.poly([(277,396),(304,388),(303,405),(277,413)],(28,46,44),(161,144,98),1.3)
D.line([(73,349),(171,425)],(23,31,32),3)
for x,y in [(78,172),(328,112),(439,199),(444,329),(187,415),(66,326)]:D.screw(x,y,2.7)
D.scratches(top,140)
D.scratches(front,110)
D.scratches(lid,80)
D.save('electronic-parts')

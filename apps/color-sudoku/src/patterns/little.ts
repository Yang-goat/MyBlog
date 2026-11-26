import { ink } from './paper.ts';
import type { Artist } from './paper.ts';

// On five squares the negative spaces *are* the illustration: the fish's narrow tail joint,
// the carrot's split green top, the heart's notch and the mushroom's canopy overhang.
export const fish: Artist = (s, r) => {
  const tail = r.take(3), dorsal = r.take(3), ventral = r.take(3), jaw = r.take(2);
  s.part(0, 1, ['.##', '###', '.##'], ink.biscuit);  // eye, cheek and little pointed nose
  s.span(2, 2, 4, ink.caramel);                      // narrow peduncle between body and fan
  s.dot(4, 1, ink.toast);
  s.dot(4, 3, ink.toast);
  if (tail !== 0) s.dot(4, tail === 1 ? 0 : 4, ink.caramel);
  s.span(0, dorsal === 1 ? 1 : 2, dorsal === 2 ? 3 : 2, ink.caramel);
  if (ventral !== 2) s.dot(ventral === 0 ? 2 : 1, 4, ink.caramel);
  if (jaw) s.dot(0, 3, ink.biscuit);
  s.tint(1, 1, ink.cocoa); s.tint(0, 2, ink.cream); s.tint(1, 3, ink.peach);
  return { name: '刚出炉的小鱼饼', story: '窗台上留着一点饼干香，小橘顺着香味找到了酥酥的鱼尾。' };
};

export const carrot: Artist = (s, r) => {
  const angle = r.take(2), fronds = r.take(3), shoulder = r.take(2), taper = r.take(2);
  if (angle === 0) {
    s.span(2, 1, 3, ink.apricot); s.span(3, 0, taper ? 1 : 2, ink.apricot);
    s.dot(0, 4, ink.peach); s.dot(2, 1, ink.apricot);
    if (shoulder) s.dot(1, 1, ink.peach);
    s.span(1, 2, 4, ink.sage); s.dot(fronds === 1 ? 3 : 2, 0, ink.moss);
    if (fronds !== 2) s.dot(4, 0, ink.moss);
    s.tint(1, 2, ink.biscuit); s.tint(1, 3, ink.peach);
  } else {
    s.span(2, shoulder ? 0 : 1, 3, ink.apricot);
    s.span(3, taper ? 1 : 2, taper ? 2 : 3, ink.apricot); s.dot(2, 4, ink.peach);
    s.span(1, fronds === 1 ? 1 : 0, 4, ink.moss);
    s.dot(fronds === 1 ? 1 : 0, 0, ink.sage); s.dot(4, 0, ink.sage);
    if (fronds !== 2) s.dot(2, 0, ink.moss);
    s.tint(1, 2, ink.caramel); s.tint(3, 2, ink.peach);
  }
  return { name: '带泥的小胡萝卜', story: '叶尖还挂着露水，垂耳兔已经在篱笆那头踮起了脚。' };
};

export const heart: Artist = (s, r) => {
  const cleft = r.take(2), shoulders = r.take(4), taper = r.take(3), lean = r.take(2);
  s.part(0, 0, ['.#', '##'], ink.rose); s.part(3, 0, ['#.', '##'], ink.rose);
  if (shoulders & 1) s.dot(0, 0, ink.rose);
  if (shoulders & 2) s.dot(4, 0, ink.berry);
  if (!cleft) s.dot(2, 1, ink.rose);
  s.span(2, taper === 2 ? 1 : 0, 4, ink.rose);
  s.span(3, 1, taper === 1 ? 2 : 3, ink.berry);
  s.dot(lean && taper !== 1 ? 3 : 2, 4, ink.berry);
  s.tint(1, 1, ink.blush); s.tint(3, 1, ink.peach);
  return { name: '一颗杏桃心', story: '奶团从皱皱的糖纸上剪下一颗心，轻轻贴在了信封角。' };
};

export const mushroom: Artist = (s, r) => {
  const crown = r.take(3), brim = r.take(3), stalk = r.take(3), foot = r.take(2);
  s.span(0, crown === 1 ? 2 : 1, crown === 2 ? 2 : 3, ink.berry);
  s.span(1, brim === 1 ? 1 : 0, brim === 2 ? 3 : 4, ink.rose);
  s.span(2, 0, 4, ink.apricot);
  const x = stalk === 1 ? 1 : 2;
  s.span(3, x, stalk === 2 ? x + 1 : x, ink.cream);
  s.span(4, foot ? x : x - 1, x, ink.linen);
  s.tint(1, 1, ink.cream); s.tint(3, 0, ink.blush); s.tint(4, 2, ink.toast);
  return { name: '树下的小红伞', story: '雨停了，一只蜗牛还在蘑菇伞底慢吞吞地收拾行李。' };
};

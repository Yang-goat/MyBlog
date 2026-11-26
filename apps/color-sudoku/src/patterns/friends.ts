import { ink } from './paper.ts';
import type { Artist } from './paper.ts';

export const rabbit: Artist = (s, r) => {
  const standing = r.take(3), droop = r.take(3), cheek = r.take(2), chin = r.take(2);
  s.part(1, 3, ['####', '####', '####', '.##.'], ink.cream);
  if (!cheek) s.dot(0, 4, ink.linen);
  if (chin) s.dot(1, 6, ink.linen);
  // The upright ear grows out of the left temple; its tip can lean or unfold one cell.
  const tip = standing === 0 ? 1 : 2;
  s.dot(2, 2, ink.cream); s.span(1, standing === 1 ? 2 : 1, 2, ink.cream);
  s.span(0, tip, standing === 2 ? 3 : tip, ink.cream);
  s.tint(2, 1, ink.blush);
  // Over the far temple, past the cheek, then down. Keep the air slit at (5,4).
  s.span(2, 4, 6, ink.cream); s.span(3, 4, 6, ink.cream); s.dot(6, 4, ink.blush);
  if (droop !== 1) s.dot(6, 5, ink.cream);
  if (droop === 2) { s.dot(6, 6, ink.cream); s.dot(5, 6, ink.linen); }
  s.tint(5, 2, ink.blush); s.tint(1, 4, ink.cocoa); s.tint(3, 4, ink.cocoa);
  s.tint(2, 5, ink.berry); s.tint(4, 5, ink.blush);
  return { name: '听风的垂耳兔', story: '一只耳朵听叶子响，另一只软软地搭在脸边。' };
};

export const kitten: Artist = (s, r) => {
  const spread = r.take(2), flick = r.take(3), whiskers = r.take(3), chin = r.take(2);
  s.part(1, 2, ['.###.', '#####', '#####', '#####', '.###.'], ink.mist);
  const l = spread ? 0 : 1, h = 6 - l;
  s.dot(l, flick === 1 ? 1 : 0, ink.slate); s.span(1, l, flick === 1 ? l : l + 1, ink.slate); s.span(2, l, l + 2, ink.slate);
  s.dot(h, flick === 2 ? 1 : 0, ink.slate); s.span(1, flick === 2 ? h : h - 1, h, ink.slate); s.span(2, h - 2, h, ink.slate);
  if (spread) s.cut(3, 2); // the longer outer ears leave a deeper notch over the crown
  s.tint(l + 1, 2, ink.blush); s.tint(h - 1, 2, ink.blush);
  s.dot(0, whiskers === 1 ? 3 : 4, ink.slate); s.dot(6, whiskers === 2 ? 5 : 4, ink.slate);
  if (chin) s.dot(1, 6, ink.linen);
  s.tint(2, 4, ink.cocoa); s.tint(4, 4, ink.cocoa); s.tint(3, 5, ink.berry); s.tint(3, 6, ink.linen);
  return { name: '探头的小尖耳', story: '门缝先露出两个耳尖，接着才是一对眨巴眨巴的眼睛。' };
};

export const hamster: Artist = (s, r) => {
  const pouch = r.take(3), ears = r.take(3), paws = r.take(3), plump = r.take(2);
  s.part(1, 1, ['#####', '#####', '#####', '#####', '.###.'], ink.biscuit);
  s.span(0, ears === 2 ? 0 : 1, 2, ink.caramel); s.span(0, 4, ears === 1 ? 6 : 5, ink.caramel);
  s.tint(1, 0, ink.blush); s.tint(5, 0, ink.blush);
  // Each pouch overlaps the jaw but is free to hang a row lower than its partner.
  s.part(0, pouch === 2 ? 4 : 3, ['##', '##'], ink.cream);
  s.part(5, pouch === 1 ? 4 : 3, ['##', '##'], ink.cream);
  if (plump) { s.span(5, 1, 5, ink.biscuit); s.dot(3, 6, ink.cream); }
  s.span(6, paws === 1 ? 1 : 2, 2, ink.toast); s.span(6, 4, paws === 2 ? 5 : 4, ink.toast);
  s.tint(2, 2, ink.cocoa); s.tint(4, 2, ink.cocoa); s.tint(3, 3, ink.berry);
  s.tint(1, 4, ink.blush); s.tint(5, 4, ink.blush); s.tint(3, 5, ink.cream);
  return { name: '鼓腮的小栗子', story: '小仓鼠摇摇头说没有偷吃，两边腮帮却各藏着一粒瓜子。' };
};

export const duck: Artist = (s, r) => {
  const bill = r.take(2), tail = r.take(3), crown = r.take(3), foot = r.take(3);
  s.part(1, 3, ['...##', '#####', '####.'], ink.corn);    // low belly, high neck
  s.part(3, 1, ['###', '###'], ink.corn);
  s.span(0, crown === 1 ? 3 : 4, crown === 2 ? 5 : 4, ink.corn);
  s.dot(6, bill ? 1 : 2, ink.apricot);
  s.dot(0, 4, ink.gold); s.dot(0, 3, ink.gold);
  if (tail !== 1) s.dot(1, 3, ink.gold);
  if (tail === 2) s.dot(0, 2, ink.corn);
  if (foot === 2) { s.dot(1, 6, ink.apricot); s.span(6, 3, 4, ink.apricot); }
  else s.span(6, foot === 1 ? 1 : 2, 3, ink.apricot);
  s.tint(4, 1, ink.cocoa); s.tint(4, 2, ink.blush);
  s.tint(1, 4, ink.gold); s.tint(2, 4, ink.gold); s.tint(3, 5, ink.cream);
  return { name: '踮脚的小黄鸭', story: '小黄鸭踮高脚掌，终于瞧见了水盆里那个也在踮脚的朋友。' };
};

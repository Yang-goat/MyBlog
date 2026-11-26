import { ink } from './paper.ts';
import type { Artist } from './paper.ts';

// The ten-square studies are side-on scenes, not enlargements of the seven-square portraits.
export const sleepingCat: Artist = (s, r) => {
  const tuck = r.take(2), curl = r.take(3), arch = r.take(3), ears = r.take(2), cheek = r.take(2);
  s.span(2, 6, arch === 1 ? 8 : 7, ink.caramel);            // arched back behind the sleeping head
  if (arch === 2) s.span(1, 6, 7, ink.caramel);
  s.span(3, 5, 8, ink.biscuit); s.span(4, 4, 9, ink.biscuit);
  s.span(5, 6, 9, ink.caramel); s.span(6, 7, 9, ink.caramel); s.span(7, 7, 9, ink.caramel);
  s.span(8, 6, 8, ink.caramel);
  // A real hook: start at the rump, turn along the floor, then up and BACK toward the belly.
  // The air between the tip and the inside of the sweeping tail remains empty.
  const elbow = curl === 1 ? 1 : 2;
  s.span(9, elbow + 1, 7, ink.toast); s.span(8, elbow, elbow + 1, ink.caramel);
  s.span(7, elbow, curl === 2 ? 3 : 4, ink.biscuit);
  if (curl === 1) s.dot(1, 6, ink.cream);
  s.tint(curl === 2 ? 3 : 4, 7, ink.cream);
  const y = 3 + tuck;
  s.span(y, 1, 4, ink.caramel); s.span(y + 1, 0, 4, ink.biscuit);
  s.span(y + 2, cheek ? 0 : 1, 3, ink.cream);
  if (!tuck) s.span(y + 3, 2, 3, ink.cream); // resting chin meets the inward tip instead of floating over a large hole
  s.span(y - 1, 1, 2, ink.caramel); s.dot(ears ? 2 : 1, y - 2, ink.caramel);
  s.dot(4, y - 1, ink.caramel); s.dot(4, y - 2, ink.caramel);
  s.tint(1, y - 1, ink.blush); s.tint(1, y + 1, ink.cocoa); s.tint(2, y + 1, ink.cocoa);
  s.tint(0, y + 1, ink.berry); s.tint(7, 3, ink.toast); s.tint(8, 4, ink.toast);
  return { name: '午睡的小橘', story: '小橘把尾巴卷成了一个小枕头，连院门响了也没抬起眼皮。' };
};

export const squirrel: Artist = (s, r) => {
  const sweep = r.take(3), hold = r.take(2), ear = r.take(3), foot = r.take(2), belly = r.take(2);
  // The plume grows from the haunch on the left, sweeps up, then curls over an open notch.
  s.span(7, 2, 4, ink.russet); s.span(6, 1, 3, ink.russet); s.span(5, 0, 2, ink.russet);
  s.span(4, 0, 1, ink.russet); s.span(3, 0, 1, ink.russet);
  s.span(2, 0, sweep === 1 ? 1 : 2, ink.russet); s.span(1, 1, 4, ink.russet);
  s.span(0, sweep === 2 ? 1 : 2, 4, ink.caramel); s.dot(4, 2, ink.caramel);
  if (sweep !== 1) s.span(3, sweep === 2 ? 4 : 3, 4, ink.biscuit);
  // Sitting on the haunches, not a vertical head icon. A second air slit separates nut and knee.
  s.span(5, 4, 6, ink.russet); s.span(6, 3, 6, ink.russet);
  s.span(7, 3, belly ? 6 : 5, ink.russet); s.span(8, 3, 5, ink.russet);
  s.span(9, foot ? 2 : 3, foot || hold ? 6 : 7, ink.toast); // leave air beside a lowered acorn
  s.part(6, 2, ['.##.', '####', '###.'], ink.caramel);
  s.dot(ear === 1 ? 8 : 7, 1, ink.russet); if (ear === 2) s.dot(7, 0, ink.russet);
  s.tint(7, 3, ink.cocoa); s.tint(9, 3, ink.cocoa); s.tint(7, 4, ink.cream);
  const cap = 6 + hold;
  s.dot(8, cap - 1, ink.moss); s.span(cap, 7, 9, ink.chestnut); s.span(cap + 1, 7, 9, ink.caramel);
  s.dot(8, cap + 2, ink.biscuit); s.span(cap, 5, 7, ink.biscuit);  // forepaws actually touch the cap
  s.tint(2, 2, ink.cream); s.tint(1, 4, ink.caramel); s.tint(5, 6, ink.cream);
  return { name: '抱果实的小栗鼠', story: '小栗鼠两只爪子抱紧了橡果，蓬松的大尾巴替它挡住身后的风。' };
};

export const rooster: Artist = (s, r) => {
  const fan = r.take(3), comb = r.take(3), stride = r.take(3), beak = r.take(2), breast = r.take(2);
  s.part(2, 4, ['..####', '.#####', '######', '.####.'], ink.biscuit);
  if (breast) s.dot(7, 7, ink.caramel);
  // Two separate swept flight feathers share a root; do not fill the notch between their tips.
  s.part(0, fan === 1 ? 1 : 2, ['##..', '.##.', '..##', '..##'], ink.moss);
  s.part(0, 4, ['##..', '.##.', '..##'], ink.sage);
  if (fan === 2) { s.dot(0, 1, ink.moss); s.dot(0, 6, ink.moss); s.dot(1, 6, ink.sage); }
  s.part(5, 1, ['.###', '.###', '####'], ink.corn);
  s.span(1, comb === 2 ? 5 : 6, 8, ink.berry);
  s.dot(comb === 2 ? 5 : 6, 0, ink.berry); s.dot(comb === 1 ? 7 : 8, 0, ink.berry);
  s.dot(9, 2, ink.gold); s.dot(8, 4, ink.berry);
  if (!beak) s.dot(9, 4, ink.gold); // upper and lower beak part to crow
  s.tint(7, 2, ink.cocoa); s.tint(4, 5, ink.russet); s.tint(5, 5, ink.russet); s.tint(4, 6, ink.toast);
  s.dot(4, 8, ink.toast); s.span(9, stride === 2 ? 2 : 3, 4, ink.gold);
  if (stride === 1) s.span(8, 6, 8, ink.gold);
  else { s.dot(6, 8, ink.toast); s.span(9, 6, stride === 2 ? 8 : 7, ink.gold); }
  return { name: '叫醒小院的公鸡', story: '公鸡扬起头，第一声早安从两片张开的尖嘴间飞了出去。' };
};

export const goat: Artist = (s, r) => {
  const stride = r.take(3), horns = r.take(3), ear = r.take(2), scarf = r.take(3), tail = r.take(2);
  s.span(5, 4, 9, ink.cream); s.span(6, 4, 8, ink.cream);  // compact body with the neck ahead of it
  s.span(7, 7, 8, ink.linen); s.dot(8, 8, ink.linen);
  s.span(9, stride === 2 ? 7 : 8, stride === 0 ? 9 : 8, ink.toast);
  s.dot(5, 7, ink.linen); s.span(8, 4, 5, ink.linen);
  if (stride === 1) s.span(8, 3, 4, ink.toast); else s.span(9, stride === 2 ? 2 : 3, 4, ink.toast);
  s.span(4, tail ? 8 : 9, 9, ink.linen); if (tail) s.dot(9, 3, ink.cream);
  s.part(0, 2, ['..####', '.####.', '#####.'], ink.cream);   // long muzzle pointing left
  s.dot(1, 5, ink.linen);                                    // a little beard, separate from the scarf fringe
  s.span(1, 2, 3, ink.caramel); s.dot(horns === 1 ? 2 : 3, 0, ink.caramel);
  s.dot(5, 1, ink.caramel); s.span(0, 5, horns === 2 ? 6 : 5, ink.caramel);
  s.span(2, 5, 7, ink.cream); s.span(3, 6, ear ? 6 : 7, ink.blush);
  s.tint(2, 3, ink.cocoa); s.tint(0, 4, ink.cocoa); s.tint(2, 4, ink.blush);
  // Tie the neckerchief around a real neck, with a knotted end fluttering in front of the lifted hoof.
  s.span(5, 3, 5, ink.apricot); s.span(6, scarf === 1 ? 2 : 3, 4, ink.peach);
  s.span(7, scarf === 2 ? 1 : 2, 3, ink.apricot); s.tint(4, 5, ink.gold);
  return { name: '围着领巾的奶团', story: '奶团抬脚跨过门槛，杏色小领巾的一角跟着它轻轻晃了一下。' };
};

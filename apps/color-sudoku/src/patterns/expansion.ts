import type { Bit, Puzzle, Size } from '../contracts.ts';
import { deriveClues } from '../core/clues.ts';
import { stages } from '../core/progression.ts';

type Point = readonly [number, number];
type Layer = (x: number, y: number) => boolean;
type Subject = { name: string; story: string; layers: Layer[] };
const palette = ['#586f52', '#84a179', '#d08c63', '#f0c27a', '#8d625b', '#e9a797'];
const oval = (cx: number, cy: number, rx: number, ry: number): Layer =>
  (x, y) => ((x - cx) / rx) ** 2 + ((y - cy) / ry) ** 2 <= 1;
const polygon = (...points: Point[]): Layer => (x, y) => {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const [a, b] = points[i], [c, d] = points[j];
    if ((b > y) !== (d > y) && x < (c - a) * (y - b) / (d - b) + a) inside = !inside;
  }
  return inside;
};
const rect = (left: number, top: number, right: number, bottom: number): Layer =>
  (x, y) => x >= left && x < right && y >= top && y < bottom;
const subject = (name: string, story: string, ...layers: Layer[]): Subject => ({ name, story, layers });
const small = [
  { name: '掉下来的小靴子', story: '雨停了，泥印从门口一直排到小桌边。', paper: ['.11..','.11..','.111.','.1233','.3333'], reserve: ['111..','221..','211..','11133','333.3'] },
  { name: '木头小船', story: '奶团把小船放进雨水坑，看它慢慢漂向另一岸。', paper: ['..3..','.33..','2333.','11111','.222.'], reserve: ['.3...','.33..','.333.','11112','2222.'] },
  { name: '戴围巾的雪兔', story: '围巾被风吹歪了，雪兔看起来更像在朝你摆手。', paper: ['.22.22.','.24.42.','.22222.','2222222','.33333.','..222..','.22222.'], reserve: ['22..22.','.24.42.','.2222..','222222.','3333333','..222..','.22.22.'] },
  { name: '枝头的喜鹊', story: '喜鹊衔着一枚松子，找了一处稳稳的树枝。', paper: ['..11...','.121...','.1113..','..111..','...111.','.411411','44411..'], reserve: ['...11..','..1123.','..111..','.11111.','1111...','..44...','444444.'] },
];
const subjects = [
  subject('窗台咖啡杯', '还冒着热气，杯把那边晒到一点太阳。',
    oval(15, 10, 4, 4), polygon([2,6],[15,6],[14,15],[12,17],[5,17],[3,14]), rect(3, 7, 14, 10), oval(8, 7, 6, 2)),
  subject('摇晃的水壶', '沿花盆边慢慢浇，别把刚探头的小苗冲倒。',
    oval(14.5, 9.5, 4, 4), polygon([1,6],[4,6],[8,14],[7,16],[4,13]), oval(10, 13, 6, 5), rect(7, 7, 13, 10), oval(10, 14, 4, 2)),
  subject('蜷起来的叶芽', '第一场暖雨过后，窗纱旁多了一点嫩绿。',
    polygon([8,18],[10,9],[13,8],[11,19]), oval(12, 8, 6, 5), oval(7, 11, 4.5, 3), polygon([7,13],[15,4],[16,5],[10,14])),
  subject('条纹花盆', '奶团种下三粒种子，给最大的花盆留了个位置。',
    polygon([4,9],[17,9],[15,18],[6,18]), rect(3, 8, 18, 11), oval(10, 5, 5, 3.5), rect(7, 12, 15, 14), oval(12, 4, 2.5, 2.5)),
  subject('灯笼花', '两朵灯笼挂得高低不同，晚风一吹便碰在一起。',
    rect(9, 2, 11, 17), oval(7, 10, 5, 6), oval(14, 7, 3, 4), rect(6, 15, 8, 19), oval(7, 9, 3, 4)),
  subject('蜗牛的新屋', '雨珠从壳上滚下来，蜗牛终于决定继续赶路。',
    oval(8.5, 9, 6, 6), oval(10, 14.5, 8.5, 3.3), oval(15.5, 12, 2.8, 4), rect(16, 5, 17.8, 11), oval(8, 8.5, 3.5, 3.5)),
  subject('蜜桃果酱', '玻璃罐还温热。奶团给它扎了一根红绳。',
    oval(10, 12, 6.5, 7), rect(5, 4, 15, 7), rect(4, 3, 16, 5), oval(10, 13, 5.5, 4), rect(6, 10, 14, 13)),
  subject('挂在窗边的风铃', '叮当两声以后，小院就安静下来。',
    rect(9, 1, 11, 6), oval(10, 9, 6, 5), polygon([5,8],[15,8],[17,15],[3,15]), rect(9, 14, 11, 19), oval(10, 12, 4, 2)),
  subject('半块西瓜', '野餐桌上最后一块西瓜，被奶团留给了晚到的朋友。',
    polygon([2,5],[19,8],[16,15],[12,18],[7,17],[3,13]),
    polygon([3,6],[18,8],[14,14],[10,16],[6,14]), oval(8, 9, 1, 1.5), oval(12, 10, 1, 1.5), oval(9, 13, 1, 1)),
  subject('格纹野餐篮', '篮子里装着面包和果酱，走快一点就会咯吱响。',
    oval(10, 8, 6, 6), polygon([2,9],[18,9],[16,16],[14,18],[5,18]),
    rect(3, 10, 17, 12), rect(7, 12, 9, 17), rect(12, 12, 14, 17)),
  subject('山路水瓶', '翻过一小段陡坡，每人都喝一口凉水。',
    polygon([7,2],[13,2],[13,6],[16,8],[16,16],[14,19],[5,19],[4,16],[4,8],[7,6]),
    rect(7, 1, 13, 4), rect(4, 10, 16, 15), rect(8, 11, 12, 14)),
  subject('露营小锅', '小锅里的汤开了，大家端着碗围到石头边。',
    oval(9, 12, 7, 5.5), rect(13, 9, 19, 11), oval(9, 8, 7, 2.5), rect(7, 4, 11, 6), oval(9, 7, 5, 2)),
  subject('田野里的帽子', '坐下休息才发现，帽檐里别着一枝草花。',
    oval(9.8, 13, 9, 4), oval(9.5, 9, 5.5, 5.2), rect(4, 9, 15, 12), oval(13.5, 8.8, 2, 2.2), oval(13, 9, .8, .8)),
  subject('打结的风筝', '风筝终于飞过栅栏，尾巴在空中晃了三下。',
    polygon([10,1],[17.9,8],[10,15],[3,8]), polygon([9,11],[12,11],[10,16],[14,18],[12,19],[8,16]), polygon([10,1],[10,14],[3,8]), polygon([10,8],[17,8],[10,14])),
  subject('春天的蜜蜂', '暖阳晒过花园，第一只蜜蜂停在紫色花尖。',
    oval(10, 12, 8.8, 4.8), oval(8, 7, 4, 4.8), oval(13.8, 7, 3.8, 4.5),
    oval(10, 12, 5.7, 4.4), rect(8, 8, 10, 16), rect(12, 8, 14, 16), oval(4, 11, 1.3, 1.1)),
  subject('夏夜的蘑菇灯', '萤火虫散开以后，山谷里还亮着一盏小灯。',
    polygon([6,18],[7,11],[13,11],[14,18]), oval(9.8, 8.7, 8.5, 6.4),
    oval(7, 8, 2.3, 2.1), oval(12.5, 6, 2.1, 1.6), oval(14, 10, 1.6, 1.4), rect(8, 15, 12, 17)),
  subject('秋日的松果', '松果握在手心有点扎，闻起来像晒过的木头。',
    oval(10, 11.2, 6.4, 7.5), polygon([8,5],[10,1],[13,2],[11,7]),
    polygon([6,8],[10,10],[14,8],[10,13]), polygon([5,12],[10,14],[15,12],[10,17]), oval(10, 16.5, 2, 2.2)),
  subject('冬夜的小屋', '屋顶的雪一夜没化，窗里透出一格橘色的光。',
    polygon([2,9],[10,2],[18,10]), rect(4, 9, 16, 18), rect(13, 3, 16, 10),
    rect(6, 11, 9, 14), rect(11, 11, 14, 14), rect(8, 14, 11, 18)),
  subject('山谷的小狐狸', '狐狸把尾巴搭在爪子上，隔着落叶看了你好久。',
    polygon([3,3],[8,7],[13,7],[17,3],[16,13],[10,17],[4,13]), oval(13, 14, 6, 4.5),
    polygon([4,10],[9,11],[10,15],[11,11],[16,10],[10,16]), oval(10, 13.5, 1.1, .8), oval(16, 16, 2, 1.3)),
  subject('云边的热气球', '看不见篮子之前，抬头还能看见它的花纹。',
    oval(10, 8, 8, 6.8), polygon([5,10],[15,10],[12,16],[8,16]), rect(8, 15, 12.7, 19),
    oval(10, 7.5, 3.5, 6.3), rect(8, 16, 12.5, 17.5)),
];

function random(seed: number) {
  let state = (seed + 1) | 0;
  return () => {
    state = (Math.imul(state, 1664525) + 1013904223) | 0;
    return (state >>> 0) / 4294967296;
  };
}

export function connected(solution: readonly Bit[], size: Size): boolean {
  const first = solution.indexOf(1);
  if (first < 0) return false;
  const reached = new Set([first]);
  for (const at of reached) {
    for (const next of [at - size, at + size, at % size > 0 ? at - 1 : -1, at % size < size - 1 ? at + 1 : -1]) {
      if (solution[next] === 1) reached.add(next);
    }
  }
  return reached.size === solution.filter(Boolean).length;
}

export function expansionPuzzle(id: number, seed: number): Puzzle {
  const { size, book } = stages.find(stage => (stage.ids as readonly number[]).includes(id))!;
  const recipe = id <= 16 ? small[id - 13] : subjects[id - 17];
  const rng = random(seed);
  const colors: (string | null)[] = [];
  if ('paper' in recipe) {
    const paper = seed >= 100 ? recipe.reserve : recipe.paper;
    for (const row of paper) for (const cell of row) colors.push(cell === '.' ? null : palette[Number(cell) - 1]);
    if (seed % 100 > 0) for (let i = 0; i < 1 + seed % 3; i++) {
      const at = Math.floor(rng() * colors.length);
      colors[at] = colors[at] ? null : palette[Math.floor(rng() * palette.length)];
    }
  } else {
    const slope = (rng() - .5) * .59;
    const width = .82 + rng() * .34, height = .85 + rng() * .3;
    const offsetX = rng() - .5, offsetY = rng() - .5;
    for (let row = 0; row < size; row++) for (let column = 0; column < size; column++) {
      const y = ((row + .5) * 20 / size - 10) / height + 10 + offsetY;
      const x = ((column + .5) * 20 / size - 10) / width + 10 + offsetX + (y - 10) * slope;
      let color: string | null = null;
      for (const [i, layer] of recipe.layers.entries()) {
        if (layer(x, y)) color = palette[(i + id) % palette.length];
      }
      colors.push(color);
    }
  }
  const solution = colors.map(color => color ? 1 : 0);
  return { ...deriveClues(solution, size), id, size, seed, book, solution, sticker: { size, colors, name: recipe.name, story: recipe.story } };
}

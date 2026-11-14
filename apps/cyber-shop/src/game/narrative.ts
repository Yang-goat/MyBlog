import { CHARACTERS, ITEMS } from '../content';
import type { GameState, Visitor } from './types';
const greetings:Record<string,string>={
 'lin-qiao':'路过就来看看。街坊们总有些舍不得丢的旧东西。',
 'lu-che':'又跑到这条巷子了。今天的路线还算顺，我停一小会儿。',
 'song-yi':'夜班还没开始，过来看看有没有合适的旧器械。',
 'wen-zhu':'旧城又拆了一块站牌。有些声音，还是该留在人的耳朵里。',
 'he-jin':'工坊这几天忙，我趁换班来转一圈。',
 'a-miao':'食堂刚收了早班。我得在晚饭前把补给的事安排好。',
 'qi-lan':'货路又换了条走法，不过这扇门还好找。',
 'bai-heng':'路又走了一圈。经过这条街，就想进来坐坐。',
 'luo-jin':'今天想慢慢看。旧东西摆在一起，总有些新的联系。',
 'shen-wu':'刚从轨道检修站下来，来看看下层工坊的近况。',
};
/** A meeting alone must not imply a trade or a successful repair. */
export function visitorGreeting(s:GameState,visitor?:Visitor){
 const person=CHARACTERS.find(c=>c.id===visitor?.characterId);if(!person)return '';
 const pending=s.orders.find(o=>!o.delivered&&o.kind==='client'&&o.characterId===person.id);
 if(pending){const item=s.items.find(i=>i.id===pending.itemId),name=ITEMS.find(d=>d.id===item?.definitionId)?.name??'旧物';return pending.verified?`那件${name}已经复检通过了，方便时帮我办一下交付。`:`那件${name}还留在你的工作台上。我先看看今天的货。`;}
 const previous=[...(s.repairHistory??[])].reverse().find(r=>r.kind==='client'&&r.characterId===person.id);
 if(previous){const name=ITEMS.find(i=>i.id===previous.definitionId)?.name??'旧物';return `上回那件${name}已经取回了，工序单我也留着。今天又走到你这扇门前。`;}
 return s.met.includes(person.id)?greetings[person.id]??person.returning:person.intro;
}

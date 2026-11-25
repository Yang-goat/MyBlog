/** Original, layered scenery. No baked shop plate: all fixtures share the UI's coordinates. */
export interface RoomSurface {x:number;y:number;width:number;height:number}
export type RoomSurfaces=Partial<Record<'incoming'|'trade'|'warehouse',RoomSurface>>;
export interface RoomView { day: number; hours: number; maxHours?: number; closed: boolean; chapter: number; repairs: number; equipment: Record<string, number>; motion: boolean; pointer: number; time: number; owned?: boolean; surfaces?:RoomSurfaces }
export interface RoomArt {
  street?: HTMLImageElement;
  metal?: HTMLImageElement;
  terminal?: HTMLImageElement;
  solder?: HTMLImageElement;
  cup?: HTMLImageElement;
  plant?: HTMLImageElement;
}
export function drawRoom(ctx: CanvasRenderingContext2D, width: number, height: number, view: RoomView, art:RoomArt={}) {
  const {street,metal,terminal,solder,cup,plant}=art;
  const W = 1440, H = 900;
  ctx.setTransform(width / W, 0, 0, height / H, 0, 0);
  const rect = (x: number, y: number, w: number, h: number, color: string | CanvasGradient) => { ctx.fillStyle = color; ctx.fillRect(x,y,w,h); };
  const line = (x: number,y: number,x2: number,y2: number,color: string,size=1) => { ctx.strokeStyle=color;ctx.lineWidth=size;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y2);ctx.stroke(); };
  const ellipse = (x: number,y: number,rx: number,ry: number,color: string) => { ctx.fillStyle=color;ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);ctx.fill(); };
  const poly = (points: number[][],color: string) => { ctx.fillStyle=color;ctx.beginPath();points.forEach(([x,y],i)=>i?ctx.lineTo(x!,y!):ctx.moveTo(x!,y!));ctx.closePath();ctx.fill(); };
  const text = (label: string,x: number,y: number,size: number,color: string,font='monospace') => { ctx.fillStyle=color;ctx.font=`${size}px ${font}`;ctx.fillText(label,x,y); };
  const glow = (x: number,y: number,r: number,color: string) => { const g=ctx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,color);g.addColorStop(1,'transparent');rect(x-r,y-r,r*2,r*2,g); };
  const gradient = (x: number,y: number,w: number,h: number,top: string,bottom: string) => { const g=ctx.createLinearGradient(x,y,x,y+h);g.addColorStop(0,top);g.addColorStop(1,bottom);ctx.fillStyle=g;ctx.fillRect(x,y,w,h); };
  const patina=(x:number,y:number,w:number,h:number,alpha=.23)=>{if(!metal?.complete||!metal.naturalWidth)return;ctx.save();ctx.globalAlpha=alpha;ctx.globalCompositeOperation='luminosity';ctx.drawImage(metal,0,0,metal.naturalWidth,metal.naturalHeight,x,y,w,h);ctx.restore();};
  const screw = (x: number,y: number) => { ellipse(x+1,y+2,3,3,'#090f10');ellipse(x,y,2.4,2.4,'#78817a');line(x-1.5,y,x+1.5,y,'#25312e'); };
  const frame = (x: number,y: number,w: number,h: number) => {
    rect(x+6,y+7,w,h,'#050c10aa');gradient(x,y,w,h,'#566775','#293a48');rect(x+3,y+3,w-6,h-6,'#223441');patina(x,y,w,h);
    line(x+2,y+2,x+w-2,y+2,'#8da3ad',2);line(x+2,y+h,x+w,y+h,'#0b1518',4);
    [[x+8,y+8],[x+w-8,y+8],[x+8,y+h-8],[x+w-8,y+h-8]].forEach(([a,b])=>screw(a!,b!));
  };
  const rail = (x: number, y: number, w: number, lit: boolean) => {
    gradient(x - 3, y - 3, w + 6, 10, '#1b303a', '#07141d');
    line(x, y, x + w, y, lit ? '#b9e8db' : '#52716f', 2);
    line(x, y + 3, x + w, y + 3, lit ? '#72b9af85' : '#21383b');
  };
  function placeProp(sprite: HTMLImageElement | undefined, x: number, base: number, tall: number, footRatio: number) {
    if (!sprite?.complete || !sprite.naturalWidth) return;
    // The room stretches with the viewport, so correct the prop width in canvas coordinates.
    const wide = tall * (sprite.naturalWidth / sprite.naturalHeight) * (height / H) / (width / W);
    ellipse(x, base - 1, wide * footRatio, 4, '#07101b78');
    ctx.drawImage(sprite, x - wide / 2, base - tall, wide, tall);
  }
  // The three fitted surfaces belong to different depth planes: street, counter, under-counter.
  const inventoryTray=(surface:RoomSurface|undefined,kind:'outside'|'counter'|'storage')=>{
    if(!surface)return;
    const {x,y,width:w,height:h}=surface;
    if(kind==='outside'){
      // Street-side galvanized steel, with a rolled rim and drain slots beyond the cells.
      rect(x-5,y+h+5,w+10,8,'#06131bd6');
      gradient(x-5,y-4,w+10,h+10,'#7296a0','#285061');
      gradient(x,y,w,h,'#294653','#142c39');
      patina(x,y,w,h,.13);
      line(x-3,y-3,x+w+3,y-3,'#add7d7',1.5);
      line(x-4,y+h+3,x+w+4,y+h+3,'#628891',3);
      line(x-4,y,x-4,y+h,'#7ee0dc88',2);
      line(x+w+4,y,x+w+4,y+h,'#b77da18a',2);
      for(let k=14;k<w-12;k+=24)line(x+k,y+h+5,x+k+9,y+h+5,'#132c38',2);
      for(const a of [x+8,x+w-8])screw(a,y-2);
    }else if(kind==='counter'){
      // A removable rubber bench mat with a worn bronze edge.
      rect(x-5,y-4,w+10,h+11,'#071319ad');
      gradient(x-4,y-3,w+8,h+7,'#b4a17b','#514b40');
      gradient(x,y,w,h,'#444044','#2d2e33');
      patina(x,y,w,h,.09);
      line(x-3,y-2,x+w+3,y-2,'#d6bc8c',1.5);
      line(x-3,y+h+3,x+w+3,y+h+3,'#736a56',2);
      for(const a of [x+8,x+w-8])screw(a,y+h+2);
    }else{
      // Recessed warehouse rails light the tray below the counter lip.
      rect(x-9,y-9,w+18,h+19,'#071721');
      poly([[x-8,y-8],[x,y],[x,y+h],[x-8,y+h+8]],'#3e5258');
      poly([[x+w+8,y-8],[x+w,y],[x+w,y+h],[x+w+8,y+h+8]],'#283e45');
      gradient(x,y,w,h,'#0d1c26','#203642');
      gradient(x,y,w,12,'#050e17a0','#050e1700');
      line(x-8,y-8,x+w+8,y-8,'#516a70',2);
      gradient(x-8,y+h,w+16,7,'#748988','#29404a');
      line(x-8,y+h,x+w+8,y+h,'#9ec3b7',1.5);
      line(x-8,y+h+8,x+w+8,y+h+8,'#081820',3);
      for(const a of [x-4,x+w+4])screw(a,y+h+4);
    }
  };
  const incoming=view.surfaces?.incoming,trade=view.surfaces?.trade;
  const windowBottom=incoming?incoming.y+incoming.height+14:490,windowHeight=windowBottom-85;
  const counterBack=windowBottom+2,counterFront=Math.max(counterBack+90,trade?trade.y+trade.height+29:613);
  const t=view.motion?view.time/1000:0;
  const night=view.closed?1:1-view.hours/(view.maxHours??12);
  const rain=view.day%4!==0;
  gradient(0,0,W,H,'#283744','#18242d');
  // Large wall panels keep the fittings readable and carry reflected street light.
  for(let col=0;col<12;col++){
    const x=col*128;
    gradient(x+2,50,124,600,col%3===0?'#3b4850':'#323f49','#24323e');
    line(x+2,55,x+2,650,'#8292992a');
    line(x+126,55,x+126,650,'#0e1c25',2);
    for(const y of [76,273,493]){line(x+4,y,x+124,y,'#111d26');screw(x+10,y+7);}
  }
  patina(0,0,W,650,.15);
  rect(18,0,9,590,'#152d30');line(23,0,23,590,'#6a7a6a',2);
  rect(1410,0,8,600,'#142a2c');line(1412,0,1412,600,'#6a796c',2);
  for(let y=45;y<590;y+=120){rect(13,y,20,7,'#586b5f');rect(1405,y,18,7,'#53665d');}
  // Deep window recess. Street layers move independently of the fixed counter.
  frame(328,74,784,windowBottom-74);rect(340,84,760,windowHeight+1,'#071c26');
  ctx.save();ctx.beginPath();ctx.rect(342,85,756,windowHeight);ctx.clip();
  gradient(342,85,756,windowHeight,night>.6?'#0d2337':'#294658','#142d36');
  const shift=view.motion?view.pointer*5:0;
  for(let i=0;i<15;i++){
    const x=330+i*58+shift*.4,y=110+(i*43)%90,w=45+(i*7)%25;
    rect(x,y,w,260,'#172e3d');line(x,y,x+w,y,'#365360');
    for(let r=0;r<12;r++)for(let c=0;c<3;c++)if((i*17+r*3+c)%5<2)rect(x+8+c*12,y+12+r*17,4,7,((r+i)%3)?'#7f8c7480':'#c6a46b80');
    if(i%3===0){rect(x+9,y-10,w-18,10,'#1b3441');line(x+20,y-10,x+20,y-32,'#50686c');}
  }
  glow(910,170,160,'#ac7c4138');glow(485,230,150,'#439e9b48');
  rect(349+shift,167,110,210,'#183234');rect(358+shift,181,88,13,'#1b4c4d');
  text('RADIO',365+shift,192,12,'#89c8bb');
  for(let i=0;i<4;i++){rect(364+shift,211+i*28,70,20,'#10272d');rect(370+shift,215+i*28,8,11,'#d3a26c88');}
  rect(993+shift,130,90,260,'#284342');rect(1011+shift,155,24,125,'#3c3531');
  ctx.save();ctx.shadowColor='#e9b27a';ctx.shadowBlur=12;text('夜',1014+shift,181,18,'#e6bb88','sans-serif');text('航',1014+shift,210,18,'#e6bb88','sans-serif');text('線',1014+shift,239,18,'#e6bb88','sans-serif');ctx.restore();
  line(345,147,1100,122,'#071c23',2);line(345,152,1100,130,'#526368',.7);
  gradient(342,352,756,76,'#273e43','#193438');
  for(let i=0;i<16;i++)line(350+i*48,382+(i%4)*8,375+i*48,382+(i%4)*8,i%3?'#5d877b55':'#cc9a6d66',2);
  if(street?.complete&&street.naturalWidth){
    // A separate illustrated street plane; window geometry, weather and fixtures remain live.
    const ratio=(766*width/W)/((windowHeight+6)*height/H);
    const sourceWidth=Math.min(street.naturalWidth,street.naturalHeight*ratio);
    const sourceHeight=sourceWidth/ratio;
    ctx.drawImage(street,(street.naturalWidth-sourceWidth)/2,street.naturalHeight-sourceHeight,sourceWidth,sourceHeight,338+shift,82,766,windowHeight+6);
    rect(342,85,756,windowHeight,`rgba(5,24,36,${.12+night*.25})`);
    glow(450,285,155,'#49dce218');glow(1010,220,150,'#c35bdf15');
  }
  if(rain){
    // Passing street light travels across the wet pavement, beneath the foreground fixtures.
    const travel=265+((t*26+175)%950);
    const pavement=(incoming?.y??windowBottom-54)-14;
    glow(travel,pavement,66,'#e5a26819');
    for(let i=0;i<5;i++){
      const spread=11+i*7+Math.sin(t*2+i)*4;
      const y=pavement+i*3;
      line(travel-spread,y,travel+spread,y,'#ffc78323',1.5);
    }
  }
  if(rain)for(let i=0;i<90;i++){
    const x=342+(i*137)%760,y=85+((i*71+t*(105+i%5*13))%windowHeight);
    line(x,y,x-3,y+13,'#a0c9cb25');
  }
  // Glass highlights and raindrops on the close pane.
  poly([[342,85],[460,85],[650,windowBottom],[572,windowBottom]],'#b7dbc407');
  for(let i=0;i<14;i++){const x=360+(i*83)%720,y=110+(i*59)%290;line(x,y,x-2,y+19,'#a6d6d535');}
  inventoryTray(incoming,'outside');
  ctx.restore();
  // This sill is in front of the receiving shelf and separates rainy street from the dry counter.
  gradient(333,windowBottom,774,9,'#70838b','#3b5260');
  line(340,windowBottom,1100,windowBottom,'#9db9c0',2);line(333,windowBottom+9,1107,windowBottom+9,'#102834',3);
  // Shop beam and retractable metal shutter, separate from the outside street.
  gradient(0,0,W,66,'#1a2936','#0c1b28');line(0,63,W,63,'#58717b',3);
  patina(0,0,W,64,.16);
  line(0,48,W,48,'#030d17',4);line(0,45,W,45,'#546471',1);
  for(let i=0;i<8;i++)screw(i*192+16,18);
  rail(72,51,172,!view.closed);rail(1196,51,172,!view.closed);
  gradient(330,67,780,27,'#42535f','#182e39');
  for(let i=0;i<24;i++){const x=333+i*32;rect(x,69,30,19,i%4===0?'#405967':'#2d414e');line(x,69,x,90,'#64798566');}
  line(339,94,1099,94,'#72cbd0',2);glow(355,103,85,'#49c6d52a');glow(1079,103,80,'#b36cdb20');
  // Compact utility lights retain a warm work surface inside the cooler street.
  for(const x of [302,1138]){
    const sway=Math.sin(t*.6+x)*2;
    line(x,61,x+sway,133,'#131e20',3);
    poly([[x-27+sway,150],[x-13+sway,132],[x+13+sway,132],[x+27+sway,150]],'#484b4d');
    line(x-13+sway,132,x+13+sway,132,'#a9987a');
    ellipse(x+sway,151,27,6,view.closed?'#7c7466':'#f2d8ac');
    if(!view.closed)glow(x,186,95,'#e8c47c30');
  }
  // Future industrial terminal casing; live numbers remain accessible DOM.
  frame(32,99,270,159);rect(43,111,224,126,'#111e24');gradient(51,118,208,111,'#122e2e','#0b2024');
  for(let y=119;y<229;y+=4)line(53,y,257,y,'#bcebd504');
  for(let y=120;y<205;y+=7)line(276,y,290,y,'#101e23',2);
  ellipse(283,223,7,7,'#111e20');ellipse(282,222,4,4,'#859280');
  if(terminal?.complete&&terminal.naturalWidth)ctx.drawImage(terminal,29,95,278,165);
  // Display cabinet, glass reflections and empty shelves.
  frame(32,300,270,190);gradient(44,312,246,162,'#163432','#0d2528');
  poly([[44,312],[90,312],[180,474],[146,474]],'#a7d7ca0b');
  for(const y of [379,461]){rect(43,y,248,6,'#627567');rect(43,y+6,248,4,'#11272a');line(46,y,287,y,'#bcc2a0');}
  glow(165,319,100,'#cbb47810');line(46,314,287,314,'#b6c89a',2);
  if(view.equipment['display-case']){
    glow(165,404,110,'#d1b86c20');
    rail(47,391,239,!view.closed);
  }
  // The right-hand call terminal has a physical, lit push-button.
  frame(1135,115,271,181);rect(1148,127,245,127,'#102b2c');
  for(let y=130;y<251;y+=4)line(1151,y,1389,y,'#c0e7a805');
  if(terminal?.complete&&terminal.naturalWidth)ctx.drawImage(terminal,1131,111,278,186);
  // Solder station / tools. Equipment appears as it is bought.
  frame(1135,333,271,137);rect(1150,349,240,88,'#152d2f');
  rect(1162,370,72,45,'#6e8275');rect(1169,376,42,19,'#16382e');text('24.0',1171,391,13,'#a9d3a4');
  ellipse(1221,386,5,5,'#cc9b6d');line(1232,398,1266,424,'#111d23',4);line(1266,424,1290,398,'#111d23',4);
  poly([[1285,359],[1294,363],[1253,409],[1246,405]],'#bca176');line(1290,363,1305,345,'#b9c3b0',3);
  for(let i=0;i<3;i++) {rect(1330+i*17,365,9,53,['#a1aa93','#b68e65','#668f85'][i]!);ellipse(1334+i*17,365,4.5,3,'#c4c6a9');}
  if(view.chapter>=2){ellipse(1364,411,14,7,'#6e9a91');glow(1364,403,28,'#88d6c93a');}
  if(solder?.complete&&solder.naturalWidth){rect(1141,339,259,109,'#253c37');patina(1141,339,259,109,.3);ctx.drawImage(solder,1140,328,260,130);}
  // One dry, continuous shop counter. Only the middle grid is inset into this desktop.
  gradient(0,counterBack,W,counterFront-counterBack,'#6d6c63','#434752');
  patina(0,counterBack,W,counterFront-counterBack,.35);
  ctx.save();ctx.beginPath();ctx.rect(0,counterBack,W,counterFront-counterBack);ctx.clip();
  glow(236,counterBack+30,245,'#edb97822');glow(1326,counterBack+21,225,'#82b4bf21');
  ctx.restore();
  for(let i=0;i<48;i++){const x=(i*157)%1440,y=counterBack+9+(i*23)%(counterFront-counterBack-18);line(x,y,x+12+(i%5)*5,y+.4,'#d4c8a914');}
  line(0,counterBack,W,counterBack,'#929e90',3);
  line(0,counterFront,W,counterFront,'#adbaaa',3);
  gradient(0,counterFront+3,W,Math.max(32,650-counterFront-3),'#535762','#233645');line(0,648,W,648,'#0b1d27',5);
  inventoryTray(trade,'counter');
  // Measuring ruler, a steaming enamel cup and plant keep the workbench lived-in.
  for(let i=0;i<60;i++)line(352+i*12,counterFront-8,352+i*12,counterFront-12-(i%5===0?5:0),'#d0c8a866');
  const propBase = counterBack + 52;
  placeProp(plant, 94, propBase + 6, 91, .26);
  placeProp(cup, 207, propBase, 42, .36);
  if (!view.closed && cup?.naturalWidth) {
    for (let i = 0; i < 2; i++) {
      const rise = (t * 12 + i * 15) % 32;
      const x = 203 + Math.sin(t + i) * 3;
      const y = propBase - 36 - rise;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.bezierCurveTo(x + 5, y - 4, x - 6, y - 8, x - 1, y - 12);
      ctx.strokeStyle = `rgba(240,219,192,${.17 * (1 - rise / 32)})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }
  // Cabinets below the slab, recessed warehouse and pinned order board.
  gradient(0,650,W,250,'#2a3846','#182936');
  gradient(323,650,788,36,'#06141dd9','#06141d00');
  for(const x of [17,315,1112,1412]){rect(x,650,9,250,'#122b2b');line(x+10,653,x+10,900,'#6c76604d',2);}
  inventoryTray(view.surfaces?.warehouse,'storage');
  for(let i=0;i<3;i++){rect(23,661+i*74,278,64,'#30434d');patina(23,661+i*74,278,64);line(25,662+i*74,299,662+i*74,'#5b7b84');rect(118,678+i*74,82,7,'#172e2c');line(121,678+i*74,198,678+i*74,'#9ba382');}
  rect(1137,482,268,158,'#202f2d');for(let i=0;i<8;i++)screw(1150+i*34,488);
  for(let row=0;row<3;row++)for(let col=0;col<2;col++){
    const x=1138+col*137,y=665+row*52;gradient(x,y,130,45,'#425963','#233d48');patina(x,y,130,45);line(x,y,x+130,y,'#6c8990');rect(x+44,y+7,42,5,'#1f352f');
  }
  // Restrained neon spill follows physical fixture edges, never the inventory contents.
  const cyan=view.closed?.1:.22;
  glow(320,300,160,`rgba(57,203,221,${cyan})`);glow(1124,285,160,`rgba(174,79,204,${cyan*.55})`);
  line(25,647,300,647,'#65d1d955',2);line(1137,647,1408,647,'#ad77c455',2);
  // Vignette stays gentle so objects remain readable.
  const vignette=ctx.createRadialGradient(720,410,290,720,450,900);vignette.addColorStop(0,'transparent');vignette.addColorStop(1,'#03151d55');ctx.fillStyle=vignette;ctx.fillRect(0,0,W,H);
}

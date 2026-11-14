/** Outer footprints consume real space; inside grids hold goods and other containers. */
export const STORAGE_STYLES = [
 {id:'courier-pouch',name:'旧式腰包',kind:'backpack',art:'pouch',price:120,footprint:{width:2,height:2},columns:3,rows:3,description:'轻便的小口袋，适合芯片、零件和小件商品。'},
 {id:'courier-pack',name:'快递员背包',kind:'backpack',art:'backpack',price:300,footprint:{width:2,height:3},columns:4,rows:6,description:'展开式内仓，可以把小包连同货物一起收好。'},
 {id:'transit-crate',name:'工业周转箱',kind:'crate',art:'crate',price:480,footprint:{width:3,height:2},columns:6,rows:6,description:'方正内仓，适合机械部件或继续套入箱包。'},
 {id:'freight-case',name:'重型货运箱',kind:'crate',art:'freight',price:900,footprint:{width:4,height:3},columns:8,rows:8,description:'大尺寸内仓；外壳同样要占据完整格位。'},
] as const;
export const storageStyle = (id: string) => STORAGE_STYLES.find(c=>c.id===id)!;

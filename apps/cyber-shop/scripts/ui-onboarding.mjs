// Complete the real opening flow; never bypass tutorial state in storage.
export async function completeIntro(page,touch=false){
 const action=touch?'tap':'click';
 await page.getByRole('button',{name:'跳过区域介绍',exact:true})[action]();
 await page.locator('.warehouse-tools').getByRole('button',{name:'翻开店长手册',exact:true})[action]();
 await page.getByRole('button',{name:'合上手册 ↗',exact:true})[action]();
}

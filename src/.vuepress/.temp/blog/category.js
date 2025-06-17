export const categoriesMap = JSON.parse("{\"category\":{\"/\":{\"path\":\"/category/\",\"map\":{\"Java\":{\"path\":\"/category/java/\",\"indexes\":[0,1,2,3,4]},\"JavaFX\":{\"path\":\"/category/javafx/\",\"indexes\":[5]},\"Python\":{\"path\":\"/category/python/\",\"indexes\":[6,7,8]},\"前端\":{\"path\":\"/category/%E5%89%8D%E7%AB%AF/\",\"indexes\":[9,10,11,12,13,14,15]}}}},\"tag\":{\"/\":{\"path\":\"/tag/\",\"map\":{\"基础\":{\"path\":\"/tag/%E5%9F%BA%E7%A1%80/\",\"indexes\":[12,15,0,1,2,3,7]},\"框架\":{\"path\":\"/tag/%E6%A1%86%E6%9E%B6/\",\"indexes\":[5]},\"GUI\":{\"path\":\"/tag/gui/\",\"indexes\":[5]},\"数据库连接\":{\"path\":\"/tag/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%BF%9E%E6%8E%A5/\",\"indexes\":[4]},\"json\":{\"path\":\"/tag/json/\",\"indexes\":[4]},\"高级\":{\"path\":\"/tag/%E9%AB%98%E7%BA%A7/\",\"indexes\":[4]},\"工具使用\":{\"path\":\"/tag/%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8/\",\"indexes\":[6]},\"第三方库\":{\"path\":\"/tag/%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93/\",\"indexes\":[8]},\"Vue\":{\"path\":\"/tag/vue/\",\"indexes\":[9]},\"npm\":{\"path\":\"/tag/npm/\",\"indexes\":[13]},\"pnpm\":{\"path\":\"/tag/pnpm/\",\"indexes\":[13]},\"packet.json\":{\"path\":\"/tag/packet.json/\",\"indexes\":[14]},\"pnpm-lock.yaml\":{\"path\":\"/tag/pnpm-lock.yaml/\",\"indexes\":[14]},\"TypeScript\":{\"path\":\"/tag/typescript/\",\"indexes\":[10]},\"ES6\":{\"path\":\"/tag/es6/\",\"indexes\":[11]}}}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });


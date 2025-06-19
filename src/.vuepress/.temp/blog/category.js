export const categoriesMap = JSON.parse("{\"category\":{\"/\":{\"path\":\"/category/\",\"map\":{\"前端\":{\"path\":\"/category/%E5%89%8D%E7%AB%AF/\",\"indexes\":[0,1,2,3,4,5,6,7,8,9]},\"Python\":{\"path\":\"/category/python/\",\"indexes\":[10,11,12]},\"Java\":{\"path\":\"/category/java/\",\"indexes\":[13,14,15,16,17]},\"JavaFX\":{\"path\":\"/category/javafx/\",\"indexes\":[18]}}}},\"tag\":{\"/\":{\"path\":\"/tag/\",\"map\":{\"Vue\":{\"path\":\"/tag/vue/\",\"indexes\":[0]},\"构建与打包\":{\"path\":\"/tag/%E6%9E%84%E5%BB%BA%E4%B8%8E%E6%89%93%E5%8C%85/\",\"indexes\":[1]},\"Webpack\":{\"path\":\"/tag/webpack/\",\"indexes\":[1]},\"Vite\":{\"path\":\"/tag/vite/\",\"indexes\":[1]},\"工具链\":{\"path\":\"/tag/%E5%B7%A5%E5%85%B7%E9%93%BE/\",\"indexes\":[2]},\"ES6\":{\"path\":\"/tag/es6/\",\"indexes\":[3]},\"基础\":{\"path\":\"/tag/%E5%9F%BA%E7%A1%80/\",\"indexes\":[4,9,13,11,14,15,16]},\"npm\":{\"path\":\"/tag/npm/\",\"indexes\":[7]},\"pnpm\":{\"path\":\"/tag/pnpm/\",\"indexes\":[7]},\"packet.json\":{\"path\":\"/tag/packet.json/\",\"indexes\":[8]},\"pnpm-lock.yaml\":{\"path\":\"/tag/pnpm-lock.yaml/\",\"indexes\":[8]},\"TypeScript\":{\"path\":\"/tag/typescript/\",\"indexes\":[5]},\"Node.js\":{\"path\":\"/tag/node.js/\",\"indexes\":[6]},\"工具使用\":{\"path\":\"/tag/%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8/\",\"indexes\":[10]},\"第三方库\":{\"path\":\"/tag/%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93/\",\"indexes\":[12]},\"框架\":{\"path\":\"/tag/%E6%A1%86%E6%9E%B6/\",\"indexes\":[18]},\"GUI\":{\"path\":\"/tag/gui/\",\"indexes\":[18]},\"数据库连接\":{\"path\":\"/tag/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%BF%9E%E6%8E%A5/\",\"indexes\":[17]},\"json\":{\"path\":\"/tag/json/\",\"indexes\":[17]},\"高级\":{\"path\":\"/tag/%E9%AB%98%E7%BA%A7/\",\"indexes\":[17]}}}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });


export const categoriesMap = JSON.parse("{\"category\":{\"/\":{\"path\":\"/category/\",\"map\":{\"Latex\":{\"path\":\"/category/latex/\",\"indexes\":[0,1]},\"随笔\":{\"path\":\"/category/%E9%9A%8F%E7%AC%94/\",\"indexes\":[2]},\"数学\":{\"path\":\"/category/%E6%95%B0%E5%AD%A6/\",\"indexes\":[3,4]},\"前端\":{\"path\":\"/category/%E5%89%8D%E7%AB%AF/\",\"indexes\":[5,6,7,8,9,10,11,12,13,14]},\"Java\":{\"path\":\"/category/java/\",\"indexes\":[15,16,17,18,19]},\"JavaFX\":{\"path\":\"/category/javafx/\",\"indexes\":[20]},\"Python\":{\"path\":\"/category/python/\",\"indexes\":[21,22,23]}}}},\"tag\":{\"/\":{\"path\":\"/tag/\",\"map\":{\"基础\":{\"path\":\"/tag/%E5%9F%BA%E7%A1%80/\",\"indexes\":[1,10,14,15,16,17,18,22]},\"模板\":{\"path\":\"/tag/%E6%A8%A1%E6%9D%BF/\",\"indexes\":[0]},\"数学建模\":{\"path\":\"/tag/%E6%95%B0%E5%AD%A6%E5%BB%BA%E6%A8%A1/\",\"indexes\":[2]},\"期末考试\":{\"path\":\"/tag/%E6%9C%9F%E6%9C%AB%E8%80%83%E8%AF%95/\",\"indexes\":[3,4]},\"计算方法\":{\"path\":\"/tag/%E8%AE%A1%E7%AE%97%E6%96%B9%E6%B3%95/\",\"indexes\":[3,4]},\"Vue\":{\"path\":\"/tag/vue/\",\"indexes\":[5]},\"npm\":{\"path\":\"/tag/npm/\",\"indexes\":[12]},\"pnpm\":{\"path\":\"/tag/pnpm/\",\"indexes\":[12]},\"packet.json\":{\"path\":\"/tag/packet.json/\",\"indexes\":[13]},\"pnpm-lock.yaml\":{\"path\":\"/tag/pnpm-lock.yaml/\",\"indexes\":[13]},\"构建与打包\":{\"path\":\"/tag/%E6%9E%84%E5%BB%BA%E4%B8%8E%E6%89%93%E5%8C%85/\",\"indexes\":[6]},\"Webpack\":{\"path\":\"/tag/webpack/\",\"indexes\":[6]},\"Vite\":{\"path\":\"/tag/vite/\",\"indexes\":[6]},\"工具链\":{\"path\":\"/tag/%E5%B7%A5%E5%85%B7%E9%93%BE/\",\"indexes\":[7]},\"TypeScript\":{\"path\":\"/tag/typescript/\",\"indexes\":[8]},\"ES6\":{\"path\":\"/tag/es6/\",\"indexes\":[9]},\"Node.js\":{\"path\":\"/tag/node.js/\",\"indexes\":[11]},\"框架\":{\"path\":\"/tag/%E6%A1%86%E6%9E%B6/\",\"indexes\":[20]},\"GUI\":{\"path\":\"/tag/gui/\",\"indexes\":[20]},\"数据库连接\":{\"path\":\"/tag/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%BF%9E%E6%8E%A5/\",\"indexes\":[19]},\"json\":{\"path\":\"/tag/json/\",\"indexes\":[19]},\"高级\":{\"path\":\"/tag/%E9%AB%98%E7%BA%A7/\",\"indexes\":[19]},\"工具使用\":{\"path\":\"/tag/%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8/\",\"indexes\":[21]},\"第三方库\":{\"path\":\"/tag/%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93/\",\"indexes\":[23]}}}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });


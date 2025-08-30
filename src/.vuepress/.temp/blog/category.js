export const categoriesMap = JSON.parse("{\"category\":{\"/\":{\"path\":\"/category/\",\"map\":{\"Latex\":{\"path\":\"/category/latex/\",\"indexes\":[0,1]},\"数学\":{\"path\":\"/category/%E6%95%B0%E5%AD%A6/\",\"indexes\":[2,3]},\"Java\":{\"path\":\"/category/java/\",\"indexes\":[4,5,6,7,8]},\"JavaFX\":{\"path\":\"/category/javafx/\",\"indexes\":[9]},\"Python\":{\"path\":\"/category/python/\",\"indexes\":[10,11,12]},\"前端\":{\"path\":\"/category/%E5%89%8D%E7%AB%AF/\",\"indexes\":[13,14,15,16,17,18,19,20,21,22]}}}},\"tag\":{\"/\":{\"path\":\"/tag/\",\"map\":{\"基础\":{\"path\":\"/tag/%E5%9F%BA%E7%A1%80/\",\"indexes\":[1,16,22,4,5,6,7,11]},\"模板\":{\"path\":\"/tag/%E6%A8%A1%E6%9D%BF/\",\"indexes\":[0]},\"期末考试\":{\"path\":\"/tag/%E6%9C%9F%E6%9C%AB%E8%80%83%E8%AF%95/\",\"indexes\":[2,3]},\"计算方法\":{\"path\":\"/tag/%E8%AE%A1%E7%AE%97%E6%96%B9%E6%B3%95/\",\"indexes\":[2,3]},\"框架\":{\"path\":\"/tag/%E6%A1%86%E6%9E%B6/\",\"indexes\":[9]},\"GUI\":{\"path\":\"/tag/gui/\",\"indexes\":[9]},\"数据库连接\":{\"path\":\"/tag/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%BF%9E%E6%8E%A5/\",\"indexes\":[8]},\"json\":{\"path\":\"/tag/json/\",\"indexes\":[8]},\"高级\":{\"path\":\"/tag/%E9%AB%98%E7%BA%A7/\",\"indexes\":[8]},\"工具使用\":{\"path\":\"/tag/%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8/\",\"indexes\":[10]},\"第三方库\":{\"path\":\"/tag/%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93/\",\"indexes\":[12]},\"npm\":{\"path\":\"/tag/npm/\",\"indexes\":[20]},\"pnpm\":{\"path\":\"/tag/pnpm/\",\"indexes\":[20]},\"packet.json\":{\"path\":\"/tag/packet.json/\",\"indexes\":[21]},\"pnpm-lock.yaml\":{\"path\":\"/tag/pnpm-lock.yaml/\",\"indexes\":[21]},\"Vue\":{\"path\":\"/tag/vue/\",\"indexes\":[13]},\"TypeScript\":{\"path\":\"/tag/typescript/\",\"indexes\":[14]},\"ES6\":{\"path\":\"/tag/es6/\",\"indexes\":[15]},\"构建与打包\":{\"path\":\"/tag/%E6%9E%84%E5%BB%BA%E4%B8%8E%E6%89%93%E5%8C%85/\",\"indexes\":[17]},\"Webpack\":{\"path\":\"/tag/webpack/\",\"indexes\":[17]},\"Vite\":{\"path\":\"/tag/vite/\",\"indexes\":[17]},\"工具链\":{\"path\":\"/tag/%E5%B7%A5%E5%85%B7%E9%93%BE/\",\"indexes\":[18]},\"Node.js\":{\"path\":\"/tag/node.js/\",\"indexes\":[19]}}}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });


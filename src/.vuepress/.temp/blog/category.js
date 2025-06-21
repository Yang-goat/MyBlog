export const categoriesMap = JSON.parse("{\"category\":{\"/\":{\"path\":\"/category/\",\"map\":{\"数学\":{\"path\":\"/category/%E6%95%B0%E5%AD%A6/\",\"indexes\":[0]},\"前端\":{\"path\":\"/category/%E5%89%8D%E7%AB%AF/\",\"indexes\":[1,2,3,4,5,6,7,8,9,10]},\"Java\":{\"path\":\"/category/java/\",\"indexes\":[11,12,13,14,15]},\"JavaFX\":{\"path\":\"/category/javafx/\",\"indexes\":[16]},\"Python\":{\"path\":\"/category/python/\",\"indexes\":[17,18,19]}}}},\"tag\":{\"/\":{\"path\":\"/tag/\",\"map\":{\"期末考试\":{\"path\":\"/tag/%E6%9C%9F%E6%9C%AB%E8%80%83%E8%AF%95/\",\"indexes\":[0]},\"计算方法\":{\"path\":\"/tag/%E8%AE%A1%E7%AE%97%E6%96%B9%E6%B3%95/\",\"indexes\":[0]},\"Vue\":{\"path\":\"/tag/vue/\",\"indexes\":[1]},\"构建与打包\":{\"path\":\"/tag/%E6%9E%84%E5%BB%BA%E4%B8%8E%E6%89%93%E5%8C%85/\",\"indexes\":[2]},\"Webpack\":{\"path\":\"/tag/webpack/\",\"indexes\":[2]},\"Vite\":{\"path\":\"/tag/vite/\",\"indexes\":[2]},\"工具链\":{\"path\":\"/tag/%E5%B7%A5%E5%85%B7%E9%93%BE/\",\"indexes\":[3]},\"TypeScript\":{\"path\":\"/tag/typescript/\",\"indexes\":[4]},\"npm\":{\"path\":\"/tag/npm/\",\"indexes\":[8]},\"pnpm\":{\"path\":\"/tag/pnpm/\",\"indexes\":[8]},\"packet.json\":{\"path\":\"/tag/packet.json/\",\"indexes\":[9]},\"pnpm-lock.yaml\":{\"path\":\"/tag/pnpm-lock.yaml/\",\"indexes\":[9]},\"基础\":{\"path\":\"/tag/%E5%9F%BA%E7%A1%80/\",\"indexes\":[7,10,11,12,13,14,18]},\"Node.js\":{\"path\":\"/tag/node.js/\",\"indexes\":[5]},\"框架\":{\"path\":\"/tag/%E6%A1%86%E6%9E%B6/\",\"indexes\":[16]},\"GUI\":{\"path\":\"/tag/gui/\",\"indexes\":[16]},\"数据库连接\":{\"path\":\"/tag/%E6%95%B0%E6%8D%AE%E5%BA%93%E8%BF%9E%E6%8E%A5/\",\"indexes\":[15]},\"json\":{\"path\":\"/tag/json/\",\"indexes\":[15]},\"高级\":{\"path\":\"/tag/%E9%AB%98%E7%BA%A7/\",\"indexes\":[15]},\"工具使用\":{\"path\":\"/tag/%E5%B7%A5%E5%85%B7%E4%BD%BF%E7%94%A8/\",\"indexes\":[17]},\"第三方库\":{\"path\":\"/tag/%E7%AC%AC%E4%B8%89%E6%96%B9%E5%BA%93/\",\"indexes\":[19]},\"ES6\":{\"path\":\"/tag/es6/\",\"indexes\":[6]}}}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogCategory)
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ categoriesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogCategory(categoriesMap);
  });


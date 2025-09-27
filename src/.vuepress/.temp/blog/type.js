export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[19,20,21,22,3,0,1,2,4,14,17,18,15,16,5,6,7,8,9,10,11,12,13,28,23,24,25,26,27,29,30,31]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[19,20,21,22,3,0,1,2,4,14,17,18,15,16,5,6,7,8,9,10,11,12,13,28,23,24,25,26,27,29,30,31]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


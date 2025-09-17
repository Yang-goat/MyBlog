export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[8,5,6,7,0,1,2,3,4,11,21,9,10,22,23,12,13,14,15,16,17,18,19,20,29,24,25,26,27,28,30,31,32]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[8,5,6,7,0,1,2,3,4,11,21,9,10,22,23,12,13,14,15,16,17,18,19,20,29,24,25,26,27,28,30,31,32]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


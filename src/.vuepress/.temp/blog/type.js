export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[8,9,28,33,6,7,22,0,1,2,12,5,10,11,3,4,13,14,15,16,17,18,19,20,21,29,23,24,25,26,27,30,31,32]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[8,9,28,33,6,7,22,0,1,2,12,5,10,11,3,4,13,14,15,16,17,18,19,20,21,29,23,24,25,26,27,30,31,32]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[17,19,3,16,22,23,27,31,4,5,18,0,1,2,6,26,20,21,24,25,38,7,8,9,10,11,12,13,14,15,37,32,28,29,30,33,34,35,36]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[17,19,3,16,22,23,27,31,4,5,18,0,1,2,6,26,20,21,24,25,38,7,8,9,10,11,12,13,14,15,37,32,28,29,30,33,34,35,36]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


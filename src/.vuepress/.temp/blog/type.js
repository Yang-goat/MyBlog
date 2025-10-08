export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[7,3,23,24,25,26,33,4,5,22,0,1,2,12,6,8,9,10,11,13,14,15,16,17,18,19,20,21,32,27,28,29,30,31,34,35,36]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[7,3,23,24,25,26,33,4,5,22,0,1,2,12,6,8,9,10,11,13,14,15,16,17,18,19,20,21,32,27,28,29,30,31,34,35,36]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


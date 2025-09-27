export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[7,8,23,30,5,6,19,0,1,2,9,22,3,4,20,21,10,11,12,13,14,15,16,17,18,29,24,25,26,27,28,31,32,33]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[7,8,23,30,5,6,19,0,1,2,9,22,3,4,20,21,10,11,12,13,14,15,16,17,18,29,24,25,26,27,28,31,32,33]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


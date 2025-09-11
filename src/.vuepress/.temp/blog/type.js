export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[0,1,13,11,12,14,15,2,3,4,5,6,7,8,9,10,21,16,17,18,19,20,22,23,24]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[0,1,13,11,12,14,15,2,3,4,5,6,7,8,9,10,21,16,17,18,19,20,22,23,24]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


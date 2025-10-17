export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[1,27,0,18,2,16,17,28,35,3,4,5,21,22,23,6,24,19,20,25,26,7,8,9,10,11,12,13,14,15,34,29,30,31,32,33,36,37,38,39]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[1,27,0,18,2,16,17,28,35,3,4,5,21,22,23,6,24,19,20,25,26,7,8,9,10,11,12,13,14,15,34,29,30,31,32,33,36,37,38]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


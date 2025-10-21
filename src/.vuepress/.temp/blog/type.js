export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[13,14,15,16,5,6,7,8,9,10,11,12,38,0,29,1,27,28,39,46,2,3,4,32,33,34,17,35,30,31,36,37,50,18,19,20,21,22,23,24,25,26,45,40,41,42,43,44,47,48,49,51]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[13,14,15,16,5,6,7,8,9,10,11,12,38,0,29,1,27,28,39,46,2,3,4,32,33,34,17,35,30,31,36,37,50,18,19,20,21,22,23,24,25,26,45,40,41,42,43,44,47,48,49]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


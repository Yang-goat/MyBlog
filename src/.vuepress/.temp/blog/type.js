export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[44,45,4,5,21,22,23,24,25,26,27,28,29,30,7,8,9,10,31,32,33,34,35,36,37,38,63,0,39,1,42,43,52,59,2,3,6,49,50,51,11,48,40,41,46,47,12,13,14,15,16,17,18,19,20,58,53,54,55,56,57,60,61,62,64]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[44,45,4,5,21,22,23,24,25,26,27,28,29,30,7,8,9,10,31,32,33,34,35,36,37,38,63,0,39,1,42,43,52,59,2,3,6,49,50,51,11,48,40,41,46,47,12,13,14,15,16,17,18,19,20,58,53,54,55,56,57,60,61,62]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[4,9,31,32,5,7,10,11,12,13,14,15,16,17,18,19,8,35,36,37,20,21,22,23,24,25,26,54,27,0,28,1,33,34,55,62,2,3,6,48,49,50,38,51,29,30,52,53,39,40,41,42,43,44,45,46,47,61,56,57,58,59,60,63,64,65,66]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[4,9,31,32,5,7,10,11,12,13,14,15,16,17,18,19,8,35,36,37,20,21,22,23,24,25,26,54,27,0,28,1,33,34,55,62,2,3,6,48,49,50,38,51,29,30,52,53,39,40,41,42,43,44,45,46,47,61,56,57,58,59,60,63,64,65]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


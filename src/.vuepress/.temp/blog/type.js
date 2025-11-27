export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[8,4,9,47,48,5,7,10,11,12,13,14,15,16,17,18,19,28,29,30,31,20,21,22,23,24,25,26,55,27,0,42,1,45,46,56,60,2,3,6,49,50,51,32,52,43,44,53,54,33,34,35,36,37,38,39,40,41,66,61,57,58,59,62,63,64,65,67]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[8,4,9,47,48,5,7,10,11,12,13,14,15,16,17,18,19,28,29,30,31,20,21,22,23,24,25,26,55,27,0,42,1,45,46,56,60,2,3,6,49,50,51,32,52,43,44,53,54,33,34,35,36,37,38,39,40,41,66,61,57,58,59,62,63,64,65]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


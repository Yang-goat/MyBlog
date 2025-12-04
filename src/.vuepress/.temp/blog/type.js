export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[55,56,57,58,59,15,36,60,61,62,63,16,11,17,9,10,12,14,18,19,20,21,22,23,24,25,26,27,37,38,39,40,28,29,30,31,32,33,34,35,66,3,4,0,7,8,67,74,1,2,13,51,52,53,41,54,5,6,64,65,42,43,44,45,46,47,48,49,50,73,68,69,70,71,72,75,76,77,78]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[55,56,57,58,59,15,36,60,61,62,63,16,11,17,9,10,12,14,18,19,20,21,22,23,24,25,26,27,37,38,39,40,28,29,30,31,32,33,34,35,66,3,4,0,7,8,67,74,1,2,13,51,52,53,41,54,5,6,64,65,42,43,44,45,46,47,48,49,50,73,68,69,70,71,72,75,76,77]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


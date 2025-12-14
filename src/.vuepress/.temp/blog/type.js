export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[47,48,51,58,59,60,61,62,8,29,63,64,65,66,9,4,10,52,53,5,7,11,12,13,14,15,16,17,18,19,20,30,31,32,33,21,22,23,24,25,26,27,28,69,0,44,1,49,50,70,77,2,3,6,54,55,56,34,57,45,46,67,68,35,36,37,38,39,40,41,42,43,76,71,72,73,74,75,78,79,80,81]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[47,48,51,58,59,60,61,62,8,29,63,64,65,66,9,4,10,52,53,5,7,11,12,13,14,15,16,17,18,19,20,30,31,32,33,21,22,23,24,25,26,27,28,69,0,44,1,49,50,70,77,2,3,6,54,55,56,34,57,45,46,67,68,35,36,37,38,39,40,41,42,43,76,71,72,73,74,75,78,79,80]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


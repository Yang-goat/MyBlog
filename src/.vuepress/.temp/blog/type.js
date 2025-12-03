export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[8,29,55,56,57,58,9,4,10,49,50,5,7,11,12,13,14,15,16,17,18,19,20,30,31,32,33,21,22,23,24,25,26,27,61,28,0,44,1,47,48,62,69,2,3,6,51,52,53,34,54,45,46,59,60,35,36,37,38,39,40,41,42,43,68,63,64,65,66,67,70,71,72,73]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[8,29,55,56,57,58,9,4,10,49,50,5,7,11,12,13,14,15,16,17,18,19,20,30,31,32,33,21,22,23,24,25,26,27,61,28,0,44,1,47,48,62,69,2,3,6,51,52,53,34,54,45,46,59,60,35,36,37,38,39,40,41,42,43,68,63,64,65,66,67,70,71,72]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


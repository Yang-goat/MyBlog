export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[5,6,7,8,9,10,11,12,13,14,15,16,25,26,27,28,17,18,19,20,21,22,23,24,50,0,39,1,42,43,51,58,2,3,4,44,45,46,29,49,40,41,47,48,62,30,31,32,33,34,35,36,37,38,57,52,53,54,55,56,59,60,61]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[5,6,7,8,9,10,11,12,13,14,15,16,25,26,27,28,17,18,19,20,21,22,23,24,50,0,39,1,42,43,51,58,2,3,4,44,45,46,29,49,40,41,47,48,62,30,31,32,33,34,35,36,37,38,57,52,53,54,55,56,59,60,61]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


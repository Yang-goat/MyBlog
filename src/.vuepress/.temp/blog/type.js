export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[65,4,5,6,7,8,9,10,11,12,13,14,70,58,59,66,71,72,73,74,75,19,37,76,77,78,79,38,15,39,67,68,16,18,40,41,42,43,44,45,46,47,48,49,20,21,22,23,50,51,52,53,54,55,56,57,86,0,34,1,60,61,82,87,2,3,17,62,63,64,24,69,35,36,80,81,25,26,27,28,29,30,31,32,33,93,88,83,84,85,89,90,91,92,94]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[65,4,5,6,7,8,9,10,11,12,13,14,70,58,59,66,71,72,73,74,75,19,37,76,77,78,79,38,15,39,67,68,16,18,40,41,42,43,44,45,46,47,48,49,20,21,22,23,50,51,52,53,54,55,56,57,86,0,34,1,60,61,82,87,2,3,17,62,63,64,24,69,35,36,80,81,25,26,27,28,29,30,31,32,33,93,88,83,84,85,89,90,91,92]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


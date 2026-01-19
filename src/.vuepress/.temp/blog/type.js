export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[31,32,33,34,35,36,37,38,39,40,41,69,58,59,62,70,71,72,73,74,8,29,75,76,77,78,9,4,10,63,64,5,7,11,12,13,14,15,16,17,18,19,20,30,42,43,44,21,22,23,24,25,26,27,28,81,0,55,1,60,61,82,89,2,3,6,65,66,67,45,68,56,57,79,80,93,46,47,48,49,50,51,52,53,54,88,83,84,85,86,87,90,91,92]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[31,32,33,34,35,36,37,38,39,40,41,69,58,59,62,70,71,72,73,74,8,29,75,76,77,78,9,4,10,63,64,5,7,11,12,13,14,15,16,17,18,19,20,30,42,43,44,21,22,23,24,25,26,27,28,81,0,55,1,60,61,82,89,2,3,6,65,66,67,45,68,56,57,79,80,93,46,47,48,49,50,51,52,53,54,88,83,84,85,86,87,90,91,92]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


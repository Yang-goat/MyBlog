export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[19,93,95,94,61,4,5,6,7,8,9,10,11,12,13,14,69,57,58,62,70,71,72,73,74,20,39,75,76,77,78,21,15,22,63,64,16,18,23,24,25,26,27,28,29,30,31,40,41,42,43,32,33,34,35,36,37,38,81,0,54,1,59,60,82,89,2,3,17,65,66,67,44,68,55,56,79,80,45,46,47,48,49,50,51,52,53,88,83,84,85,86,87,90,91,92,96]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[19,93,95,94,61,4,5,6,7,8,9,10,11,12,13,14,69,57,58,62,70,71,72,73,74,20,39,75,76,77,78,21,15,22,63,64,16,18,23,24,25,26,27,28,29,30,31,40,41,42,43,32,33,34,35,36,37,38,81,0,54,1,59,60,82,89,2,3,17,65,66,67,44,68,55,56,79,80,45,46,47,48,49,50,51,52,53,88,83,84,85,86,87,90,91,92]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


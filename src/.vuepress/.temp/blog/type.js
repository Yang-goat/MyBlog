export const typesMap = JSON.parse("{\"article\":{\"/\":{\"path\":\"/article/\",\"indexes\":[94,95,62,20,21,22,23,24,25,26,27,28,29,30,70,58,59,63,71,72,73,74,75,32,53,76,77,78,79,33,17,34,64,65,18,31,35,36,37,38,39,40,41,42,43,44,54,4,5,6,45,46,47,48,49,50,51,52,93,0,55,1,60,61,82,89,2,3,19,66,67,68,7,69,56,57,80,81,8,9,10,11,12,13,14,15,16,88,83,84,85,86,87,90,91,92,96]},\"/en/\":{\"path\":\"/en/article/\",\"indexes\":[]}},\"star\":{\"/\":{\"path\":\"/star/\",\"indexes\":[]},\"/en/\":{\"path\":\"/en/star/\",\"indexes\":[]}},\"timeline\":{\"/\":{\"path\":\"/timeline/\",\"indexes\":[94,95,62,20,21,22,23,24,25,26,27,28,29,30,70,58,59,63,71,72,73,74,75,32,53,76,77,78,79,33,17,34,64,65,18,31,35,36,37,38,39,40,41,42,43,44,54,4,5,6,45,46,47,48,49,50,51,52,93,0,55,1,60,61,82,89,2,3,19,66,67,68,7,69,56,57,80,81,8,9,10,11,12,13,14,15,16,88,83,84,85,86,87,90,91,92]},\"/en/\":{\"path\":\"/en/timeline/\",\"indexes\":[]}}}");

if (import.meta.webpackHot) {
  import.meta.webpackHot.accept();
  if (__VUE_HMR_RUNTIME__.updateBlogType)
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
}

if (import.meta.hot)
  import.meta.hot.accept(({ typesMap }) => {
    __VUE_HMR_RUNTIME__.updateBlogType(typesMap);
  });


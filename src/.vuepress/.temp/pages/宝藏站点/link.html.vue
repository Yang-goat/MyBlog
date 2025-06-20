<template><div><h1 id="常用网址导航" tabindex="-1"><a class="header-anchor" href="#常用网址导航"><span>常用网址导航</span></a></h1>
<div id="link-container"></div>
</div></template>

<script>
  const links = [
    { name: "Vue.js", url: "https://vuejs.org" },
    { name: "MDN", url: "https://developer.mozilla.org" },
    { name: "GitHub", url: "https://github.com" },
    { name: "Stack Overflow", url: "https://stackoverflow.com" },
  ];

  // 等待页面渲染完毕
  window.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById("link-container");
    links.forEach(({ name, url }) => {
      const div = document.createElement("div");
      div.className = "link-card";
      div.innerHTML = `<a href="${url}" target="_blank">${name}</a>`;
      container.appendChild(div);
    });
  });
</script>

<style>
.link-card {
  padding: 1em;
  margin: 1em 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  transition: 0.3s;
}
.link-card:hover {
  background-color: #f0f0f0;
}
</style>
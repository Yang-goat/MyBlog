import { defineClientConfig } from "vuepress/client";
// import MyComponent from "./MyComponent.vue";

export default defineClientConfig({
  enhance: ({ app, router, siteData }) => {
    // app.component("MyComponent", MyComponent);
  },
});
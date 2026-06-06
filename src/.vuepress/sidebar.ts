import { sidebar } from "vuepress-theme-hope";

export default sidebar({
  "/ai-ml/base/": "structure",
  "/ai-ml/parameter-settings/": "structure",
  "/ai-ml/machine-learning/": "structure",
  "/ai-ml/deep-learning/": "structure",
  "/ai-ml/RL/": "structure",
  "/ai-ml/other/": "structure",
  "/ai-ml/optimization/": "structure",
  "/ai-ml/problems/": "structure",
  "/ai-practice/": [
    {
      text: "AI应用实践",
      icon: "robot",
      link: "/ai-practice/",
    },
  ],
  "/notes/language/": "structure",
  "/notes/frontend/": "structure",
  "/notes/music/": [
    {
      text: "音乐",
      icon: "music",
      link: "/notes/music/",
    },
  ],
  "/notes/Math/": "structure",
  "/notes/MCM/": "structure",
  "/notes/ACMer/": "structure",
  "/notes/computer/": "structure",
  "/notes/major/": "structure",
  "/guides/": "structure",
  "/guides/git/": "structure",
  "/guides/docker/": "structure",
  "/guides/linux/": "structure",
  "/guides/Latex/": "structure",
  "/guides/VSCode/": "structure",
  "/tests/": "structure",
});

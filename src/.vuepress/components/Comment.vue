<template>
  <!-- 评论整体容器 -->
  <div class="comment-section" :class="{ dark: isDarkMode }">
    <h3>评论</h3>

    <!-- 输入框区域 -->
    <div class="editor">
      <textarea
        v-model="content"
        class="editor-input"
        placeholder="登录后可发表评论..."
        :disabled="!currentUser"
      ></textarea>
      <div class="editor-actions">
        <!-- 未登录时显示 GitHub 登录按钮 -->
        <button v-if="!currentUser" class="login-btn" @click="loginWithGithub">
          使用 GitHub 登录
        </button>
        <!-- 登录后显示提交按钮 -->
        <button v-else class="submit-btn" @click="submitComment">
          提交
        </button>
      </div>
    </div>

    <!-- 评论列表 -->
    <div v-if="comments.length > 0" class="comment-list">
      <div v-for="c in comments" :key="c.id" class="comment-item">
        <img :src="c.avatar" alt="avatar" class="avatar" />
        <div class="content">
          <div class="meta">
            <span class="author">{{ c.author }}</span>
            <span class="time">{{ c.time }}</span>
          </div>
          <p class="text">{{ c.content }}</p>
          <div class="actions">
            <span class="like" @click="likeComment(c.id)">👍 {{ c.likes }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 无评论时提示 -->
    <div v-else class="no-comment">暂无评论</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useDarkMode } from "vuepress-theme-hope/client";
import { getPathAfterDomain } from "./utils/urlUtil.js";
import { parseComments } from "./utils/commentParser.js";

// 当前主题状态（true 表示深色模式）
const { isDarkMode } = useDarkMode();

const comments = ref([]); // 存放评论数组
const content = ref("");
const currentUser = ref(null); // 当前登录用户
const articlePath = ref(""); // 延迟获取文章路径（SSR 阶段为空）

// ====== 工具函数 ======

// 加载评论
async function loadComments() {
  if (!articlePath.value) return;
  try {
    const url = `http://localhost:8081/api/comments/article/${articlePath.value}`;
    const res = await fetch(url);
    const data = await res.json();
    comments.value = parseComments(data);
  } catch (err) {
    console.error("加载评论失败", err);
  }
}

// 提交评论
async function submitComment() {
  if (!content.value.trim()) {
    alert("评论内容不能为空！");
    return;
  }
  if (!currentUser.value) {
    alert("请先登录后再发表评论！");
    return;
  }

  try {
    const userId = currentUser.value.githubid; // 当前登录用户 ID
    const res = await fetch("http://localhost:8081/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        userId,
        articlePath: articlePath.value,
        content: content.value,
      }),
      credentials: "include",
    });

    const data = await res.json();
    if (data.code === 200) {
      content.value = "";
      loadComments();
    } else {
      alert(data.message || "提交评论失败");
    }
  } catch (err) {
    console.error("提交评论失败", err);
    alert("网络错误，提交失败");
  }
}

// 点赞
async function likeComment(commentId) {
  if (!currentUser.value) {
    alert("请先登录后再点赞！");
    return;
  }

  try {
    const userId = currentUser.value.githubid;
    const res = await fetch("http://localhost:8081/api/comment-likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({ userId, commentId }),
      credentials: "include",
    });

    const data = await res.json();
    if (!data.error) {
      loadComments();
    } else {
      alert(data.message || "点赞失败");
    }
  } catch (err) {
    console.error("点赞失败", err);
    alert("网络错误，点赞失败");
  }
}

// GitHub OAuth 登录
function loginWithGithub() {
  if (typeof window === "undefined") return;
  const redirect = encodeURIComponent(window.location.href);
  const authUrl = `http://localhost:8081/oauth2/authorization/github?redirect_uri=${redirect}`;
  window.open(authUrl, "_self");
}

// 登录出错时获取 URL 参数
function getUrlParams() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const error = params.get("error");
  if (error) console.log("授权失败：", error, params.get("message"));
}

// 获取当前用户
async function fetchCurrentUser() {
  try {
    const res = await fetch("http://localhost:8081/api/auth/me", {
      credentials: "include",
    });
    const data = await res.json();
    currentUser.value = !data.error ? data : null;
  } catch (err) {
    console.error("获取用户失败", err);
    currentUser.value = null;
  }
}

// ====== 生命周期 ======
onMounted(() => {
  if (typeof window !== "undefined") {
    articlePath.value = getPathAfterDomain(window.location.href);
    getUrlParams();
    loadComments();
    fetchCurrentUser();
  }
});
</script>

<style scoped>
/* ===== 公共样式（浅色模式） ===== */
.comment-section {
  margin-top: 1em;
  border-top: 1px solid #ccc;
  padding-top: 1em;
}

.editor {
  background: #f9f9f9;
  padding: 0.5em;
  border-radius: 8px;
  margin-bottom: 1em;
}

.editor-input {
  width: 100%;
  min-height: 80px;
  background: #fff;
  color: #333;
  border: 1px solid #ddd;
  padding: 0.5em;
  border-radius: 4px;
  resize: none;
}

.editor-actions {
  margin-top: 0.5em;
  display: flex;
  justify-content: flex-end;
}

.login-btn,
.submit-btn {
  background: #2563eb; /* 蓝色按钮 */
  color: #fff;
  border: none;
  padding: 0.4em 1em;
  border-radius: 6px;
  cursor: pointer;
}

.login-btn:hover,
.submit-btn:hover {
  background: #1e40af; /* hover 更深蓝 */
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.comment-item {
  display: flex;
  gap: 0.6em;
}

.avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
}

.content {
  flex: 1;
}

.meta {
  font-size: 0.9em;
  color: #666;
  margin-bottom: 0.2em;
}

.author {
  font-weight: bold;
  margin-right: 0.5em;
}

.text {
  margin: 0.2em 0;
}

.actions {
  font-size: 0.9em;
  color: #444;
  cursor: pointer;
}

.no-comment {
  text-align: center;
  color: #666;
  margin-top: 1em;
}

/* ===== 深色模式覆盖 ===== */
.comment-section.dark {
  border-top: 1px solid #444;
}

.comment-section.dark .editor {
  background: #1e1e1e;
}

.comment-section.dark .editor-input {
  background: #2b2b2b;
  color: #ddd;
  border: 1px solid #444;
}

.comment-section.dark .meta {
  color: #aaa;
}

.comment-section.dark .actions {
  color: #888;
}

.comment-section.dark .no-comment {
  color: #999;
}
</style>

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

// 当前主题状态（true 表示深色模式）
const { isDarkMode } = useDarkMode();

const comments = ref([]);
const content = ref("");
const currentUser = ref(null); // 当前登录用户
const postId = ref(""); // 文章路径唯一标识

// 加载评论（模拟，从本地 JSON）
async function loadComments() {
  try {
    const res = await fetch("/api/comments.json");
    const data = await res.json();
    comments.value = data.filter((c) => c.postId === postId.value);
  } catch (err) {
    console.error("加载评论失败", err);
  }
}

// 提交评论
function submitComment() {
  if (!content.value.trim()) return;
  comments.value.push({
    id: Date.now(),
    postId: postId.value,
    author: currentUser.value.username,
    avatar: currentUser.value.avatar,
    content: content.value,
    likes: 0,
    time: new Date().toLocaleString(),
  });
  content.value = "";
  // TODO: 这里可以改成调用后端 API 保存评论
}

// 点赞
function likeComment(id) {
  const target = comments.value.find((c) => c.id === id);
  if (target) target.likes++;
}

// GitHub OAuth 登录
function loginWithGithub() {
  console.log('1111s');
  console.log(window.location.href);

  setTimeout(()=>{},20000);
  // 在新窗口打开授权页面
  const authUrl = `http://localhost:8081/oauth2/authorization/github?redirect_uri=${encodeURIComponent(window.location.href)}`;
    
  // 打开新窗口，_blank确保在新标签页打开
  window.open(authUrl, '_blank');
  // window.location.href = `http://localhost:8081/oauth2/authorization/github?redirect_uri=${encodeURIComponent(window.location.href)}`;

}

// 获取当前用户
async function fetchCurrentUser() {
  try {
    // 1. 发送GET请求到后端用户信息接口
    const res = await fetch("http://localhost:8081/api/auth/me", {
      // 让浏览器在请求中携带与当前域名相关的Cookie（包括Session ID对应的Cookie）
      credentials: "include", 
    });

    // 2. 将响应体解析为JSON格式
    const data = await res.json();

    // 3. 根据接口返回结果更新当前用户状态
    if (!data.error) {
      console.log("2222");
      currentUser.value = data;
    } else {
      currentUser.value = null;
    }
  } catch (err) {
    console.error("获取用户失败", err);
    currentUser.value = null;
  }
}

onMounted(() => {
  postId.value = window.location.pathname;
  loadComments();
  fetchCurrentUser();
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

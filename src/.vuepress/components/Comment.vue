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
const articlePath = getPathAfterDomain(); // 文章路径唯一标识

// 加载评论
async function loadComments() {
  try {
    console.log("开始加载评论");
    const url = `http://localhost:8081/api/comments/article/${articlePath}`;
    const res = await fetch(url);
    const data = await res.json();
    console.log(articlePath);
    console.log("后端返回:", data);

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
    console.log("当前用户githubid", userId);

    const res = await fetch("http://localhost:8081/api/comments", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        userId: userId,
        articlePath: articlePath,
        content: content.value,
      }),
      credentials: "include", // 携带 cookie（如果有登录态）
    });

    const data = await res.json();
    if (!data.error) {
      console.log("提交评论返回:", data);
      // 文本框内容清空
      content.value = "";
      loadComments();
    } else {
      alert(data.message || "点赞失败");
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
    const userId = currentUser.value.githubid; // 当前登录用户 ID
    console.log("点赞：", userId, commentId);

    const res = await fetch("http://localhost:8081/api/comment-likes", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        userId: userId,
        commentId: commentId,
      }),
      credentials: "include",
    });

    const data = await res.json();
    console.log("点赞返回:", data);

    // 点赞成功后刷新评论列表（更新点赞数）
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
  console.log("发起登录的url: "+window.location.href);

  setTimeout(()=>{},20000);
  // 在新窗口打开授权页面
  const authUrl = `http://localhost:8081/oauth2/authorization/github?redirect_uri=${encodeURIComponent(window.location.href)}`;
  
  // 打开新窗口，_blank确保在新标签页打开
  // window.open(authUrl, '_blank');
  window.open(authUrl, '_self');
}

// 登录出错时获取 URL 参数
function getUrlParams() {
  console.log("开始检测url，是否为登录错误后返回");
  // 获取当前 URL 的查询参数部分
  const params = new URLSearchParams(window.location.search);
  
  // 提取错误信息
  const error = params.get('error');
  const message = params.get('message');
  
  // 输出到控制台
  if (error) {
    console.log('授权失败：', error);
  }
}

// 获取当前用户
async function fetchCurrentUser() {
  try {
    const res = await fetch("http://localhost:8081/api/auth/me", {
      credentials: "include"
    });
    const data = await res.json();

    if (!data.error) {
      currentUser.value = data;
      console.log("当前用户信息：", data);
    } else {
      // 如果未登录，可引导前端跳转 OAuth2 授权页面
      currentUser.value = null;
      if (data.loginUrl) {
        console.log("无用户登录");
      }
    }
  } catch (err) {
    console.error("获取用户失败", err);
    currentUser.value = null;
  }
}

onMounted(() => {
  getUrlParams();
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

// utils/commentParser.js

/**
 * 解析后端返回的评论数据
 * @param {Object} resJson 后端返回的 JSON
 * @returns {Array} 前端渲染需要的评论数组
 */
export function parseComments(resJson) {
  if (!resJson || resJson.code !== 200 || !Array.isArray(resJson.data)) {
    return [];
  }

  return resJson.data.map((c) => ({
    id: c.commentId,
    postId: c.articlePath,
    author: c.user?.username || "匿名用户",
    avatar: c.user?.avatarUrl || "https://via.placeholder.com/36",
    content: c.content,
    likes: c.likeCount ?? 0,
    // 将时间中的T替换为空格
    time: c.createdAt ? c.createdAt.replace('T', ' ') : '',
  }));
}
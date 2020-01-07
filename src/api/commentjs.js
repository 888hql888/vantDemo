// 处理所有与评论相关的网络请求
import http from "../utils/http";

// 得到文章的评论
function apiGetArticleComment({ artid, offset, limit }) {
  return http({
    url: "/comments",
    params: {
      type: "a",
      source: artid,
      offset: offset,
      limit: limit
    }
  });
}

// 添加文章的评论
function apiAddComment({ artid, content }) {
  return http({
    url: "/comments",
    method: "POST",
    data: {
      target: artid,
      content: content
    }
  });
}

// 得到评论的回复
function apiGetCommentReply({ comid, offset, limit }) {
  return http({
    url: "/comments",
    params: {
      type: "c",
      source: comid,
      offset: offset,
      limit: limit
    }
  });
}

// 添加评论的回复
function apiAddCommentReply({ commid, content, artid }) {
  return http({
    url: '/comments',
    method: 'POST',
    data: {
      target: commid,
      content: content,
      art_id: artid
    }
  })
}

// 按需导出
export { apiGetArticleComment, apiAddComment, apiGetCommentReply, apiAddCommentReply };

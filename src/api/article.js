// 用来处理所有的文章网络请求
import http from "../utils/http";

// 获取文章列表
function apiGetChannelsArticle({ channelId, timestamp }) {
  return http({
    url: "http://ttapi.research.itcast.cn/app/v1_1/articles",
    method: "GET",
    params: {
      channel_id: channelId,
      timestamp: timestamp,
      with_top: 0
    }
  });
}

// 将文章标识为不喜欢
function apiDislikeArticle(articleId) {
  return http({
    url: "/article/dislikes",
    method: "POST",
    data: {
      target: articleId
    }
  });
}

// 举报文章
function apiJuBaoArticle({ target, type }) {
  return http({
    url: "/article/reports",
    method: "POST",
    data: {
      target: target,
      type: type,
      remark: ""
    }
  });
}

// 拉黑作者
function apiBlackList(target) {
  return http({
    url: "/user/blacklists",
    method: "POST",
    data: {
      target
    }
  });
}

// 获取文章详情
function apiGetArticleDetail(artid) {
  return http({
    url: `/articles/${artid}`
  });
}

// 点赞文章
function apiZan(artid) {
  return http({
    url: "/article/likings",
    method: "POST",
    data: {
      target: artid
    }
  });
}

//  不喜欢文章
function apiDislike(artid) {
  return http({
    url: "/article/dislikes",
    method: "POST",
    data: {
      target: artid
    }
  });
}

// 暴露出去
export {
  apiGetChannelsArticle,
  apiDislikeArticle,
  apiJuBaoArticle,
  apiBlackList,
  apiGetArticleDetail,
  apiZan,
  apiDislike
};

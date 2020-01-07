// 处理所有与搜索相关的网络请求
import http from "../utils/http";

// 联想方法
function apiThink(key) {
  return http({
    url: "/suggestion",
    params: {
      q: key
    }
  });
}

// 得到关键字对应的文章数据
function apiGetSearchArticle({ key, page, perpage }) {
  return http({
    url: "search",
    method: "GET",
    params: {
      q: key,
      page: page,
      per_page: perpage
    }
  });
}

// 暴露
export { apiThink, apiGetSearchArticle };

// 封装所有的网络请求
import http from "../utils/http";

// 登录的方法
function apiUseLogin({ mobile, code }) {
  return http({
    url: "/authorizations",
    method: "POST",
    data: {
      mobile: mobile,
      code: code
    }
  });
}

// 关注作者
function apiFollowedAut(autid) {
  return http({
    url: "/user/followings",
    method: "POST",
    data: {
      target: autid
    }
  });
}

// 取关作者
function apiunFollowAut(autid) {
  return http({
    url: `/user/followings/${autid}`,
    method: "DELETE"
  });
}

// 得到用户的个人资料
function apiGetUserInfo() {
  return http({
    url: "/user"
  });
}

// 得到用户个人信息
function apiGetUserProfile() {
  return http({
    url: "/user/profile"
  });
}

// 修改用户
function apiProflie({ name, gender, birthday }) {
  return http({
    url: "/user/profile",
    method: "PATCH",
    data: {
      name,
      gender,
      birthday
    }
  });
}

// 更新用户头像
function apiSetUserImg(photo) {
  // 将图片通过 formData 进行转换
  var fd = new FormData();
  fd.append("photo", photo);
  return http({
    url: "/user/photo",
    method: "PATCH",
    data: fd
  });
}

// 暴露方法
export default {
  apiUseLogin,
  apiFollowedAut,
  apiunFollowAut,
  apiGetUserInfo,
  apiGetUserProfile,
  apiProflie,
  apiSetUserImg
};

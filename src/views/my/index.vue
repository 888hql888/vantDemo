<template>
  <div>
    <div class="top">
      <!-- 顶部-用户信息 -->
      <div class="userinfo">
        <div @click="toPerson" class="img">
          <img :src="userInfo.photo" alt="">
        </div>
        <div class="name">{{ userInfo.name }}</div>
        <div class="time">
          <div>今日推荐</div>
          <div>3分钟</div>
        </div>
      </div>
      <!-- 顶部-用户动态 -->
      <div class="message">
        <div class="left">
          <div>{{ userInfo.art_count }}</div>
          <div>动态</div>
        </div>
        <div class="center">
          <div>{{ userInfo.follow_count }}</div>
          <div>关注</div>
        </div>
        <div class="right">
          <div>{{ userInfo.fans_count }}</div>
          <div>粉丝</div>
        </div>
      </div>
    </div>
    <!-- 收藏区域 -->
    <van-grid :column-num="3">
      <van-grid-item icon="star-o" text="收藏" />
      <van-grid-item icon="underway-o" text="历史" />
      <van-grid-item icon="todo-list-o" text="作品" />
    </van-grid>
    <!-- 消息区域 -->
    <van-cell-group>
      <van-cell title="消息通知" is-link />
      <van-cell title="用户反馈" is-link />
      <van-cell title="小智同学" @click="$router.push('/zhi')" is-link />
    </van-cell-group>
  </div>
</template>

<script>
// 导入请求用户信息的方法
import obj from '../../api/user'

export default {
  data() {
    return {
      userInfo: {}
    }
  },
  methods: {
    async getUserInfo() {
      // 获取用户信息
      let res = await obj.apiGetUserInfo()
      // 保存用户信息
      this.userInfo = res.data.data
    },
    toPerson() {
      this.$router.push('/person')
    }
  },
  created() {
    // 发送请求得到用户信息
    this.getUserInfo()
  }
}
</script>

<style lang="less" scoped>
.top {
  color: #fff;
  background-color: #3e9df8;
  overflow: hidden;
  .userinfo {
    display: flex;
    margin-top: 50px;
    margin-left: 50px;
    .img {
      img {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
    }
    .name {
      flex: 1;
      margin-left: 20px;
    }
    .time {
      background-color: rgba(0, 0, 0, .5);
      text-align: center;
      border-radius: 50px 0px 0px 50px;
      line-height: 27px;
      font-size: 12px;
      padding-left: 20px;
    }
  }
  .message {
    padding-top: 30px;
    padding-bottom: 30px;
    display: flex;
    .left {
      flex: 1px;
      text-align: center;
    }
    .center {
      flex: 1px;
      text-align: center;
    }
    .right {
      flex: 1px;
      text-align: center;
    }
  }
}
</style>

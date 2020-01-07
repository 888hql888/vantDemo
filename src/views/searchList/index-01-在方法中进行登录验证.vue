<template>
  <div class="searchList">
    <!-- 头部 -->
    <van-nav-bar fixed @click-left="backpage" left-arrow class="myhead" title="登录">
      <template slot="title">
        <div class="myhead-word">
          搜索结果
        </div>
      </template>
    </van-nav-bar>
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
      <!-- list 组件 -->
      <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
        <!-- 文章区域 -->
        <van-cell v-for="(item, index) in searchList" :key="index">
          <template slot="title">
            <div class="title">
              {{ item.title }}
            </div>
            <van-grid v-if="item.cover.type > 0" :border="false" :column-num="3">
              <van-grid-item v-for="(imgitem, imgindex) in item.cover.images" :key="imgindex">
                <van-image :src="imgitem">
                </van-image>
              </van-grid-item>
            </van-grid>
            <div class="msg">
              <span>{{ item.aut_name }}</span>
              <span>{{ item.comm_count }}评论</span>
              <span>{{ item.pubdate | spaceTime }}</span>
            </div>
            <van-grid class="mygrid" :column-num="3">
              <van-grid-item @click="comment" class="mygrid-item" icon="comment-o" :text="item.comm_count.toString()" />
              <van-grid-item class="mygrid-item" icon="like-o" text="点赞" />
              <van-grid-item class="mygrid-item" icon="share" text="分享" />
            </van-grid>
          </template>
        </van-cell>
      </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
// 导入搜索文章的方法
import { apiGetSearchArticle } from '../../api/search'
export default {
  data() {
    return {
      loading: false,
      finished: false,
      isLoading: false,
      // 搜索的关键字
      key: '',
      // 搜索的列表
      searchList: [],
      // 当前页
      page: 0,
      // 页容量
      perpage: 10
    }
  },
  methods: {
    // list 组件被加载时执行
    async onLoad() {
      // 请求下一页的数据
      this.page++
      // 请求关键字对应的文章数据
      let res = await apiGetSearchArticle({
        key: this.key,
        page: this.page,
        perpage: this.perpage
      })
      // 将结果保存起来
      this.searchList = [...this.searchList, ...res.data.data.results]
      // 判断 seachList 中的长度是否与返回总长度一样
      // 如果一样，说明已经加载完毕：需要将 finished 设置为 true
      if (this.searchList.length >= res.data.data.total_count) {
        this.finished = true
      }
      // 将加载状态设置为 false
      this.loading = false
    },
    onRefresh() {
      console.log('onRefresh')
    },
    // 返回上一个页面
    backpage() {
      // this.$router.push('/search')
      // 在 vue 中如果想要返回到当前路由的上一个路由中需要要使用一个新的方法 $router.back：返回上一个页面
      this.$router.back()
    },
    // 用来留言
    comment() {
      // 进行判断：
      // 得到用户的登录信息
      let user = this.$store.state.user
      // 判断
      if (!user || !user.token) {
        // 说明用户没有登录：跳转到登录页面
        this.$router.push('/login')
        return
      }
      console.log('comment')
    }
  },
  created() {
    // 打开页面时得到传入的关键字
    this.key = this.$route.params.key
  }
}
</script>

<style lang="less" scoped>
.searchList {
  margin-top: 46px;
}

.myhead {
  background-color: #3296fa;
  .myhead-word {
    color: #fff;
  }
}

.van-nav-bar .van-icon {
  color: #fff;
  vertical-align: middle;
}

.msg {
  span {
    margin-right: 10px;
    font-size: 12px;
  }
}

.mygrid /deep/ .van-grid-item__content.van-grid-item__content--center.van-hairline {
  flex-direction: row;
  align-items: center;
}

.mygrid /deep/ i.van-icon.van-grid-item__icon {
  font-size: 16px;
}

.mygrid /deep/ .van-grid-item__icon+.van-grid-item__text {
  margin-top: 0px;
  margin-left: 7px;
}
</style>

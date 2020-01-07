<template>
  <div class="home">
    <!-- 头部导航 -->
    <van-nav-bar class="myhead" :fixed="true">
      <template slot="title">
        <div class="myhead-word">
          首页
        </div>
      </template>
    </van-nav-bar>
    <!-- 频道 tab 区域 -->
    <van-tabs class="mytabs" v-model="acitve">
      <van-tab v-for="(item, index) in channelList" :title="item.name" :key="index">
        <!-- 文章区域 -->
        <van-pull-refresh v-model="item.isLoading" @refresh="onRefresh">
          <van-list v-model="item.loading" :finished="item.finished" finished-text="没有更多了" @load="onLoad">
            <van-cell class="mycell" v-for="(subitem, subindex) in item.articleList" :key="subindex">
              <template slot="title">
                <!-- 文章的标题 -->
                <div class="a-title">
                  {{ subitem.title }}
                </div>
                <!-- 文章的配图 -->
                <van-grid v-if="subitem.cover.type > 0" :border="false" :column-num="3">
                  <van-grid-item v-for="(imgitem, imgindex) in subitem.cover.images" :key="imgindex">
                    <van-image lazy-load :src="imgitem" />
                  </van-grid-item>
                </van-grid>
                <!-- 其它信息 -->
                <div class="other">
                  <div class="left">
                    <span>{{ subitem.aut_name }}</span>
                    <span>{{ subitem.comm_count }}评论</span>
                    <span>{{ subitem.pubdate | spaceTime }}</span>
                  </div>
                  <div class="right">
                    <van-icon @click="openmore(subitem.art_id, subitem.aut_id)" name="cross" />
                  </div>
                </div>
              </template>
            </van-cell>
          </van-list>
        </van-pull-refresh>
      </van-tab>
      <div class="myadd">
        <van-icon name="plus" @click="showpop" />
      </div>
    </van-tabs>
    <!-- 添加一个弹出层 -->
    <!-- <mypop :show="show" @input="show=$event" /> -->
    <!-- .sync：让一个参数在组件中实现双向数据绑定 -->
    <!-- 
        .sync 将参数传入到子组件中
        .sync 给子组件添加一个事件： update:xxx
       -->
    <!-- <mypop :acitve="acitve" @changeChannle="acitve = $event" :channelList="channelList" v-model="show" /> -->
    <mypop :acitve.sync="acitve" :channelList="channelList" v-model="show" />
    <!-- 更多操作面板 -->
    <more @delarticle="delarticle" :artId="artId" :articleId="articleId" v-model="moreshow" />
  </div>
</template>

<script>
// 导入 lazy-load
import Vue from 'vue'
import { Lazyload } from 'vant'
Vue.use(Lazyload)

// 导入得到频道方法
import { apiGetChannels } from '../../api/channel'
// 导入得到文章的方法
import { apiGetChannelsArticle, apiDislikeArticle } from '../../api/article'
// 导入 processloacl
import { getLoacl } from '../../utils/processlocal'
// 导入 mypop
import mypop from '../../components/mypop'
// 导入 more
import more from '../../components/more'


export default {
  // vue 中的 data 中的数据有一个特点：响应式
  //  一旦数据发生改变，视图也会跟着刷新
  // 如果数据想要是响应式的：必须在 data 中提交定义
  data() {
    return {
      // tab 中激活元素的下标
      acitve: '',
      // list 组件中的数据源
      list: [],
      // list 的加载状态
      loading: false,
      // list 中数据源的加载状态
      finished: false,
      // 决定下拉刷新组件的刷新状态
      isLoading: false,
      // 数据源
      channelList: [],
      // 控制频道操作面板的状态
      show: false,
      timer: null,
      // 控制更多面板的显示和隐藏
      moreshow: false,
      // 要删除的文章 id
      articleId: 0,
      // 要拉黑的作者 id
      artId: 0
    }
  },
  methods: {
    // list 被加载时执行
    // 页面下拉触底时执行
    async onLoad() {
      // 得到当前的频道数据
      let currentChannel = this.channelList[this.acitve]
      // 根据频道 id 得到频道下的数据
      let res = await apiGetChannelsArticle({
        channelId: currentChannel.id,
        timestamp: currentChannel.pre_timestamp ? currentChannel.pre_timestamp : Date.now()
      })
      // 将当前频道下的文章数据保存起来
      currentChannel.articleList = [...currentChannel.articleList, ...res.data.data.results]
      // 保存返回的 pre_timestamp，用于第一次之后的请求
      currentChannel.pre_timestamp = res.data.data.pre_timestamp
      // 判断数据是否加载完毕
      if (res.data.data.pre_timestamp === null) {
        // 将 list 的加载状态设置为 true
        currentChannel.finished = true
      }
      // 手动将 list 的加载状态设置为 false
      currentChannel.loading = false
      console.log(currentChannel.articleList)
    },
    // 下拉时会触发: 会将下拉刷新的组件的v-model改为true
    onRefresh() {
      // 得到当前频道数据
      let currentChannel = this.channelList[this.acitve]
      // 将当前频道中的数据全部清空
      currentChannel.loading = false
      currentChannel.finished = false
      currentChannel.articleList = []
      currentChannel.pre_timestamp = null
      this.onLoad()
      currentChannel.isLoading = false
    },
    // 得到频道数据
    async getChannels() {
      // 判断：
      // 得到用户的登录信息
      let user = this.$store.state.user
      // 用户是否登录：
      if (user && user.token) {
        let res = await apiGetChannels()
        this.channelList = res.data.data.channels
      } else {
        // 用户没有登录：
        // 得到 localstoreage 中的数据
        let channels = getLoacl('channels')
        //  判断 localstoreage 中是否有数据
        if (channels) {
          // 有数据
          this.channelList = channels
        } else {
          // 没有数据,直接请求服务器中的默认数据
          let res = await apiGetChannels()
          this.channelList = res.data.data.channels
        }
      }
      // 添加一个给 list 添加额外属性的方法
      this.addPropTochannelList()
    },
    // 添加一个给 list 添加额外属性的方法
    addPropTochannelList() {
      this.channelList.forEach(item => {
        // 如果不是在 data 中定义的数据，是不具备响应式的特点的
        // item.loading = false
        // item.finished = false
        // item.articleList = []
        // item.isLoading = false
        // 使用 $set 来进行添加
        this.$set(item, 'loading', false)
        this.$set(item, 'finished', false)
        this.$set(item, 'articleList', [])
        this.$set(item, 'isLoading', false)
        this.$set(item, 'pre_timestamp', null)
      })
    },
    // 修改面板状态
    showpop() {
      this.show = true
    },
    // 打开更多操作面板
    openmore(id, aut_id) {
      // 给文章 id 赋值
      this.articleId = id
      // 给拉黑的作者添加 id
      this.artId = aut_id
      // 打开更多面板
      this.moreshow = true
    },
    // 删除文章的方法
    async delarticle(aid) {
      // 从数据源中删除当前文章对应的数据
      // 得到文章数据源
      let articleList = this.channelList[this.acitve].articleList
      // 根据 id 将数据源进行删除
      articleList.forEach((item, index) => {
        if (item.art_id === aid) {
          // 说明当前数据需要删除
          articleList.splice(index, 1)
        }
      })
      // 发送请求到服务器将文章标识为不喜欢
      await apiDislikeArticle(aid)
      // 关闭更多面板
      this.moreshow = false
    }
  },
  created() {
    // 加载频道数据
    this.getChannels()
  },
  components: {
    mypop,
    more
  }
}
</script>

<style lang="less" scoped>
.myhead {
  background-color: #3296fa;
  .myhead-word {
    color: #fff;
  }
}

.home {
  margin-top: 90px;
}

.mytabs {
  position: relative;
  .myadd {
    position: fixed;
    top: 46px;
    right: 0px;
    height: 44px;
    line-height: 44px;
    text-align: center;
    width: 10%;
  }
}

.home /deep/.van-tabs__wrap {
  width: 90%;
  position: fixed;
  top: 47px;
  left: 0;
  z-index: 99;
}
.other {
  display: flex;
  justify-content: space-between;
  align-items: center;
  .left {
    span {
      margin-right: 10px;
    }
  } 
  .right {
    border: 1px solid #ccc;
    width: 30px;
    height: 20px;
    line-height: 24px;
    text-align: center;
  }
}
</style>

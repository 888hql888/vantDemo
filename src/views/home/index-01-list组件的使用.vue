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
      <van-tab v-for="index in 8" :title="'标签 ' + index" :key="index">
        <!-- 文章区域 -->
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
          {{ acitve }}
          <van-cell v-for="item in list" :key="item" :title="item" />
        </van-list>
      </van-tab>
      <div class="myadd">
        <van-icon name="plus" />
      </div>
    </van-tabs>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // tab 中激活元素的下标
      acitve: '',
      // list 组件中的数据源
      list: [],
      loading: false,
      finished: false
    }
  },
  methods: {
    // list 被加载时执行
    // 页面下拉触底时执行
    onLoad() {
      setTimeout(() => {
        // 打开页面加载 List 时，会去加载数据
        let arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20]
        // 累加
        this.list = [...this.list, ...arr]
        console.log(this.list.length)
        // 当数据达到 100 条时，停止所有的加载
        if (this.list.length >= 100) {
          this.finished = true
        }
        this.loading = false
      }, 1000)
    }
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
  margin-bottom: 50px;
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
  z-index: 9999;
}
</style>

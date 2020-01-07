<template>
    <div>
        <router-view></router-view>
        <!-- 封装 tabBar -->
        <van-tabbar :route="true">
            <van-tabbar-item to="/home" icon="home-o">首页</van-tabbar-item>
            <van-tabbar-item to="/search" icon="search">搜索</van-tabbar-item>
            <van-tabbar-item icon="friends-o">视频</van-tabbar-item>
            <van-tabbar-item to="/my" icon="setting-o">我的</van-tabbar-item>
        </van-tabbar>
    </div>
</template>

<script>
export default {
    data () {
        return {
        }
    }
}
</script>

<style>

</style>

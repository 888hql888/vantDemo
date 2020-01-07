<template>
    <div>
        <!-- 书写评论 -->
        <van-search class="write" show-action placeholder="请输入搜索关键词" v-model="value">
            <template slot="action">
                <div @click="onSearch">
                    发送
                </div>
            </template>
            <template slot="left-icon">
                <van-icon name="edit" />
            </template>
        </van-search>
    </div>
</template>

<script>
// 导入添加评论的方法
import { apiAddComment, apiAddCommentReply } from '../api/commentjs'

export default {
    //    文章的id 判断是否是文章的评论 当前评论的 id
    props: ['artId', 'iscomment', 'commid'],
    data() {
        return {
            value: ''
        }
    },
    methods: {
        async onSearch() {
            // 发表文章的评论
            if (this.iscomment === true) {
                // 判断内容是否为空
                if (this.value.trim().length === 0) {
                    return
                }
                // 得到评论的内容，发送请求到服务器，添加评论：
                //  target: 文章的 id
                //  content：评论的内容
                let res = await apiAddComment({
                    artid: this.artId,
                    content: this.value
                })
                // 保存返回的数据
                let newObj = res.data.data.new_obj // 就是发布的评论信息： 作者 id 作者 name 评论的内容 评论的 id 。。。。。
                // 将数据传给父组件 detail.vue 中的 commentList 里
                // 将数据传给父组件
                this.$emit('addcomment', newObj)
                // 清空输入框
                this.value = ''
            } else { // 发送评论的回复
                // 发送评论的回复
                let res = await apiAddCommentReply({
                    commid: this.commid,// 缺少
                    content: this.value,
                    artid: this.artId // 文章的 id
                })
                // 得到返回的评论回复对象
                let newObj = res.data.data.new_obj
                // 将回复的数据渲染到 commentreply 中
                // 将回复的数据传给 commentreply
                this.$emit('addcommentreply', newObj)
                this.value = ""
            }
        }
    }
}
</script>

<style lang="less">
.write {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
}
</style>

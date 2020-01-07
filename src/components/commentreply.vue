<template>
    <div>
        <!-- 评论的回复 -->
        <van-popup :value="value" @input="$emit('input', false)" position="bottom" :style="{ height: '70%' }">
            <!-- 将得到的评论数据渲染到页面上 -->
            <!-- 导入comment 组件，并且渲染数据 -->
            <van-cell title="当前评论"></van-cell>
            <comment :isreply="true" :source="source" />
            <van-cell title="评论的回复"></van-cell>
            <!-- 评论的回复 -->
            <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
                <comment :isreply="true" :source="item" v-for="(item, index) in replyList" :key="index" />
            </van-list>
            <!-- 书写评论回复的组件 -->
            <write @addcommentreply="addcommentreply" :commid="source.com_id" :artId="artId" :iscomment="false" />
        </van-popup>
    </div>
</template>

<script>
// 导入 bus
import bus from '../utils/bus'
import comment from '../components/comment'
import { apiGetCommentReply } from '../api/commentjs'
import write from './write'

export default {
    props: ['value', 'artId'],
    data() {
        return {
            source: {}, // 当前评论的数据源
            offset: null,
            limit: 10,
            loading: false,
            finished: false,
            endid: 0,
            // 回复的列表
            replyList: []
        }
    },
    methods: {
        async getCommentReply() {
            let res = await apiGetCommentReply({
                comid: this.source.com_id.toString(),
                offset: this.offset,
                limit: this.limit
            })
            // 保存数据源
            this.replyList = [...this.replyList, ...res.data.data.results]
            // 保存最后数据的标识
            this.endid = res.data.data.end_id
            // 保存当前页最后数据的标识
            this.offset = res.data.data.last_id
            // 判断数据是否加载完毕
            if (this.offset === this.endid) {
                this.finished = true
            }
            // 加载状态关闭
            this.loading = false
        },
        onLoad() {
            this.getCommentReply()
        },
        // 添加评论的回复
        addcommentreply(newObj) {
            this.replyList.push(newObj)
            this.source.reply_count = this.source.reply_count + 1
        }
    },
    created() {
        // 接收参数
        bus.$on('currentComment', value => {
            this.source = value
            console.log(this.source)
        })
    },
    components: {
        comment,
        write
    }
}
</script>

<style>

</style>

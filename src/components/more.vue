<template>
    <div>
        <!-- 显示更多操作面板 -->
        <!-- <van-popup :value="value" @input="$emit('input', false)">内容</van-popup> -->
        <van-dialog :value="value" @input="$emit('input', false)" :showConfirmButton="false">
            <van-cell-group v-if="istype === false">
                <van-cell icon="cross" @click="$emit('input'), false" />
                <van-cell icon="bookmark-o" @click="dislike" title="不感兴趣" />
                <van-cell icon="medel-o" title="反馈垃圾内容" @click="istype=true" is-link />
                <van-cell icon="eye-o" @click="blacklist" title="拉黑作者" />
            </van-cell-group>
            <van-cell-group v-if="istype === true">
                <van-cell icon="arrow-left" @click="istype=false" />
                <van-cell @click="jubao(item.id)" v-for="(item, index) in types" :key="index" :title="item.name" />
            </van-cell-group>
        </van-dialog>
    </div>
</template>

<script>
// 导入 举报方法             拉黑作者
import { apiJuBaoArticle, apiBlackList } from '../api/article'

export default {
    // 控制面板的显示隐藏 要删除文章的 id 拉黑作者的id
    props: ['value', 'articleId', 'artId'],
    data() {
        return {
            // 举报的类型
            types: [
                { id: 0, name: '其他问题' },
                { id: 1, name: '标题夸张' },
                { id: 2, name: '低俗色情' },
                { id: 3, name: '错别字多' },
                { id: 4, name: '旧闻重复' },
                { id: 5, name: '广告软文' },
                { id: 6, name: '内容不实' },
                { id: 7, name: '涉嫌违法犯罪' },
                { id: 8, name: '侵权' }
            ],
            // 是否处理举报结构
            istype: false
        }
    },
    methods: {
        // 对文章不感兴趣
        dislike() {
            // 触发父组件中的一个方法：
            this.$emit('delarticle', this.articleId)
        },
        // 举报文章
        async jubao(type) {
            try {
                // 举报文章
                await apiJuBaoArticle({
                    target: this.articleId.toString(),
                    type: type
                })
                // 关闭更多面板
                this.$emit('input', false)
            } catch (error) {
                // 关闭更多面板
                this.$emit('input', false)
                // 提示用户已经举报过了
                this.$toast.fail('文章已经举报过了')
            }
            // istype: 切换回非举报面板
            this.istype = false
        },
        // 拉黑作者
        async blacklist() {
            try {
                // 作者信息提交到服务器
                await apiBlackList(this.artId)
                this.$emit('input', false)
                this.$toast.success('拉黑成功')
            } catch (error) {
                this.$emit('input', false)
                this.$toast.fail('未知的错误')
            }
        }
    }
}
</script>

<style>

</style>

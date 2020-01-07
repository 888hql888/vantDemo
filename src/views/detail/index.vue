<template>
    <div class="detail">
        <!-- 头部 -->
        <van-nav-bar fixed @click-left="backpage" left-arrow class="myhead">
            <template slot="title">
                <div class="myhead-word">
                    文章详情
                </div>
            </template>
        </van-nav-bar>
        <!-- 标题 -->
        <van-cell>
            <template slot="title">
                <h1 class="mytitle">{{ articleDetail.title }}</h1>
            </template>
        </van-cell>
        <!-- 作者信息 -->
        <van-sticky :offset-top="46">
            <van-cell>
                <template slot="title">
                    <div class="abox">
                        <div class="aimg">
                            <img :src="articleDetail.aut_photo" alt="">
                        </div>
                        <div class="amsg">
                            <div>{{ articleDetail.aut_name }}</div>
                            <div>{{ articleDetail.pubdate | spaceTime }}</div>
                        </div>
                        <div class="abtn">
                            <van-button @click="follow" type="info" v-if="articleDetail.is_followed === false"> + 关注</van-button>
                            <van-button @click="unfollow" type="info" v-else>已关注</van-button>
                        </div>
                    </div>
                </template>
            </van-cell>
        </van-sticky>
        <!-- 文章内容 -->
        <van-cell>
            <template slot="title">
                <div v-html="articleDetail.content"></div>
            </template>
        </van-cell>
        <!-- 点赞 & 不喜欢 -->
        <div class="btns">
            <van-button @click="zan" class="btn" plain round :type="articleDetail.attitude === 1 ? 'danger': 'default'">
                <van-icon name="like-o" />点赞</van-button>
            <van-button @click="dislike" class="btn" plain round :type="articleDetail.attitude === 0 ? 'danger': 'default'">
                <van-icon name="delete" />不喜欢</van-button>
        </div>
        <!-- 评论区域 -->
        <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <comment @openreplay="replyOpen=$event" :isreply="false" :source="item" v-for="(item, index) in commentList" :key="index" />
        </van-list>
        <!-- 留言区域 -->
        <!-- 传入一个文章 id -->
        <write :iscomment="true" @addcomment="addcomment" :artId="artId" />
        <commentreply :artId="artId" v-model="replyOpen" />
    </div>
</template>

<script>
// 导入评论组件
import comment from '../../components/comment'
import write from '../../components/write'
import commentreply from '../../components/commentreply'
// 导入请求文章详情的方法
import { apiGetArticleDetail, apiZan, apiDislike } from '../../api/article'
// 导入关注&取关作者的方法
import userApi from '../../api/user'
// 导入获取评论的接口
import { apiGetArticleComment } from '../../api/commentjs'
export default {
    data() {
        return {
            // 文章 id
            artId: 0,
            // 文章详情
            articleDetail: {},
            // 偏移量
            offset: null,
            // 页容量
            limit: 10,
            // 评论的数据源
            commentList: [],
            // 结束评论的 id
            endid: 0,
            // list 的加载状态
            loading: false,
            // list 的数据源是否加载完成
            finished: false,
            // 评论回复组件是否显示
            replyOpen: false
        }
    },
    methods: {
        backpage() {
            this.$router.back()
        },
        // 得到文章的详情
        async getArticleDetail() {
            // 依旧是异步的代码
            let res = await apiGetArticleDetail(this.artId)
            this.articleDetail = res.data.data
        },
        // 关注作者
        async follow() {
            // 得到作者 id
            let aut_id = this.articleDetail.aut_id
            // 发送请求到服务器
            await userApi.apiFollowedAut(aut_id)
            // 将 is_followed 属性设置为 true
            this.articleDetail.is_followed = true
        },
        // 取关作者
        async unfollow() {
            // 得到作者 id
            let aut_id = this.articleDetail.aut_id
            // 发送请求到服务器
            await userApi.apiunFollowAut(aut_id)
            // 将 is_followed 改为 false
            this.articleDetail.is_followed = false
        },
        // 点赞
        async zan() {
            await apiZan(this.artId)
            // 将状态改为 1
            this.articleDetail.attitude = 1
        },
        // 不喜欢
        async dislike() {
            await apiDislike(this.artId)
            this.articleDetail.attitude = 0
        },
        // 得到文章的到评论
        async getArticleComment() {
            let res = await apiGetArticleComment({
                artid: this.artId,
                offset: this.offset ? this.offset : null,
                limit: this.limit
            })
            // 保存评论数据源
            this.commentList = [...this.commentList, ...res.data.data.results]
            // 保存结束评论的 id
            this.endid = res.data.data.end_id
            // 保存当前页的最后一条评论的 id
            this.offset = res.data.data.last_id
            if (this.offset === this.endid) {
                // 说明数据已经加载完毕
                this.finished = true
            }
            // 关闭加载状态
            this.loading = false
        },
        // list 的加载方法
        onLoad() {
            // 根据 id 发送请求到服务器，得到文章的评论数据
            this.getArticleComment()
        },
        // 添加评论
        addcomment(newObj) {
            // 将 newObj 添加到 commentList 中
            this.commentList.push(newObj)
        }
    },
    created() {
        // 得到文章的 id
        this.artId = this.$route.params.artid
        // 根据 id 发送请求到服务器，得到文章详情数据
        this.getArticleDetail()
    },
    components: {
        comment,
        write,
        commentreply
    }
}
</script>

<style lang="less">
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

.detail {
    margin-top: 46px;
    margin-bottom: 54px;
    .mytitle {
        font-weight: 400;
        text-align: center;
    }
}

.abox {
    display: flex;
    align-items: center;
    .aimg {
        img {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            margin-right: 10px;
        }
    }
    .amsg {
        flex: 1;
    }
}

.btns {
    text-align: center;
    .btn {
        margin: 30px 50px;
    }
}
</style>

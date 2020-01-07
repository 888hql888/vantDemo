<template>
    <div>
        <!-- 封装评论信息 -->
        <van-cell>
            <template slot="title">
                <div class="commbox">
                    <div class="img">
                        <img :src="source.aut_photo" alt="">
                    </div>
                    <div class="msg">
                        <div class="name">
                            {{ source.aut_name }}
                        </div>
                        <div class="content">
                            {{ source.content }}
                        </div>
                        <div>
                            <span>{{ source.pubdate | spaceTime }}</span>
                            <van-button v-if="isreply===false" @click="openreplay" size="small" round type="default">回复{{ source.reply_count }}</van-button>
                        </div>
                    </div>
                    <div class="zan">
                        <van-icon class="icon" name="like"></van-icon>{{ source.like_count }}
                    </div>
                </div>
            </template>
        </van-cell>
    </div>
</template>

<script>
// 导入 bus
import bus from '../utils/bus'

export default {
    //  评论的数据源    是否是回复
    props: ['source', 'isreply'],
    methods: {
        // 在评论组件中打开评论回复组件
        openreplay() {
            // 修改父组件中的 replyopen 的值
            this.$emit('openreplay', true)
            // 传入一个参数给 commentreplay
            bus.$emit('currentComment', this.source)
        }
    }
}
</script>

<style lang="less" scoped>
.commbox {
    display: flex;
    .img {
        img {
            width: 50px;
            height: 50px;
            border-radius: 50%;
            margin-right: 15px;
        }
    }
    .msg {
        flex: 1;
        .name {
            color: skyblue;
        }
        .content {
            margin: 20px 0;
        }
    }
    .zan {
        .icon {
            color: red;
        }
    }
}
</style>

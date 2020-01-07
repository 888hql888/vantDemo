<template>
    <div>
        <!-- 头部导航 -->
        <van-nav-bar fixed @click-left="backpage" left-arrow class="myhead" title="登录">
            <template slot="title">
                <div class="myhead-word">
                    小智同学
                </div>
            </template>
        </van-nav-bar>
        <!-- 内容区域 -->
        <div class="chatList" ref="chatList">
            <div :class="item.robote === true ? 'robote' : 'person'" v-for="(item, index) in list" :key="index">
                <img class="img" src="https://ss1.bdstatic.com/70cFvXSh_Q1YnxGkpoWK1HF6hhy/it/u=3150983873,1268408586&fm=26&gp=0.jpg" alt="">
                <div class="item">
                    {{ item.msg }}
                </div>
            </div>
        </div>
        <!-- 底部发送信息区域 -->
        <div class="bottom">
            <input class="ipt" type="text" v-model="msg">
            <button class="btn" @click="send">发送</button>
        </div>
    </div>
</template>

<script>
// 导入 websocket
import io from 'socket.io-client'

export default {
    data() {
        return {
            socket: null,
            msg: '',
            // 创建一个数据用来保存聊天记录
            list: [
                {
                    robote: true, // 设置当前信息是谁发送的
                    msg: '你好啊' // 发送的消息
                }
            ]
        }
    },
    created() {
        // 使用socket.io-client 去连接服务器
        this.socket = io(`http://ttapi.research.itcast.cn?token=${this.$store.state.user.token}`)

        // 端接收服务器响应的
        this.socket.on('message', value => {
            // 也需要将响应的数据保存到记录中
            this.list.push({
                msg: value.msg,
                robote: true
            })
        })
    },
    methods: {
        // 点击发送发送数据到服务器
        send() {
            // 发送数据到服务器
            this.socket.emit('message', {
                msg: this.msg,
                timestamp: Date.now()
            })
            // 将记录保存到 list 
            this.list.push({
                robote: false,
                msg: this.msg
            })
        },
        backpage() {
            this.$router.back()
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

.van-nav-bar .van-icon {
    color: #fff;
    vertical-align: middle;
}

.chatList {
    overflow: auto;
    background-color: pink;
    position: fixed;
    width: 100%;
    top: 46px;
    bottom: 46px;
}

.bottom {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 46px;
    background-color: #ccc;
    .ipt {
        width: 80%;
        height: 40px;
        border-radius: 5px;
    }
    .btn {
        width: 15%;
        height: 40px;
    }
}

.chatList {
    .img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
    }
    .item {
        background-color: #e0effb;
        padding: 10px;
    }
}

.robote {
    overflow: hidden;
    margin-top: 20px;
    .img {
        margin-left: 10px;
        float: left;
    }
    .item {
        margin-left: 10px;
        float: left;
    }
}

.person {
    overflow: hidden;
    margin-top: 20px;
    .img {
        float: right;
        margin-right: 10px;
    }
    .item {
        float: right;
        margin-right: 10px;
    }
}
</style>

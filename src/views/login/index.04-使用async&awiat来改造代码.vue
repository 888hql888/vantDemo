<template>
    <div>
        <!-- 头部 -->
        <!-- <van-nav-bar class="myhead" title="登录" /> -->
        <van-nav-bar class="myhead" title="登录">
            <template slot="title">
                <div class="myhead-word">
                    登录
                </div>
            </template>
        </van-nav-bar>
        <!-- 输入框 -->
        <van-cell-group>
            <van-field v-model="user.mobile" clearable :error-message="error.mobilemsg" placeholder="请输入手机号">
                <template slot="left-icon">
                    <i class="iconfont icon-shouji"></i>
                </template>
            </van-field>
            <van-field v-model="user.code" :error-message="error.codemsg" placeholder="请输入验证码">
                <template slot="button">
                    <van-button type="default" class="mybtn" round size="small">获取验证码</van-button>
                </template>
                <template slot="left-icon">
                    <i class="iconfont icon-lock-"></i>
                </template>
            </van-field>
        </van-cell-group>
        <!-- 登录按钮 -->
        <div class="myloginbtn">
            <van-button @click="login" class="lb-btn" type="info" size="large">登录</van-button>
        </div>
    </div>
</template>

<script>
// 导入方法
import apiuse from '../../api/user'
export default {
    data() {
        return {
            user: {
                mobile: '13911111111',
                code: '246810'
            },
            error: {
                mobilemsg: '',
                codemsg: ''
            }
        }
    },
    methods: {
        // 完成登录
        async login() {
            // 进行参数的验证
            if (!this.check()) {
                return
            }
            try {
                // 登录
                let res = await apiuse.apiUseLogin(this.user)
                console.log(res)
            } catch {
                console.log('出错啦')
            }
        },
        // 验证的方法
        check() {
            // 定义一个结果
            let mobileRes = true
            let codeRes = true
            // 验证手机号的合法性
            if (this.user.mobile.trim().length !== 11) {
                this.error.mobilemsg = '手机号不合法'
                mobileRes = false
            }
            // 验证验证码的合法性
            if (this.user.code.trim().length !== 6) {
                this.error.codemsg = '验证码不合法'
                codeRes = false
            }
            // 如果通过清空
            if (mobileRes) {
                this.error.mobilemsg = ''
            }
            if (codeRes) {
                this.error.codemsg = ''
            }
            return mobileRes && codeRes
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

// .van-nav-bar__title.van-ellipsis {
//     color: #fff;
// }
.mybtn {
    background-color: #ededed;
}

.myloginbtn {
    margin: 20px 10px;
    .lb-btn {
        border-radius: 5px;
    }
}
</style>

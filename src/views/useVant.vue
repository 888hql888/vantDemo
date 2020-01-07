<template>
    <div>
        <h1>使用 vant</h1>
        <h3>01使用按钮</h3>
        <van-button type="default">默认按钮</van-button>
        <van-button type="primary">主要按钮</van-button>
        <van-button type="info">信息按钮</van-button>
        <van-button type="warning">警告按钮</van-button>
        <van-button type="danger">危险按钮</van-button>
        <h3>02使用单元格</h3>
        <van-cell title="左侧" value="右侧" label="下方的内容" />
        <h3>03字体图标</h3>
        <van-icon name="like-o" />
        <h3>04 vant 中的插槽</h3>
        <van-cell title="左侧" icon="like-o" value="右侧" label="下方的内容">
            <!-- 加入一个插槽 -->
            <template slot="title">
                我是左侧的内容
                <van-icon name="like-o" />
            </template>
            <template slot="default">
                <van-icon name="like-o" /> 我是右侧的内容
                <van-icon name="like-o" />
            </template>
            <template slot="label">
                <van-icon name="like-o" /> 我是描述区域
                <van-icon name="like-o" />
            </template>
        </van-cell>
        <h3>05 vant 中的表单验证</h3>
        <van-field v-model="value" label="用户名" placeholder="请输入用户名" :error-message="errMsg" />
        <van-button type="danger" @click="myfn">验证用户名是否合法</van-button>
    </div>
</template>

<script>
export default {
    data() {
        return {
            value: '',
            errMsg: ''
        }
    },
    methods: {
        myfn() {
            // 验证：
            if (!this.yanzheng()) {
                return
            }
            console.log('验证通过')
        },
        // 封装一个验证的方法
        yanzheng() {
            // 标识验证是否通过： true 通过 false 不通过
            let res = true
            // 验证 value 的合法性
            if (this.value.trim().length === 0) {
                // 不合法
                this.errMsg = '对不起，用户名不能为空'
                res = false
            }
            if (res) {
                // 将错误信息清空
                this.errMsg = ''
            }
            return res
        }
    }
}
</script>

<style>

</style>

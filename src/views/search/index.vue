<template>
    <div>
        <!-- 搜索框 -->
        <van-search v-model="key" background="#3296fa" @input="think" placeholder="请输入搜索关键词" show-action @search="onSearch">
            <template slot="action">
                <button class="mybtn" @click="cancle">取消</button>
            </template>
        </van-search>
        <!-- 联想区域 -->
        <van-cell-group v-if="ishis === false">
            <van-cell @click="onSearch(item.item)" icon="search" v-for="(item, index) in thinkList" :key="index">
                <template slot="title">
                    <div v-html="item.colorItem"></div>
                </template>
            </van-cell>
        </van-cell-group>
        <!-- 搜索历史 -->
        <van-cell-group v-if="ishis === true">
            <van-cell title="搜索历史">
                <template slot="right-icon">
                    <van-icon name="delete" @click="delAll" />
                </template>
            </van-cell>
            <van-cell @click="onSearch(item)" icon="search" :title="item" v-for="(item, index) in historyList" :key="index">
                <template slot="right-icon">
                    <van-icon @click.stop="delhis(index)" name="cross" />
                </template>
            </van-cell>
        </van-cell-group>
    </div>
</template>

<script>
// 导入联想的接口
import { apiThink } from '../../api/search'
// 导入操作 localstorage 的方法
import * as mylocal from '../../utils/processlocal'

export default {
    data() {
        return {
            // 搜索框中的内容
            key: '',
            // 控制显示区域：联想 & 历史
            ishis: true,
            // 联想的数据源
            thinkList: [],
            // 定义一个防抖的定时器
            timer: null,
            // 搜索历史
            historyList: []
        }
    },
    methods: {
        // 当点击完成按钮时触发
        onSearch(key) {
            // 先将数据保存到 historyList 中
            this.historyList.unshift(key)
            // 判断数据源中的数据是否有重复的
            this.historyList = [...new Set(this.historyList)]

            // 将数组保存到 localstorage 中
            mylocal.addLocal('history', this.historyList)
            // 得到输入的内容，并且将其提交到搜索列表详情页面中
            this.$router.push(`/searchList/${key}`)
        },
        // 联想的方法
        think() {
            // 清除定时器
            clearTimeout(this.timer)
            // 重新给定时器赋值
            this.timer = setTimeout(async () => {
                // 判断输入的内容是否为空：
                if (this.key.trim().length === 0) {
                    this.thinkList = []
                    // 将搜索历史显示出来
                    this.ishis = true
                    // 后续不执行
                    return
                }
                // 得到输入的内容, 根据内容到服务器得到联想的数据
                let res = await apiThink(this.key)
                // 保存联想数据
                this.thinkList = res.data.data.options
                // 使用关键字将内容进行切割
                this.thinkList = this.thinkList.map(item => {
                    return {
                        // 没有改变颜色的
                        item: item,
                        // 已经改变过颜色的
                        colorItem: item.split(this.key).join(`<span style="color: red">${this.key}</span>`)
                        // colorItem: item.replace(this.key, `<span style="color: red">${this.key}</span>`)
                    }
                })
                this.ishis = false
                console.log(this.thinkList)
            }, 300);
        },
        // 取消
        cancle() {
            this.key = ''
            this.thinkList = []
            this.ishis = true
        },
        // 删除历史
        delhis(index) {
            // 删除下标对应的元素
            this.historyList.splice(index, 1)
            // 重新将数据保存到 本地
            mylocal.addLocal('history', this.historyList)
        },
        // 清空所有历史
        delAll() {
            // 打开一个提示框
            this.$dialog.confirm({
                title: '警告',
                message: '此操作将清空所有历史，您确定吗？'
            }).then(() => {
                // 清空 history
                mylocal.delLocal('history')
                // 清除历史
                this.historyList = []
            }).catch(() => {
                // on cancel
                console.log('你点了取消')
            });
        }
    },
    created() {
        // 取出搜索历史
        this.historyList = mylocal.getLoacl('history') || []
    }
}
</script>

<style lang="less" scoped>
.mybtn {
    color: #fff;
    background-color: #3296fa;
    border: none;
    outline: none;
}

.mybtn:active {
    color: red;
}

.van-search__action {
    background-color: #3296fa;
}
</style>

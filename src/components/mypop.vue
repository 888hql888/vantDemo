<template>
    <div>
        <!-- 频道操作面板 -->
        <van-popup :value="value" @input="$emit('input', false)" position="bottom" :style="{ height: '90%' }" :overlay="true">
            <!-- 关闭按钮  -->
            <van-cell>
                <template slot="title">
                    <van-icon @click="$emit('input', false)" class="myclose" name="cross" />
                </template>
            </van-cell>
            <!-- 我的频道区域 -->
            <van-cell title="我的频道">
                <template slot="title">我的频道</template>
                <template slot="default">
                    <van-button plain round type="danger" v-if="iconshow===false" @click="iconshow=true" size="mini">编辑</van-button>
                    <van-button plain round type="danger" v-if="iconshow===true" @click="iconshow=false" size="mini">完成</van-button>
                </template>
            </van-cell>
            <!-- 频道渲染区域 -->
            <van-cell>
                <template slot="title">
                    <!-- 渲染频道数据 -->
                    <van-grid>
                        <van-grid-item @click="selectChannel(index)" class="topfather" v-for="(item, index) in channelList" :key="index">
                            <template slot="text">
                                <van-icon @click.stop="delChannel(index)" v-if="iconshow && index !== 0" class="topson" name="clear" />
                                <span :class="{ active: acitve === index }">{{ item.name }}</span>
                            </template>
                        </van-grid-item>
                    </van-grid>
                </template>
            </van-cell>
            <!-- 频道推荐区域 -->
            <van-cell>
                <template slot="title">频道推荐</template>
            </van-cell>
            <!-- 频道渲染区域 -->
            <van-cell>
                <template slot="title">
                    <!-- 渲染频道数据 -->
                    <van-grid>
                        <van-grid-item @click="addChannel(item)" v-for="(item, index) in tuijian" :key="index">
                            <template slot="text">
                                <div :style="{fontSize: '12px'}">
                                    {{ item.name }}
                                </div>
                            </template>
                        </van-grid-item>
                    </van-grid>
                </template>
            </van-cell>
        </van-popup>
        <!-- 
            将 show 以 value 的形式传入到了 van-popup 中
            给 van-popup 添加了一个事件：
                这个事件可以用来修改 show
        -->
    </div>
</template>

<script>
// 导入得到频道数据的方法
import { apiGetAllChannles, apiResetChannel } from '../api/channel'
import { addLocal } from '../utils/processlocal'

export default {
    //  控制面板的显示   我的频道数据源 选中的下标
    props: ['value', 'channelList', 'acitve'],
    data() {
        return {
            iconshow: false,
            // 所有的频道数据
            allChannels: []
        }
    },
    methods: {
        // 得到所有的频道数据
        async getAllChannels() {
            let res = await apiGetAllChannles()
            this.allChannels = res.data.data.channels
        },
        // 给频道推荐添加一个点击事件
        addChannel(item) {
            // 给 item 添加额外属性：
            this.$set(item, 'loading', false)
            this.$set(item, 'finished', false)
            this.$set(item, 'articleList', [])
            this.$set(item, 'isLoading', false)
            this.$set(item, 'pre_timestamp', null)
            // 将 item 添加到 我的频道 数组中
            this.channelList.push(item)
            this.saveChannel()
        },
        // 删除频道数据
        delChannel(index) {
            // 判断当前下标是否小于传入的下标
            if (index < this.acitve) {
                this.$emit('update:acitve', this.acitve - 1)
            }
            // 当前点击频道的下标
            // 将元素从数组中删除
            this.channelList.splice(index, 1)
            this.saveChannel()
        },
        // 封装保存频道状态的方法
        async saveChannel() {
            // 保存频道状态
            let user = this.$store.state.user
            // 判断是否登录
            if (user && user.token) {
                // 提交数据到服务器
                let channels = this.channelList.slice(1).map((item, index) => {
                    return {
                        id: item.id,
                        seq: index + 2
                    }
                })
                // 说明登录
                // 发送请求到服务器：更新了数据
                await apiResetChannel(channels)
            } else {
                addLocal('channels', this.channelList)
            }
        },
        // 在 pop 面板中选中频道
        selectChannel (index) {
            // index：选中频道的下标
            // this.$emit('changeChannle', index)
            this.$emit('update:acitve', index)
        }
    },
    computed: {
        // 得到所有频道中除去我的频道的数据结果
        // 特点：
        //  会将计算的结果进行缓存
        //  当这个计算属性的依赖数据发生改变时，会更新缓存
        tuijian: function() {
            // 得到我的频道中的所有元素的 id
            let myChannelIds = this.channelList.map(item => {
                return item.id
            })
            // 遍历所有频道数据，从其中取出 id 不在 myChannelIds 数组中的元素
            let resChannels = this.allChannels.filter(item => {
                return myChannelIds.indexOf(item.id) === -1
            })
            return resChannels
        }
    },
    created() {
        // 打开面板请求所有的频道数据
        this.getAllChannels()
    }
}
</script>

<style lang="less" scoped>
.myclose {
    font-size: 30px;
}

/deep/ .van-grid-item__content.van-grid-item__content--center.van-hairline {
    flex-direction: row;
}

.topfather {
    position: relative;
    .topson {
        position: absolute;
        top: 0;
        right: 0;
    }
}
.active {
    color: red;
}
</style>

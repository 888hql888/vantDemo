<template>
    <div>
        <!-- 顶部导航 -->
        <van-nav-bar title="个人信息" right-text="保存" left-arrow @click-left="$router.back()" @click-right="save" />
        <!-- 个人信息 -->
        <van-cell-group>
            <van-cell @click="showImg=true" title="头像" is-link>
                <template slot="default">
                    <img class="myimg" :src="userprofile.photo" alt="">
                </template>
            </van-cell>
            <van-cell title="名称" @click="nameshow=true" is-link :value="userprofile.name">
            </van-cell>
            <van-cell title="联系方式" is-link :value="userprofile.mobile">
            </van-cell>
        </van-cell-group>
        <van-cell-group>
            <van-cell title="性别" is-link :value="userprofile.gender === 0 ? '男': '女'">
            </van-cell>
            <van-cell title="生日" @click="showPanle" is-link :value="userprofile.birthday">
            </van-cell>
        </van-cell-group>
        <!-- 生日面板 -->
        <van-popup v-model="show" position="bottom" :style="{ height: '50%' }">
            <van-datetime-picker v-model="currentDate" type="date" :min-date="minDate" :max-date="maxDate" />
        </van-popup>
        <!-- 姓名面板 -->
        <van-popup v-model="nameshow" position="bottom" :style="{ height: '8%' }">
            <van-field required v-model="userprofile.name" placeholder="请输入用户名" />
        </van-popup>
        <!-- 图片修改的面板 -->
        <profileimg @updateimg="userprofile.photo=$event" v-model="showImg" />
    </div>
</template>

<script>
// 导入所有用户操作的方法
import userObj from '../../api/user'
// 导入图片操作面板
import profileimg from '../../components/profileimg'

export default {
    data() {
        return {
            userprofile: {},
            // 选择的生日
            currentDate: new Date(),
            minDate: new Date(1900, 0, 1),
            maxDate: new Date(),
            // 控制生日面板
            show: false,
            // 控制姓名
            nameshow: false,
            // 控制图片操作的面板
            showImg: false
        }
    },
    methods: {
        // 得到用户信息，将用户信息提交到服务器
        async save() {
            try {
                // 发送请求到服务器更新数据
                await userObj.apiProflie({
                    name: this.userprofile.name,
                    gender: this.userprofile.gender,
                    birthday: this.userprofile.birthday
                })
                // 更新成功后提示
                this.$toast.success('信息修改成功啦')
            } catch (error) {
                // 更新成功后提示
                this.$toast.fail(error.message)
            }
        },
        // 得到用户个人信息
        async getUserProfile() {
            let res = await userObj.apiGetUserProfile()
            this.userprofile = res.data.data
            this.currentDate = this.userprofile.birthday
        },
        // 打开生日的修改面板
        showPanle() {
            this.show = true
        }
    },
    created() {
        // 得到用户个人信息
        this.getUserProfile()
    },
    components: {
        profileimg
    }
}
</script>

<style lang="less" scoped>
.van-nav-bar.van-hairline--bottom {
    background-color: #3e9df8;
}

span.van-nav-bar__text {
    color: #fff;
}

i.van-icon.van-icon-arrow-left.van-nav-bar__arrow {
    color: #fff;
}

.van-nav-bar__title.van-ellipsis {
    color: #fff;
}

.myimg {
    width: 25px;
    height: 25px;
    border-radius: 50%;
}
</style>

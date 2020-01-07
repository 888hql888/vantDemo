<template>
    <van-dialog :value="value" @input="$emit('input', false)" :showConfirmButton="false">
        <van-cell-group>
            <van-cell title="从相册中选择" @click="changeImg" />
            <input style="display: none" @change="change" ref="file" type="file">
            <van-cell title="拍照" />
            <van-cell title="取消" @click="$emit('input', false)" />
        </van-cell-group>
    </van-dialog>
</template>

<script>
import Vue from 'vue';
import { ImagePreview } from 'vant';

// 导入上传图片的方法
import userObj from '../api/user'

Vue.use(ImagePreview);

export default {
    props: ['value'],
    // 使用计算属性得到图片选择器
    computed: {
        file: function() {
            return this.$refs['file']
        }
    },
    methods: {
        // 打开图片选择器
        changeImg() {
            // 得到图片上传框，并且打开选择图片
            this.file.click()
        },
        // 图片选择器的改变事件
        change() {
            // 得到选中的图片
            let fileObj = this.file.files[0]
            // 将图片对象转为 base64 格式的字符串
            // 创建一个 fileRead
            let reader = new FileReader()
            if (fileObj) {
                // 转为 base64
                reader.readAsDataURL(fileObj)
                // 设置转换成功后的事件
                reader.addEventListener('load', () => {
                    // 预览选中的图片
                    // 预览图片
                    ImagePreview({
                        images: [
                            reader.result
                        ],
                        showIndex: false,
                        // 当关闭预览面板时触发
                        onClose: this.saveimg
                    });
                })
            }
        },
        // 保存图片
        saveimg() {
            // 询问用户是否关闭
            this.$dialog.confirm({
                title: '提示',
                message: '是否将图片设置为头像'
            }).then(async () => {
                // 将图片提交到服务器
                let res = await userObj.apiSetUserImg(this.file.files[0])
                // 得到返回的数据路径
                let path = res.data.data.photo
                // 将图片提交到父组件
                this.$emit('updateimg', path)
            }).catch(() => {
                // on cancel
                console.log('取消')
            });
            // 关闭面板
            this.$emit('input', false)
        }
    }
}
</script>

<style>

</style>

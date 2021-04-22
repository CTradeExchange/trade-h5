<template>
    <Top back='true' :menu='false' title='' />
    <Loading :show='loading' />
    <div class='page-wrap'>
        <div v-if='conditionVis' class='auth-condition'>
            <van-field
                v-model='area'
                input-align='right'
                label='国家'
                placeholder='请选择国家'
                readonly
                right-icon='arrow-down'
                @click='areaShow = true'
            />
            <div class='notice'>
                <p class='title'>
                    需要准备的验证资料
                </p>
                <ul>
                    <li v-for='(item,index) in elementList' :key='index'>
                        {{ item.elementName }}
                    </li>
                </ul>
            </div>
            <van-button class='confirm-btn' @click='beginAuth'>
                开始验证
            </van-button>
        </div>
        <div v-else>
            <div class='conditon-wrap'>
                <div v-for='(item,index) in elementList' :key='index' class='c-item'>
                    <van-cell-group v-if="item.showType === 'input'">
                        <van-field
                            v-if="item.showType === 'input'"
                            v-model='conditionModel[item.elementCode]'
                            clearable
                            :label='item.elementName'
                            :placeholder='"请输入"+item.elementName'
                            :type='item.elementCode === "phone" ? "number" : "text"'
                        />
                    </van-cell-group>
                    <div v-if="item.showType === 'image'">
                        <van-uploader :after-read='afterRead'>
                            <img alt='' class='upload-img' :src='require("../../assets/auth/" + item.elementCode + ".png")' srcset='' />
                            <p class='upload-text'>
                                {{ item.elementName }}
                            </p>
                        </van-uploader>
                    </div>
                </div>
                <van-button class='confirm-btn' @click='onConfirm'>
                    提交
                </van-button>
            </div>
        </div>
    </div>
    <van-action-sheet v-model:show='areaShow' :actions='countryActions' @select='onSelect' />
</template>

<script>
import Top from '@m/layout/top'
import { useRouter, useRoute } from 'vue-router'
import { toRefs, reactive, ref, onBeforeMount } from 'vue'
import { Toast, Dialog } from 'vant'
import { findAllLevelKyc, kycLevelApply } from '@/api/user'
import { getArrayObj, isEmpty } from '@/utils/util'
import { upload } from '@/api/base'

export default {
    components: {
        Top
    },
    setup (props) {
        const router = useRouter()
        const route = useRoute()
        const levelCode = route.query.levelCode

        const fileList = ref([
            {
                url: '',
                status: 'uploading',
                message: '上传中...',
            }
        ])
        const state = reactive({
            areaShow: false,
            area: '',
            loading: false,
            list: [],
            elementList: [],
            countryActions: [],
            conditionVis: true,
            conditionModel: {}
        })

        const status = {
            0: '认证',
            1: '审核中',
            2: '审核通过',
            3: '审核拒绝'
        }

        const getConditon = () => {
            state.loading = true

            findAllLevelKyc({
                levelCode: levelCode
            }).then(res => {
                state.loading = false
                if (res.data.length > 0) {
                    res.data.forEach(item => {
                        state.countryActions.push({
                            name: item.pathCode
                        })
                    })
                }
                state.list = res.data
            }).catch(err => {
                state.loading = false
            })
        }

        const onSelect = (item) => {
            try {
                state.area = item.name
                state.elementList = getArrayObj(state.list, 'pathCode', item.name).elementList
                state.areaShow = false
            } catch (error) {
                console.log(error)
            }
        }

        const beginAuth = () => {
            if (!state.area) {
                return Toast('请先选择国家')
            }
            state.conditionVis = false
        }

        // 上传图片
        const afterRead = (file) => {
            debugger
            // console.log(file)// 由打印的可以看到，图片    信息就在files[0]里面
            // const formData = new FormData()// 通过formdata上传
            // formData.append('file', file)
            // this.$http.post('图片上传接口', formData, {
            //     method: 'post',
            //     headers: { 'Content-Type': 'multipart/form-data' }
            // }).then(function (res) {
            //     console.log(res.data)//
            // }).catch(function (error) {
            //     console.log(error)
            // })

            // file.status = 'uploading'
            // file.message = '上传中...'

            // setTimeout(() => {
            //     file.status = 'failed'
            //     file.message = '上传失败'
            // }, 1000)
        }

        const onConfirm = () => {
            const elementList = []
            if (!isEmpty(state.conditionModel)) {
                for (const key in state.conditionModel) {
                    if (state.conditionModel.hasOwnProperty(key)) {
                        elementList.push({
                            elementCode: key,
                            elementValue: state.conditionModel[key]
                        })
                    }
                }
            }

            const params = {
                pathCode: state.area,
                levelCode: levelCode,
                elementList: elementList
            }

            kycLevelApply(params).then(res => {
                if (res.check()) {
                    Dialog.alert({
                        title: '提示',
                        message: levelCode + '认证成功',
                    }).then(() => {
                        router.go(-1)
                    })
                }
            }).catch(err => {
                console.log(err)
            })
        }

        onBeforeMount(() => {
            getConditon()
        })
        return {
            ...toRefs(state),
            onSelect,
            onConfirm,
            getConditon,
            beginAuth,
            status,
            afterRead,
            fileList
        }
    }
}
</script>

<style lang="scss" scoped>
@import '@/sass/mixin.scss';
.page-wrap {
    flex: 1;
    padding-top: rem(30px);
    overflow: auto;
    .notice {
        margin-top: rem(58px);
        padding-left: rem(30px);
        .title {
            color: var(--mutedColor);
            font-size: rem(28px);
            line-height: rem(36px);
        }
        ul {
            padding-left: rem(30px);
            li {
                margin-top: rem(20px);
                list-style-type: disc;
            }
        }
    }
    .conditon-wrap {
        padding-bottom: rem(50px);
        .c-item {
            margin-bottom: rem(50px);
            text-align: center;
            .upload-img {
                width: rem(400px);
                height: rem(260px);
            }
            .upload-text {
                margin-top: rem(20px);
            }
        }
    }
    .confirm-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        color: var(--color);
        font-size: rem(34px);
        background: var(--btnColor);
    }
    .confirm-btn {
        position: absolute;
        bottom: 0;
        width: 100%;
        color: var(--color);
        font-size: rem(34px);
        background: var(--btnColor);
    }
}
</style>

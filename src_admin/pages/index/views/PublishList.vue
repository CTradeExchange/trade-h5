<template>
    <div class='m-pageList'>
        <el-page-header class='header' content='页面发布记录' @back='back' />
        <div class='data-list'>
            <el-table
                v-loading='loading'
                border
                :data='list'
                style='width: 100%;'
            >
                <el-table-column
                    align='center'
                    label='页面编码'
                    prop='page_code'
                    width='100'
                />
                <el-table-column
                    align='center'
                    label='标题'
                    prop='title'
                    width='120'
                />
                <el-table-column align='center' label='缩略图' prop='img'>
                    <template #default='scope'>
                        <div
                            v-if='scope.row.img'
                            class='img'
                            @click='showImg(scope.row.img)'
                        >
                            <img alt='' :src='scope.row.img' />
                        </div>
                        <span v-else>
                            暂无缩略图
                        </span>
                    </template>
                </el-table-column>
                <el-table-column
                    align='center'
                    label='发布版本'
                    prop='release_version'
                />
                <el-table-column
                    align='center'
                    label='发布描述'
                    prop='release_description'
                />
                <el-table-column
                    label='创建时间'
                    prop='create_date'
                    width='160'
                />
                <el-table-column
                    align='center'
                    label='操作人'
                    prop='creater'
                    width='100'
                />
                <el-table-column
                    align='center'
                    fixed='right'
                    label='操作'
                    width='200'
                >
                    <template #default='scope'>
                        <el-button
                            size='small'
                            type='text'
                            @click='rollback(scope.row.id)'
                        >
                            回滚到此版本
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <el-dialog v-model='showBigImg' title='查看全图' width='500px'>
            <div>
                <img alt='' :src='showImgUrl' width='100%' />
            </div>
            <span slot='footer' class='dialog-footer'>
                <el-button type='primary' @click='showBigImg = false'>
                    关闭
                </el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { getPushPageList, rollBackReleasePage } from '@index/Api/editor'
import { reactive, toRefs, onMounted, getCurrentInstance } from 'vue'
import { getQuery } from '@admin/utils'
import {
    useRouter, useRoute
} from 'vue-router'
const urlParams = getQuery()
export default {
    name: 'PublishList',
    setup (props) {
        const { ctx } = getCurrentInstance()
        const router = useRouter()
        const route = useRoute()
        const state = reactive({
            list: [],
            loading: false,
            showBigImg: false,
            showImgUrl: ''
        })

        const back = () => {
            router.go(-1)
        }
        const getList = () => {
            state.loading = true
            getPushPageList({
                pageCode: route.query.pageCode,
                id: urlParams.id,
                language: urlParams.language
            })
                .then(res => {
                    state.loading = false
                    if (!res.success) {
                        ctx.$message.error(res.message)
                        return
                    }
                    state.list = res.data
                })
                .finally(() => {
                    state.loading = false
                })
        }
        const rollback = (id) => {
            this.$confirm('确认回滚到该版本吗?')
                .then(_ => {
                    rollBackReleasePage({ id: id })
                        .then(res => {
                            state.loading = false
                            if (!res.success) {
                                ctx.$message.error(res.message)
                                return
                            }
                            this.$confirm('回滚成功', {
                                confirmButtonText: '去发布',
                                cancelButtonText: '关闭',
                            })
                                .then(() => {
                                    router.push({ name: 'Editor', query: { page_code: route.query.id } })
                                })
                                .catch(() => {})
                        })
                        .catch(error => {
                            console.log(error)
                        })
                    done()
                })
                .catch(_ => { })
        }

        const showImg = (img) => {
            state.showImgUrl = img
            state.showBigImg = true
        }

        onMounted(() => {
            getList()
        })

        return {
            back,
            getList,
            rollback,
            showImg,
            ...toRefs(state)
        }
    }
}
</script>

<style scoped lang="scss">
.m-pageList {
    height: 100vh;
    padding: 20px;
    overflow-y: auto;
    .header {
        line-height: 50px;
    }
}
.data-list {
    padding: 20px;
    .img {
        display: inline-block;
        height: 100px;
        img {
            width: auto;
            height: 100px;
        }
    }
}
</style>

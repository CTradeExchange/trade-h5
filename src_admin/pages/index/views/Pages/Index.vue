<template>
    <div class='m-pageList'>
        <el-collapse :value="['1']">
            <el-collapse-item class='search' name='1' title='页面列表'>
                <el-form ref='form' inline label-position='left' label-width='60px' :model='searchForm'>
                <!-- <el-form-item label="code">
                        <el-input v-model="searchForm.name"></el-input>
                    </el-form-item>
                    <el-form-item label="标题">
                        <el-input v-model="searchForm.name"></el-input>
                    </el-form-item> -->
                </el-form>
                <el-row>
                    <el-col class='footerBtns' :span='24'>
                        <el-button icon='el-icon-edit' type='success' @click='create'>
                            新建
                        </el-button>
                        <!-- <el-button icon="el-icon-delete">重置</el-button> -->
                        <el-button icon='el-icon-search' :loading='loading' type='primary' @click='getPageList'>
                            查询
                        </el-button>
                    </el-col>
                </el-row>
            </el-collapse-item>
        </el-collapse>
        <div class='data-list'>
            <el-table v-loading='loading' border :data='list' style='width: 100%;'>
                <el-table-column align='center' label='页面编码' prop='page_code'>
                    <template #default='scope'>
                        <el-button v-if="scope.row.page_code.indexOf('http')==0" size='small' type='text'>
                            {{ scope.row.page_code }}
                        </el-button>
                        <el-button v-else size='small' type='text' @click='edit(scope.row)'>
                            {{ scope.row.page_code }}
                        </el-button>
                    </template>
                </el-table-column>
                <el-table-column align='center' label='标题' prop='title' />
                <el-table-column align='center' label='状态' prop='status' width='60' />
                <el-table-column label='创建时间' prop='create_date' width='160' />
                <el-table-column label='更新时间' prop='update_date' width='160' />
                <el-table-column align='center' label='操作人' prop='updater' width='100' />
                <el-table-column align='center' fixed='right' label='操作' width='200'>
                    <template #default='scope'>
                        <el-button size='small' type='text' @click='setting(scope.row)'>
                            编辑
                        </el-button>
                        <el-button v-if="scope.row.page_code.indexOf('http')==0" size='small' type='text' @click='showOtherPage(scope.row.page_code)'>
                            查看
                        </el-button>
                        <el-button v-else size='small' type='text' @click='edit(scope.row)'>
                            设计页面
                        </el-button>
                        <el-button size='small' type='text' @click='viewPublish(scope.row)'>
                            查看发布记录
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- <div class="pagination">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="100"
                :page-sizes="[100, 200, 300, 400]"
                :page-size="100"
                layout="total, sizes, prev, pager, next, jumper"
                :total="400"
            >
            </el-pagination>
        </div> -->
        <el-dialog
            v-model='addForm.show'
            append-to-body
            :close-on-click-modal='false'
            :title="addForm.type == 'add' ? '新建页面' : '编辑页面'"
            width='500px'
            @closed='closed'
        >
            <el-form ref='addFormModal' label-width='80px' :model='addForm.form' :rules='addForm.rules'>
                <el-form-item label='页面类型'>
                    <el-radio-group v-model='addForm.form.pageType' :aa='addForm.form.pageType' :disabled="addForm.type ==='modify'" @change='changeType'>
                        <el-radio label='1'>
                            内部页面
                        </el-radio>
                        <el-radio label='2'>
                            活动页面
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item v-if='addForm.form.pageType == 1' v-model='addForm.form.page_code' :disabled="addForm.type ==='modify'" label='页面编码' prop='page_code'>
                    <el-select v-model='addForm.form.page_code' clearable :disabled="addForm.type ==='modify'" placeholder='请选择' @change='changePage'>
                        <el-option v-for='item in h5PageList' :key='item.name' :label='item.title' :value='item.name' />
                    </el-select>
                </el-form-item>
                <template v-else-if='addForm.form.pageType == 2'>
                    <el-form-item label='页面地址' prop='page_code'>
                        <el-input v-model='addForm.form.page_code' placeholder='请输入' />
                    </el-form-item>
                    <el-form-item label='标题'>
                        <el-input v-model='addForm.form.title' autocomplete='off' placeholder='请输入' />
                    </el-form-item>
                </template>
                <el-form-item label='状态'>
                    <el-radio-group v-model='addForm.form.status'>
                        <el-radio label='1'>
                            启用
                        </el-radio>
                        <el-radio label='0'>
                            禁用
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <div slot='footer' class='dialog-footer'>
                <el-button @click='addForm.show = false'>
                    取 消
                </el-button>
                <el-button :loading='addForm.loading' type='primary' @click='submit'>
                    确 定
                </el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import { pageList, modifyPageConfig } from '@index/Api/editor'
import { deepClone } from '@utils/deepClone'
import { h5PageList } from './h5PageList'
import { useRouter } from 'vue-router'
import { onMounted, reactive, ref, toRefs, getCurrentInstance } from 'vue'
import { getQueryString } from '@admin/utils'

export default {
    beforeRouteEnter (to, from, next) {
        if (getQueryString('page') === 'cats_sett_manage') {
            next({ name: 'Setting' })
        } else if (getQueryString('page') === 'cats_init_manage') {
            next({ name: 'Install' })
        } else if (getQueryString('page') === 'cats_editor_page_manage') {
            next({ name: 'ChannelSetting' })
        } else {
            next()
        }
    },
    name: 'Pages',
    setup (props) {
        const router = useRouter()
        const addFormModal = ref(null)
        const {
            ctx
        } = getCurrentInstance()

        const checkPageCode = (rule, value, callback) => {
            const localData = state.list.find((item) => (item.page_code == value))
            if (state.addForm.type === 'add' && localData) {
                callback(new Error('页面已存在，请重新输入'))
            } else {
                callback()
            }
        }

        const state = reactive({
            list: [],
            h5PageList: [],
            addForm: {
                show: false,
                loading: false,
                form: {
                    pageType: '2',
                    page_code: '',
                    title: '',
                    page_slug: 'act_1',
                    status: '1',
                    type: 'html',
                    content: '[]'
                },
                rules: {
                    page_code: [
                        {
                            required: true,
                            message: '请输入页面标题',
                            trigger: 'blur'
                        },
                        {
                            validator: checkPageCode,
                            trigger: 'blur'
                        }
                    ]
                },
                type: 'add'

            },
            loading: false,
            searchForm: {}
        })

        const changePage = () => {
            const info = state.h5PageList.find(item => (item.name == val))
            if (info) {
                state.addForm.form.title = info.title
            }
        }

        const changeType = (type) => {
            if (type == '1') {
                state.addForm.form.page_slug = 'h5'
            } else if (type == '2') {
                state.addForm.form.page_slug = 'act_1'
            }
        }

        const submit = () => {
            addFormModal.value.validate((valid) => {
                if (!valid) {
                    return
                }
                state.submitLoading = true
                modifyPageConfig(state.addForm.form)
                    .then(res => {
                        state.addForm.loading = false
                        if (!res.success) {
                            ctx.$message.error(res.message)
                        }
                        ctx.$message.success(state.addForm.type == 'add' ? '新建成功' : '编辑成功')
                        getPageList()
                        state.addForm.show = false
                    })
                    .catch(error => {
                        console.log(error)
                        state.addForm.loading = false
                    })
            })
        }
        const closed = () => {
            addFormModal.value.resetFields()
        }
        const create = () => {
            state.addForm.type = 'add'

            state.addForm.form = {
                pageType: '2',
                page_code: '',
                title: '',
                page_slug: 'act_1',
                type: 'html',
                status: '1',
                content: '',
                id: getQueryString('id'),
                language: getQueryString('language'),
            }
            state.addForm.show = true
        }
        const edit = (row) => {
            router.push({
                name: 'Editor',
                query: {
                    page_code: row.page_code,
                    id: row.channel_id,
                    lang: 'zh',
                    title: row.title
                }
            })
        }
        const showOtherPage = (url) => {
            window.open(url)
        }
        const getPageList = () => {
            state.loading = true
            state.list = []
            pageList({
                type: 'html',
                channelId: getQueryString('id'),
                language: getQueryString('language'),
            }).then(res => {
                state.loading = false
                if (res.success) {
                    // 显示下拉列表
                    // h5PageList
                    state.list = res.data
                }
                const nameList = state.list.map(item => (item.page_code))
                state.h5PageList = h5PageList.filter(item => (nameList.indexOf(item.name) < 0))
            })
                .catch(error => {
                    state.loading = false
                    console.log(error)
                })
        }
        const setting = (row) => {
            console.log(row)

            state.addForm.form = deepClone(row)
            const nameList = h5PageList.map(item => (item.name))
            if (nameList.indexOf(row.page_code) >= 0) {
                state.addForm.form.pageType = '1'
                state.h5PageList = h5PageList.filter(item => (item.name == row.page_code))
            } else {
                state.addForm.form.pageType = '2'
            }

            state.addForm.type = 'modify'
            state.addForm.form.id = getQueryString('id')
            state.addForm.form.language = getQueryString('language')
            state.addForm.show = true
        }
        const viewPublish = (row) => {
            router.push({
                name: 'PublishList',
                query: {
                    pageCode: row.page_code,
                    id: row.channel_id,
                    language: getQueryString('language')

                }
            })
        }

        onMounted(() => {
            getPageList()
        })

        return {
            changePage,
            changeType,
            submit,
            closed,
            create,
            edit,
            showOtherPage,
            getPageList,
            setting,
            viewPublish,
            checkPageCode,
            addFormModal,
            ...toRefs(state)
        }
    }

}
</script>

<style lang="scss" scoped>
.m-pageList {
    height: 100vh;
    overflow-y: auto;
    .search {
        :deep(.el-collapse-item__wrap) {
            padding: 0 20px;
        }
    }
    .data-list {
        margin-top: 20px;
        padding: 0 20px;
    }
    .headerBtns {
        margin-bottom: 20px;
    }
    .footerBtns {
        text-align: right;
    }
    .pagination {
        margin-top: 20px;
        padding: 0 20px;
        text-align: right;
    }
}
</style>

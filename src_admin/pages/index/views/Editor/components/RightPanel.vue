<template>
    <div class='right-board'>
        <el-tabs v-model='currentTab' class='center-tabs' @tab-click='handleTabClick'>
            <el-tab-pane label='组件属性' name='field'>
                <el-scrollbar class='right-scrollbar'>
                    <el-form v-if='activated' label-width='90px' size='small'>
                        <el-divider content-position='left'>
                            基础信息
                        </el-divider>
                        <el-form-item label='账户状态'>
                            <el-checkbox-group v-model='activeData.accountType'>
                                <el-checkbox label='G'>
                                    游客
                                </el-checkbox>
                                <el-checkbox label='D'>
                                    模拟
                                </el-checkbox>
                                <el-checkbox label='R_1'>
                                    未入金
                                </el-checkbox>
                                <el-checkbox label='R_2'>
                                    已入金
                                </el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                        <el-form-item label='有效期'>
                            <el-date-picker
                                v-model='activeData.expiryDate'
                                end-placeholder='结束日期'
                                format='YYYY-MM-DD HH:mm:ss'
                                range-separator='至'
                                start-placeholder='开始日期'
                                type='datetimerange'
                                :unlink-panels='true'
                            />
                        </el-form-item>
                        <el-divider v-if='element.formConfig && element.formConfig.length > 0' content-position='left'>
                            组件设置
                        </el-divider>
                        <right-form :active-data='activeData' :element-config='element.formConfig' />
                    </el-form>
                <!-- <a
                        class="document-link"
                        target="_blank"
                        href="documentLink"
                        title="查看组件文档"
                    >
                        <i class="el-icon-link" />
                    </a> -->
                <!-- {{ activeData }} -->
                <!-- {{ elementConfig }} -->
                </el-scrollbar>
            </el-tab-pane>
            <el-tab-pane label='组件扩展' name='extend'>
                <el-scrollbar v-if='activated' class='right-scrollbar' label-width='90px'>
                    <el-form label-width='90px' size='small'>
                        <el-divider content-position='left'>
                            间距设置
                        </el-divider>
                        <div class='m-spaceSetting'>
                            <el-input v-model="activeData.style['margin-top']" class='spaceInput top' placeholder='上间距' />
                            <el-input v-model="activeData.style['margin-right']" class='spaceInput right' placeholder='右间距' />
                            <el-input v-model="activeData.style['margin-bottom']" class='spaceInput bottom' placeholder='下间距' />
                            <el-input v-model="activeData.style['margin-left']" class='spaceInput left' placeholder='左间距' />
                            <div class='margin'>
                                <el-input v-model="activeData.style['padding-top']" class='spaceInput top' placeholder='上填充' />
                                <el-input v-model="activeData.style['padding-right']" class='spaceInput right' placeholder='右填充' />
                                <el-input v-model="activeData.style['padding-bottom']" class='spaceInput bottom' placeholder='下填充' />
                                <el-input v-model="activeData.style['padding-left']" class='spaceInput left' placeholder='左填充' />
                                <div class='padding'>
                                    组件
                                </div>
                            </div>
                        </div>
                        <el-divider content-position='left'>
                            样式设置
                        </el-divider>
                        <File :active-data='activeData.background' :config="{ label:'背景图片' }" @formChange='updateBackground' />
                        <el-divider content-position='left'>
                            位置设置
                            <el-button v-if='!element.hidden' class='delete-btn' icon='el-icon-delete' type='text' @click='deleteElement(activated)'>
                                删除
                            </el-button>
                        </el-divider>
                        <el-form-item label='组件ID'>
                            <el-input :disabled='true' :value='element.id' />
                        </el-form-item>
                        <el-form-item label='绑定组件ID'>
                            <el-select v-model='activeData.linkComp' clearable placeholder='请选择'>
                                <el-option v-for='item in showElementList' :key='item.id' :label='item.id' :value='item.id' />
                            </el-select>
                        </el-form-item>
                        <el-form-item v-if='activeData.linkComp' label='组件对齐'>
                            <el-radio-group v-model='activeData.linkCompPosition'>
                                <el-radio label='top-right'>
                                    右上角
                                </el-radio>
                                <el-radio label='top-left'>
                                    左上角
                                </el-radio>
                                <el-radio label='bottom-left'>
                                    左下角
                                </el-radio>
                                <el-radio label='bottom-right'>
                                    右下角
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                    <el-divider content-position='left'>
                        扩展字段设置
                    </el-divider>
                    <el-form class='extendForm'>
                        <el-row v-for='(item, index) in extend' :key='index' class='row'>
                            <el-col :span='10'>
                                <el-input v-model='item.key'>
                                    <template slot='prepend'>
                                        Key
                                    </template>
                                </el-input>
                            </el-col>
                            <el-col :span='12'>
                                <el-input v-model='item.value'>
                                    <template slot='prepend'>
                                        Value
                                    </template>
                                </el-input>
                            </el-col>
                            <el-col :span='2'>
                                <el-button icon='el-icon-delete' type='danger' @click='deleteExtendRow(index)' />
                            </el-col>
                        </el-row>
                    </el-form>
                    <el-row>
                        <el-col :span='24' style='text-align: center;'>
                            <el-button icon='el-icon-plus' type='text' @click='addExtendRow'>
                                添加
                            </el-button>
                        </el-col>
                    </el-row>
                </el-scrollbar>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
import File from '@index/components/RightForm/File'
import { computed, reactive, toRefs, watch } from 'vue'
import { useStore } from 'vuex'
export default {
    components: {
        File
    },
    props: {
        pageConf: {
            type: Object,
            default () {
                return {}
            }
        }
    },
    setup (props, context) {
        const store = useStore()
        const state = reactive({
            currentTab: 'field',
            extend: [{
                key: '',
                value: ''
            }]
        })

        const activated = computed(() => store.state.editor.activated)

        const showElementList = computed(() => {
            return store.state.editor.elementList.filter(
                item => item.id !== activated.value
            )
        })

        const element = computed(() => {
            const data =
                store.state.editor.elementList.filter(
                    item => item.id === activated.value
                )[0] || {}
            return data
        })

        const activeData = computed(() => {
            return element.value.data || {}
        })

        watch(() => state.extend, (newVal) => {
            const _obj = {}
            newVal.forEach(item => {
                if (item.key) {
                    _obj[item.key] = item.value
                }
            })
            store.commit('editor/UPDATE_FORM_DATA', {
                key: 'extend',
                value: _obj
            })
        }, {
            deep: true // 深度监听的参数
        })

        const updateBackground = (url) => {
            activeData.value.background = url
        }

        const handleTabClick = () => {
            if (state.currentTab === 'extend') {
                const arr = []
                for (const key in activeData.value.extend) {
                    arr.push({
                        key,
                        value: activeData.value.extend[key]
                    })
                }
                if (arr.length > 0) {
                    state.extend = arr
                }
            }
        }

        const deleteExtendRow = (index) => {
            state.extend.splice(index, 1)
        }

        const deleteElement = (id) => {
            store.commit('editor/DELETE_ELEMENT', id)
        }

        const addExtendRow = () => {
            state.extend.push({
                key: '',
                value: ''
            })
        }

        return {
            ...toRefs(state),
            activated,
            element,
            activeData,
            updateBackground,
            showElementList,
            handleTabClick,
            deleteExtendRow,
            deleteElement,
            addExtendRow
        }
    }

}
</script>

<style lang="scss" scoped>
.right-board {
    position: absolute;
    top: 0;
    right: 0;
    width: 480px;
    padding-top: 3px;
    padding-bottom: 40px;
    background-color: #FFF;
    .right-scrollbar {
        height: calc(100vh - 57px);
        ::v-deep .el-form {
            .el-range-editor {
                width: 100%;
            }
        }
    }
    .delete-btn {
        margin-left: 15px;
    }
}
.m-spaceSetting {
    position: relative;
    padding: 50px 20px;
    text-align: center;
    &.position {
        padding: 0;
        .margin {
            border: none;
        }
    }
    .spaceInput {
        position: absolute;
        width: 70px;
    }
    .top {
        top: 5px;
        left: 50%;
        margin-left: -35px;
    }
    .bottom {
        bottom: 5px;
        left: 50%;
        margin-left: -35px;
    }
    .left {
        top: 50%;
        left: 10px;
        margin-top: -17px;
    }
    .right {
        top: 50%;
        right: 10px;
        margin-top: -17px;
    }
    .margin {
        position: relative;
        display: inline-block;
        width: 260px;
        height: 200px;
        border: solid 1px #CCC;
        border-radius: 8px;
        .padding {
            position: relative;
            top: 50%;
            left: 50%;
            width: 70px;
            height: 60px;
            margin-top: -30px;
            margin-left: -35px;
            color: #FFF;
            font-size: 16px;
            line-height: 60px;
            text-align: center;
            background-color: #CCC;
            border-radius: 8px;
        }
    }
}
.extendForm {
    .row {
        margin-bottom: 10px;
    }
}
</style>

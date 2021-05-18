<template>
    <div class='m-setting'>
        <el-row class='setting-header'>
            <el-col class='btns' :span='24'>
                <el-button-group>
                    <el-button
                        icon='el-icon-s-promotion'
                        :loading='submitLoading'
                        type='primary'
                        @click='submit'
                    >
                        保存
                    </el-button>
                    <el-button
                        icon='el-icon-upload'
                        :loading='publishLoading'
                        type='primary'
                        @click='pushPage'
                    >
                        发布
                    </el-button>
                    <el-button
                        :disabled='getLoading'
                        icon='el-icon-refresh'
                        type='primary'
                        @click='getPageConfig'
                    >
                        重置
                    </el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <el-form ref='form' label-width='120px' :model='form'>
            <el-tabs type='border-card'>
                <el-tab-pane class='tab' label='AIP设置'>
                    <el-row class='row'>
                        <el-col :span='12' :xs='24'>
                            <el-form-item label='apiKey'>
                                <el-input
                                    v-model='form.other.apiKey'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='apiId'>
                                <el-input
                                    v-model='form.other.apiId'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='apiUrl'>
                                <el-input
                                    v-model='form.other.apiUrl'
                                    placeholder='请输入'
                                />
                            </el-form-item>

                            <el-form-item label='btKey'>
                                <el-input
                                    v-model='form.other.btKey'
                                    placeholder='请输入'
                                />
                            </el-form-item>

                            <el-form-item label='btUrl'>
                                <el-input
                                    v-model='form.other.btUrl'
                                    placeholder='请输入'
                                />
                            </el-form-item>

                            <el-form-item label='是否更新产品信息'>
                                <el-radio-group v-model='form.other.isInitSymbol'>
                                    <el-radio label='1'>
                                        是
                                    </el-radio>
                                    <el-radio label='0'>
                                        否
                                    </el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane class='tab' label='基础设置'>
                    <el-row class='row'>
                        <el-col :span='12' :xs='24'>
                            <el-form-item label='公司id'>
                                <el-input
                                    v-model='form.companyId'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='账户币种列表'>
                                <el-input
                                    v-model='form.currencyList'
                                    placeholder='请输入'
                                    type='textarea'
                                />
                            </el-form-item>
                            <el-form-item label='游客账户组'>
                                <el-input
                                    v-model='form.customerGroupId'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='玩法'>
                                <div class='play-settings'>
                                    <div class='p-left'>
                                        <el-input
                                            v-model='form.tradeTypeList'
                                            placeholder='请输入'
                                            type='textarea'
                                        />
                                    </div>
                                    <div class='p-right'>
                                        <el-button
                                            icon='el-icon-refresh'
                                            :loading='tradeTypeListLoading'
                                            @click='getTradeTypeList'
                                        >
                                            更新
                                        </el-button>
                                    </div>
                                </div>
                            </el-form-item>

                            <el-form-item label='apiService'>
                                <el-input
                                    v-model='form.apiService'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='quoteService'>
                                <el-input
                                    v-model='form.quoteService'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='msgService'>
                                <el-input
                                    v-model='form.msgService'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='tradeService'>
                                <el-input
                                    v-model='form.tradeService'
                                    placeholder='请输入'
                                />
                            </el-form-item>

                            <el-form-item label='USDCNY_CODE'>
                                <el-input
                                    v-model='form.usdcnyCodeid'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='USDHKD_CODE'>
                                <el-input
                                    v-model='form.usdhkdCodeid'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='GA埋点代码'>
                                <el-input
                                    v-model='form.googleAnalytics'
                                    placeholder='请输入'
                                    :row='5'
                                    type='textarea'
                                />
                            </el-form-item>
                            <el-form-item label='保证金提醒'>
                                <el-input
                                    v-model='form.marginLevel.marginLess'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='保证金警告'>
                                <el-input
                                    v-model='form.marginLevel.marginWarn'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='语言'>
                                <el-select
                                    v-model='form.language'
                                    placeholder='请输入'
                                >
                                    <el-option
                                        label='中文'
                                        value='zh-CN'
                                    />
                                    <el-option
                                        label='英文'
                                        value='EN'
                                    />
                                </el-select>
                            </el-form-item>
                            <File
                                :active-data='form.languageuri'
                                :config="{ label: '语言包地址' }"
                                @formChange='updateBackground'
                            />
                            <el-form-item label='登录保持时间'>
                                <el-input
                                    v-model='form.loginTime'
                                    placeholder='请输入'
                                >
                                    <template slot='append'>
                                        秒
                                    </template>
                                </el-input>
                            </el-form-item>
                            <el-form-item label='web API地址'>
                                <el-input
                                    v-model='form.webApiUri'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='web socket地址'>
                                <el-input
                                    v-model='form.webScoketUri'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='IMS API地址'>
                                <el-input
                                    v-model='form.imsApiUri'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='H5地址'>
                                <el-input
                                    v-model='form.other.h5Address'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='H5预览地址'>
                                <el-input
                                    v-model='form.other.h5PreviewAddress'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='在线客服地址'>
                                <el-input
                                    v-model='form.onlineService'
                                    placeholder='请输入'
                                    :row='5'
                                    type='textarea'
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
                <el-tab-pane class='tab' label='其他设置'>
                    <el-row class='row'>
                        <el-form-item label='ip禁用提示语'>
                            <el-input
                                v-model='form.ipTips'
                                placeholder='请输入'
                                :row='5'
                                type='textarea'
                            />
                        </el-form-item>
                        <el-col :span='12' :xs='24'>
                            <el-form-item label='禁用开户地区'>
                                <div class='tree'>
                                    <el-input
                                        v-model='filterText'
                                        class='input'
                                        clearable
                                        placeholder='输入关键字进行过滤'
                                    />
                                    <el-tree
                                        ref='tree'
                                        :data='treeData'
                                        :filter-node-method='filterNode'
                                        highlight-current
                                        node-key='code'
                                        :props='defaultPropsTree'
                                        show-checkbox
                                    />
                                </div>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </div>
</template>

<script>
import { getPageConfig, modifyPageConfig, pushPage, getCompanyInfo } from '@index/Api/editor'
import File from '@index/components/RightForm/File'
import city from './data/city.json'
import province from './data/province.json'
import { deepClone } from '@utils/deepClone'
const treeData = province.map(province => {
    const children = city.filter(item => (item.province === province.province))
    if (children.length > 0) {
        province.children = children
    }
    return province
})
export default {
    name: 'Setting',
    components: {
        File
    },
    data () {
        return {
            filterText: '',
            form: {
                companyId: '',
                customerGroupId: '',
                googleAnalytics: '',
                languageuri: '',
                ipTips: '',
                h5Address: '',
                webScoketUri: '',
                loginTime: '',
                webApiUri: '',
                imsApiUri: '',
                h5PreviewAddress: '',
                marginLevel: {
                    marginLess: '',
                    marginWarn: ''
                },
                other: {
                    isInitSymbol: ''
                },
                tradeTypeList: '',
                apiService: '',
                quoteService: '',
                msgService: '',
                tradeService: '',
                currencyList: ''
            },
            publishLoading: false,
            treeData: treeData,
            defaultPropsTree: {
                children: 'children',
                label: 'name'
            },
            submitLoading: false,
            getLoading: false,
            pageData: {},
            tradeTypeListLoading: false
        }
    },
    watch: {
        filterText (val) {
            this.$refs.tree.filter(val)
        },
        // 'form.other': {
        //     immediate: true,
        //     deep: true,
        //     handler(newName, oldName) {
        //         this.form.companyId = newName.api_id
        //     }
        // }
    },
    created () {
        this.getPageConfig()
    },
    created () {
        this.getPageConfig()
    },
    methods: {
        getPageConfig () {
            this.getLoading = true
            getPageConfig('SysSetting')
                .then(res => {
                    if (!res.success) {
                        this.$message.error(res.message)
                        return
                    }
                    let content = res.data.content && res.data.other.indexOf('{') === 0 ? JSON.parse(res.data.content) : {}
                    content = Object.prototype.toString.call(content) === '[object Object]' ? content : {}
                    this.$refs.tree.setCheckedKeys(content.disabledProvince || [])
                    const other = res.data.other && res.data.other.indexOf('{') === 0 ? JSON.parse(res.data.other) : {}
                    this.form = Object.assign(this.form, content, { other })

                    try {
                        this.form.tradeTypeList = this.form.tradeTypeList && JSON.stringify(this.form.tradeTypeList)
                        this.form.currencyList = this.form.currencyList && JSON.stringify(this.form.currencyList)
                    } catch (error) {
                        console.error(error)
                    }

                    this.pageData = res.data
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    this.getLoading = false
                })
        },
        filterNode (value, data) {
            if (!value) return true
            return data.name.indexOf(value) !== -1
        },
        submit () {
            return new Promise((resolve, reject) => {
                this.submitLoading = true
                const _other = JSON.stringify(this.form.other)
                console.log(_other)
                const _formData = deepClone(this.form)
                delete _formData.other
                try {
                    _formData.tradeTypeList = JSON.parse(_formData.tradeTypeList)
                    _formData.currencyList = JSON.parse(_formData.currencyList)
                } catch (error) {
                    console.error(error)
                }

                _formData.disabledProvince = this.$refs.tree.getCheckedKeys(true)
                return modifyPageConfig(Object.assign(this.pageData, { content: JSON.stringify(_formData), other: _other }))
                    .then(res => {
                        if (!res.success) {
                            this.$message.error(res.message)
                            resolve(false)
                            return
                        }
                        resolve(true)
                        this.$message({
                            message: '保存成功',
                            type: 'success'
                        })
                        this.getPageConfig()
                    })
                    .catch(error => {
                        resolve(false)
                        console.log(error)
                    })
                    .finally(() => {
                        this.submitLoading = false
                    })
            })
        },
        async pushPage () {
            this.publishLoading = true

            const submitData = await this.submit()
            if (!submitData) {
                return
            }
            pushPage({ pageCode: this.pageData.page_code })

                .then(res => {
                    if (!res.success) {
                        this.$message.error(res.message)
                        return
                    }
                    this.$confirm('发布成功', {
                        confirmButtonText: '确认',
                        cancelButtonText: '关闭',
                    })
                        .then(_ => {
                        })
                        .catch(_ => { })
                })
                .catch(error => {
                    console.log(error)
                })
                .finally(() => {
                    this.publishLoading = false
                })
        },
        updateBackground (url) {
            this.form.languageuri = url
        },
        getTradeTypeList () {
            this.tradeTypeListLoading = true
            getCompanyInfo()
                .then(res => {
                    if (res.success) {
                        this.form.companyId === '' ? this.form.companyId = res.data.companyId : null
                        !this.form.customerGroupId ? this.form.customerGroupId = res.data.customerGroupId : null

                        try {
                            if (this.form.tradeTypeList === '' && Array.isArray(res.data.tradeTypeList)) {
                                this.form.tradeTypeList = JSON.stringify(res.data.tradeTypeList)
                            }
                            if (this.form.currencyList === '' && Array.isArray(res.data.currencyList)) {
                                this.form.currencyList = JSON.stringify(res.data.currencyList)
                            }
                        } catch (error) {
                            console.error(error)
                        }
                    }
                })
                .finally(() => {
                    this.tradeTypeListLoading = false
                })
        }
    }
}
</script>

<style lang="scss">
.m-setting {
    height: calc(100vh);
    .setting-header {
        padding: 20px;
        .btns {
            text-align: right;
        }
    }
    .row {
        padding-bottom: 30px;
    }
    .tab {
        height: calc(100vh - 100px);
          padding-bottom: 100px;
        overflow: auto;
    }
    .tree {
        min-height: 300px;
        .input {
            margin-bottom: 10px;
        }
    }
    .play-settings{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;
        flex-wrap: nowrap;
        .p-left{
            flex: 1;
        }
        .p-right{
            flex: 0 0 60px;
            display: flex;
            flex-direction: row;
            .el-button{
                width: 100%;
                background: #F5F7FA;
                color: #909399;
                border: 1px solid #DCDFE6;
                border-left: none;
            }
        }
    }
}
</style>

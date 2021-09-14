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

                            <el-form-item label='游客账户组'>
                                <el-input
                                    v-model='form.customerGroupId'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <!-- <el-form-item label='玩法'>
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
                            <el-form-item label='账户币种列表'>
                                <el-input
                                    v-model='form.currencyList'
                                    placeholder='请输入'
                                    type='textarea'
                                />
                            </el-form-item> -->
                            <el-form-item label='玩法&玩法币种'>
                                <div v-for='(item) in tradeTypeAssets' :key='item.id' class='tradeType-row'>
                                    <el-card :header='item.name' shadow='always'>
                                        <template v-if="['1','2'].indexOf(item.id)>-1">
                                            <el-form-item label='玩法币种'>
                                                <el-select
                                                    v-model='checkedTradeType[item.id].assets'
                                                    clearable
                                                    placeholder='请选择'
                                                >
                                                    <el-option
                                                        v-for='asset in item.assetsList'
                                                        :key='asset.key'
                                                        :label='`${asset.key} - ${asset.label}`'
                                                        :value='asset.key'
                                                    />
                                                </el-select>
                                            </el-form-item>
                                        </template>
                                        <template v-else>
                                            <el-transfer
                                                v-model='checkedTradeType[item.id].assets'
                                                :data='item.assetsList'
                                                :render-content='renderFunc'
                                                :titles='["可选玩法币种", "已选玩法币种"]'
                                            />
                                        </template>
                                        <el-form-item class='sort-row' label='玩法别名'>
                                            <el-input
                                                v-model.number='checkedTradeType[item.id].alias'
                                                placeholder='请输入'
                                            />
                                        </el-form-item>
                                        <el-form-item class='sort-row' label='排序值(升序)'>
                                            <el-input-number
                                                v-model.number='checkedTradeType[item.id].sort'
                                                controls-position='right'
                                                placeholder='请输入'
                                            />
                                        </el-form-item>
                                        <el-form-item v-if="item.id==='5'" class='sort-row' label='是否当钱包使用'>
                                            <el-checkbox v-model='checkedTradeType[item.id].isWallet'>
                                                是
                                            </el-checkbox>
                                        </el-form-item>
                                    </el-card>
                                </div>
                            </el-form-item>
                            <el-form-item label='信息流 orgid'>
                                <el-input
                                    v-model='form.orgid'
                                    placeholder='请输入'
                                />
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
                            <!-- <el-form-item label='登录保持时间'>
                                <el-input
                                    v-model='form.loginTime'
                                    placeholder='请输入'
                                >
                                    <template slot='append'>
                                        秒
                                    </template>
                                </el-input>
                            </el-form-item> -->
                            <!-- <el-form-item label='时区'>
                                <el-select
                                    v-model='form.utcOffset'
                                    placeholder='请输入'
                                >
                                    <el-option
                                        v-for='(item) in utcOffsetList'
                                        :key='item'
                                        :label='"GMT"+(item < 0 ? item : "+"+item)'
                                        :value='item'
                                    />
                                </el-select>
                            </el-form-item> -->
                            <el-form-item label='默认注册区号'>
                                <el-select
                                    v-model='form.defaultZone'
                                    placeholder='请输入'
                                >
                                    <el-option
                                        v-for='(item) in zoneList'
                                        :key='item.id'
                                        :label='item.name+" ("+item.country_code+")"'
                                        :value='item.name+" ("+item.country_code+")"'
                                    />
                                </el-select>
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
                <el-tab-pane class='tab' label='APP管理'>
                    <el-row class='row'>
                        <el-col :span='12' :xs='24'>
                            <el-form-item label='APP最新版本'>
                                <el-input
                                    v-model='form.appVersion'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-tab-pane>
            </el-tabs>
        </el-form>
    </div>
</template>

<script>
import { getPageConfig, modifyPageConfig, pushPage, queryCountryList, tradeTypeAccountAssets } from '@index/Api/editor'
import File from '@index/components/RightForm/File'
import city from './data/city.json'
import province from './data/province.json'
import { deepClone } from '@utils/deepClone'
import { keyBy, forOwn, isPlainObject, compact } from 'lodash'
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
            selectTradeType: '',
            tradeTypeCurrencyCollect: [],
            // accountCurrencyList: [],
            tradeTypeList: [],
            checkedTradeType: {},
            tradeTypeAssets: [],
            form: {
                tradeTypeCurrencyList: [],
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
                other: {
                    isInitSymbol: ''
                },
                // tradeTypeList: '',
                // tradeTypeList: '',
                apiService: '',
                orgid: '',
                quoteService: '',
                msgService: '',
                tradeService: '',
                utcOffset: '',
                // currencyList: '',
                defaultZone: '',
                appVersion: '1.0.0',
            },
            zoneList: [],
            publishLoading: false,
            treeData: treeData,
            defaultPropsTree: {
                children: 'children',
                label: 'name'
            },
            submitLoading: false,
            getLoading: false,
            pageData: {},
            utcOffsetList: [-12, 13],
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
        this.createTimezoneList()
        this.getPageConfig()
        this.queryCountryList()
        this.getTradeTypeAssets()
    },
    methods: {
        renderFunc (_, option) {
            return <span>{ option.key } - { option.label }</span>
        },
        createTimezoneList () {
            const [min, max] = this.utcOffsetList
            this.utcOffsetList = new Array(max - min).fill(0).map((el, i) => min + i)
            this.form.utcOffset = 0 - (new Date().getTimezoneOffset() / 60)
        },
        // 获取国家区号列表
        queryCountryList () {
            queryCountryList().then(res => {
                if (res.success && res.data?.length) {
                    const list = res.data
                    this.zoneList = list
                }
            })
        },
        getTradeTypeAssets () {
            tradeTypeAccountAssets({}).then(res => {
                const { data, success } = res
                // const tradeTypeAssetsList = []

                if (success && Array.isArray(data)) {
                    this.tradeTypeList = data.map(el => ({ id: el.id, name: el.name }))
                    const tempCheckedTradeType = {}
                    this.tradeTypeList.forEach(el => {
                        tempCheckedTradeType[String(el.id)] = this.checkedTradeType[String(el.id)] || {
                            assets: ['1', '2'].indexOf(String(el.id)) ? '' : [],
                            sort: '',
                            alias: '',
                            isWallet: ''
                        }
                    })
                    this.checkedTradeType = tempCheckedTradeType
                    this.tradeTypeAssets = data.map(item => {
                        let customerGroupAssets = []
                        if (isPlainObject(item.data)) {
                            forOwn(item.data, (value, key) => {
                                if (key === '1' && Array.isArray(value.data)) {
                                    customerGroupAssets = value.data.map(el => ({ key: el.code, label: el.name }))
                                }
                            })
                        }
                        return {
                            id: item.id,
                            name: item.name,
                            assetsList: customerGroupAssets
                        }
                    })
                }
            })
        },
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
                        let tradeTypeCurrencyEumn = {}
                        if (Array.isArray(content?.tradeTypeCurrencyList)) {
                            tradeTypeCurrencyEumn = keyBy(content.tradeTypeCurrencyList, 'id')
                        }
                        const cacheCheckedTradeType = {}
                        // const initTradeTypeAssets = {}
                        // const initSortTradeType = {}
                        if (Array.isArray(content.tradeTypeList)) {
                            content.tradeTypeList.forEach(el => {
                                const { allCurrency, sort, alias, isWallet } = tradeTypeCurrencyEumn[String(el.id)]
                                cacheCheckedTradeType[String(el.id)] = {
                                    assets: ['1', '2'].indexOf(String(el.id)) > -1 ? allCurrency : (typeof (allCurrency) === 'string' ? allCurrency.split(',') : allCurrency),
                                    sort,
                                    isWallet,
                                    alias
                                }
                                // if (['1', '2'].indexOf(String(el.id)) > -1) {
                                //     cacheCheckedTradeType[String(el.id)] = tradeTypeCurrencyEumn[String(el.id)]?.allCurrency ? tradeTypeCurrencyEumn[String(el.id)].allCurrency : ''
                                // } else {
                                //     initTradeTypeAssets[String(el.id)] = tradeTypeCurrencyEumn[String(el.id)]?.allCurrency ? tradeTypeCurrencyEumn[String(el.id)].allCurrency.split(',') : []
                                // }
                                // initSortTradeType[String(el.id)] = isNaN(tradeTypeCurrencyEumn[String(el.id)].sort) ? 0 : Number(tradeTypeCurrencyEumn[String(el.id)].sort)
                            })
                        }
                        // this.checkedTradeTypeAssets = initTradeTypeAssets
                        // this.tradeTypeSort = initSortTradeType

                        this.checkedTradeType = cacheCheckedTradeType
                        this.tradeTypeCurrencyCollect = content.tradeTypeList.map(el => ({ id: el.id, name: el.name, currencyList: tradeTypeCurrencyEumn[String(el.id)]?.allCurrency ? tradeTypeCurrencyEumn[String(el.id)].allCurrency : [] }))
                        // this.accountCurrencyList = this.form.currencyList
                        // this.form.tradeTypeList = this.form.tradeTypeList && JSON.stringify(this.form.tradeTypeList)
                        // this.form.currencyList = this.form.currencyList && JSON.stringify(this.form.currencyList)
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
                // console.log(this.tradeTypeCurrencyCollect)

                this.submitLoading = true
                const _other = JSON.stringify(this.form.other)
                console.log(_other)
                const _formData = deepClone(this.form)
                delete _formData.other
                try {
                    // _formData.tradeTypeList = JSON.parse(_formData.tradeTypeList)
                    // _formData.currencyList = JSON.parse(_formData.currencyList)

                    // console.log('this.checkedTradeTypeAssets-', this.checkedTradeTypeAssets)

                    const tempTradeTypeCurrencyList = this.tradeTypeList.map(el => {
                        const { assets, sort, alias, isWallet } = this.checkedTradeType[String(el.id)]
                        if (['1', '2'].indexOf(String(el.id)) > -1) {
                            return { id: el.id, name: el.name, sort, allCurrency: assets || '', alias, isWallet }
                        } else {
                            return { id: el.id, name: el.name, sort, allCurrency: assets ? compact(assets) : [], alias, isWallet }
                        }
                    })
                    tempTradeTypeCurrencyList.sort(function (a, b) {
                        return a.sort - b.sort
                    })
                    _formData.tradeTypeCurrencyList = tempTradeTypeCurrencyList
                    // console.log('tradeTypeCurrencyList', _formData.tradeTypeCurrencyList)
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
        // getTradeTypeList () {
        //     this.tradeTypeListLoading = true
        //     getCompanyInfo()
        //         .then(res => {
        //             if (res.success) {
        //                 this.form.companyId === '' ? this.form.companyId = res.data.companyId : null
        //                 !this.form.customerGroupId ? this.form.customerGroupId = res.data.customerGroupId : null

        //                 try {
        //
        //                     if (this.form.tradeTypeList === '' && Array.isArray(res.data.tradeTypeList)) {
        //                         // this.form.tradeTypeList = JSON.stringify(res.data.tradeTypeList)
        //                         this.form.tradeTypeList = res.data.currencyList
        //                     }
        //                     if (this.form.currencyList === '' && Array.isArray(res.data.currencyList)) {
        //                         this.form.currencyList = JSON.stringify(res.data.currencyList)
        //                         // this.form.currencyList = res.data.currencyList
        //                     }
        //                 } catch (error) {
        //                     console.error(error)
        //                 }
        //             }
        //         })
        //         .finally(() => {
        //             this.tradeTypeListLoading = false
        //         })
        // }
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
    .play-settings {
        display: flex;
        flex-direction: row;
        flex-wrap: nowrap;
        justify-content: space-between;
        width: 100%;
        .p-left {
            flex: 1;
        }
        .p-right {
            display: flex;
            flex: 0 0 60px;
            flex-direction: row;
            .el-button {
                width: 100%;
                color: #909399;
                background: #F5F7FA;
                border: 1px solid #DCDFE6;
                border-left: none;
            }
        }
    }
    .el-transfer-panel {
        .el-transfer-panel__header {
            .el-checkbox {
                .el-checkbox__label {
                    font-size: 14px;
                }
            }
        }
    }
    .tradeType-row {
        margin-bottom: 20px;
    }
    .sort-row {
        margin-top: 10px;
    }
}
</style>

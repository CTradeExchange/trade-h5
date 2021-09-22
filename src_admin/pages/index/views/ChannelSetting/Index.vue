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
        <el-row>
            <el-col class='btns' :span='24'>
                <el-form ref='form' label-width='120px' :model='form'>
                    <el-tabs type='border-card'>
                        <el-tab-pane class='tab' label='渠道基础设置'>
                            <el-form-item label='可注册区号'>
                                <el-select
                                    v-model='form.registrable'
                                    multiple
                                    placeholder='请输入'
                                    value-key='id'
                                    @change='changeSupportArea'
                                >
                                    <el-option
                                        v-for='(item) in zoneList'
                                        :key='item.id'
                                        :label='item.name+" ("+item.country_code+")"'
                                        :value='item'
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item label='默认注册区号'>
                                <el-select
                                    v-model='form.defaultZone'
                                    placeholder='请输入'
                                    value-key='country_code'
                                >
                                    <el-option
                                        v-for='(item) in otherZoneList'
                                        :key='item.id'
                                        :label='item.name+" ("+item.country_code+")"'
                                        :value='item'
                                    />
                                </el-select>
                            </el-form-item>

                            <el-form-item
                                v-for='(item,index) in form.registList'
                                :key='item.id'
                                :label='index === 0 ? "注册客户组" : ""'
                            >
                                <el-row>
                                    <el-col :span='4'>
                                        <el-select
                                            v-model='form.registList[index].registCountry'
                                            clearable
                                            filterable
                                            placeholder='请选择国家'
                                            value-key='id'
                                        >
                                            <el-option
                                                v-for='country in otherZoneList'
                                                :key='country'
                                                :label='country.name'
                                                :value='country'
                                            />
                                        </el-select>
                                    </el-col>
                                    <el-col :span='4'>
                                        <el-select
                                            v-model='form.registList[index].customerGroupId'
                                            clearable
                                            placeholder='请选择客户组'
                                        >
                                            <el-option
                                                v-for='el in accountTradeList'
                                                :key='el.id'
                                                :label='el.name'
                                                :value='el.id'
                                            />
                                        </el-select>
                                    </el-col>
                                    <el-col :span='12'>
                                        <el-button type='primary' @click='setPlans(item,index)'>
                                            设置玩法币种
                                        </el-button>
                                        <el-button v-if='index === 0' type='primary' @click='addFormItem'>
                                            添加
                                        </el-button>
                                        <el-button v-else type='danger' @click='removeItem(index)'>
                                            删除
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>

                            <el-form-item label='游客客户组'>
                                <el-select
                                    v-model='form.customerGroupId'
                                    clearable
                                    placeholder='请选择客户组'
                                >
                                    <el-option
                                        v-for='el in accountTradeList'
                                        :key='el.id'
                                        :label='el.name'
                                        :value='el.id'
                                    />
                                </el-select>
                            </el-form-item>

                            <el-form-item label='H5支持语言'>
                                <el-select
                                    v-model='form.supportLanguage'
                                    multiple
                                    placeholder='请输入'
                                    value-key='val'
                                    @change='changeSupportLanguage'
                                >
                                    <el-option
                                        v-for='item in lang'
                                        :key='item.val'
                                        :label='item.name'
                                        :value='item'
                                    />
                                </el-select>
                            </el-form-item>
                            <el-form-item label='H5默认语言'>
                                <el-select
                                    v-model='form.language'
                                    placeholder='请输入'
                                    value-key='name'
                                >
                                    <el-option
                                        v-for='item in filterLang'
                                        :key='item.val'
                                        :label='item.name'
                                        :value='item'
                                    />
                                </el-select>
                            </el-form-item>

                            <el-form-item label='埋点代码'>
                                <el-input
                                    v-model='form.googleAnalytics'
                                    placeholder='请输入'
                                    :row='5'
                                    type='textarea'
                                />
                            </el-form-item>
                            <el-form-item label='在线客服地址'>
                                <el-input
                                    v-model='form.onlineService'
                                    placeholder='请输入'
                                    type='textarea'
                                />
                            </el-form-item>
                            <!-- <el-form-item label='H5地址'>
                                <el-input
                                    v-model='form.h5Address'
                                    placeholder='请输入'
                                />
                            </el-form-item>
                            <el-form-item label='H5预览地址'>
                                <el-input
                                    v-model='form.h5PreviewAddress'
                                    placeholder='请输入'
                                />
                            </el-form-item> -->
                        </el-tab-pane>
                        <el-tab-pane class='tab pay-channel-setting' label='支付通道图片设置'>
                            <el-row :gutter='20'>
                                <el-col :offset='0' :span='24'>
                                    <el-tabs v-model='activeName' @tab-click='handleClick'>
                                        <el-tab-pane v-for='i in 10' :key='i' :label='"Alipay"+i' :name='i'>
                                            <el-card class='box-card'>
                                                <template #header>
                                                    <div class='card-header'>
                                                        <span class='pay-name'>
                                                            Alipay{{ i }}
                                                        </span>
                                                        <span>通道logo图片配置</span>
                                                    </div>
                                                </template>
                                                <div class='lang-wrap'>
                                                    <el-row :gutter='20'>
                                                        <el-col :offset='0' :span='6'>
                                                            中文简体
                                                        </el-col>
                                                        <el-col :offset='0' :span='6'>
                                                            <el-upload
                                                                action='https://jsonplaceholder.typicode.com/posts/'
                                                                class='upload-demo'
                                                                drag
                                                                multiple
                                                            >
                                                                <i class='el-icon-upload'></i>
                                                                <div class='el-upload__text'>
                                                                    将文件拖到此处，或<em>点击上传</em>
                                                                </div>
                                                            </el-upload>
                                                        </el-col>
                                                    </el-row>
                                                    <el-divider />
                                                    <el-row :gutter='20'>
                                                        <el-col :offset='0' :span='6'>
                                                            中文繁体
                                                        </el-col>
                                                        <el-col :offset='0' :span='6'>
                                                            <el-upload
                                                                action='https://jsonplaceholder.typicode.com/posts/'
                                                                class='upload-demo'
                                                                drag
                                                                multiple
                                                            >
                                                                <i class='el-icon-upload'></i>
                                                                <div class='el-upload__text'>
                                                                    将文件拖到此处，或<em>点击上传</em>
                                                                </div>
                                                            </el-upload>
                                                        </el-col>
                                                    </el-row>
                                                    <el-divider />
                                                    <el-row :gutter='20'>
                                                        <el-col :offset='0' :span='6'>
                                                            英文
                                                        </el-col>
                                                        <el-col :offset='0' :span='6'>
                                                            <el-upload
                                                                action='https://jsonplaceholder.typicode.com/posts/'
                                                                class='upload-demo'
                                                                drag
                                                                multiple
                                                            >
                                                                <i class='el-icon-upload'></i>
                                                                <div class='el-upload__text'>
                                                                    将文件拖到此处，或<em>点击上传</em>
                                                                </div>
                                                            </el-upload>
                                                        </el-col>
                                                    </el-row>
                                                    <el-divider />
                                                </div>
                                            </el-card>
                                        </el-tab-pane>
                                    </el-tabs>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
            </el-col>
        </el-row>
        <el-dialog
            v-model='plansDialogVisible'
            title='玩法&玩法币种'
            width='45%'
        >
            <el-form
                label-position='right'
                label-width='100px'
            >
                <div v-for='item in tradeTypeAssets' :key='item.id' class='tradeType-row'>
                    <el-card :header='item.name' shadow='always'>
                        <template v-if="['1','2'].indexOf(item.id)>-1">
                            <el-form-item label='玩法币种'>
                                <el-select
                                    v-model='checkedTradeType[item.id].allCurrency'
                                    clearable
                                    filterable
                                    placeholder='请选择'
                                >
                                    <el-option
                                        v-for='asset in item.assetsList'
                                        :key='asset.key'
                                        :label='`${asset.label}`'
                                        :value='asset.key'
                                    />
                                </el-select>
                            </el-form-item>
                        </template>
                        <template v-else>
                            <el-transfer
                                v-model='checkedTradeType[item.id].allCurrency'
                                :data='item.assetsList'
                                :render-content='renderFunc'
                                :titles='["可选玩法币种", "已选玩法币种"]'
                            />
                        </template>
                        <el-form-item class='sort-row' label='玩法别名'>
                            <el-input
                                v-model.number='checkedTradeType[item.id].alias'
                                placeholder='请输入'
                                size='medium '
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
            </el-form>
            <template #footer>
                <span class='dialog-footer'>
                    <el-button @click='plansDialogVisible = false'>
                        取 消
                    </el-button>
                    <el-button type='primary' @click='handleSavePlans'>
                        确 定
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { getAccountGroupTradeAssetsList, queryCountryList, getViChannel, saveViChannel } from '@index/Api/editor'
import { lang } from '../../config/lang'
import { getQueryString } from '@admin/utils'
import { keyBy, forOwn, isPlainObject, cloneDeep, compact } from 'lodash'
export default {
    name: 'ChannelSetting',
    data () {
        return {
            form: {
                tradeTypeCurrencyList: [],
                googleAnalytics: '',
                h5Address: '',
                h5PreviewAddress: '',
                defaultZone: '',
                registList: [{}],
                onlineService: '',
                supportLanguage: [],
                customerGroupId: '',
                registrable: [],
            },
            accountTradeList: [],
            lang,
            filterLang: [],
            supportArea: [],
            zoneList: [],
            otherZoneList: [],
            plansDialogVisible: false,
            activeName: 1,
            tradeTypeList: [],
            checkedTradeType: {},
            submitLoading: false,
            pageId: '',
            curIndex: '', // 注册客户组当前操作项
            getLoading: false
        }
    },
    created () {
        this.pageId = getQueryString('id')
        this.queryCountryList()
        this.queryAccountGroupTradeList()
        this.getPageConfig()
    },
    methods: {
        getPageConfig () {
            this.getLoading = true
            const that = this
            getViChannel(this.pageId).then(res => {
                if (!res.success) {
                    that.$message.error(res.message)
                    return
                }

                let content = res.data.content ? JSON.parse(res.data.content) : {}
                content = Object.prototype.toString.call(content) === '[object Object]' ? content : {}
                that.filterLang = content.supportLanguage
                console.log('渠道配置', content)

                const other = res.data.other && res.data.other.indexOf('{') === 0 ? JSON.parse(res.data.other) : {}
                that.form = Object.assign(that.form, content, { other })

                // 如果未保存，写入默认值
                if (!that.form.customerGroupId) {
                    that.form.customerGroupId = '2'
                }

                const defaultLang = this.lang.filter(el => el.isDefault)
                if (that.form.supportLanguage.length === 0) {
                    that.form.supportLanguage = defaultLang
                    that.filterLang = defaultLang
                }
                if (!that.form.language) {
                    that.form.language = defaultLang?.[0]
                }

                if (!that.form.registList[0].customerGroupId) {
                    that.form.registList[0].customerGroupId = '1'
                }
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.getLoading = false
            })
        },
        queryAccountGroupTradeList () {
            getAccountGroupTradeAssetsList().then(res => {
                if (res.success && res.data) {
                    this.accountTradeList = res.data
                }
            })
        },
        changeSupportLanguage (val) {
            this.filterLang = this.lang.filter(el => val.find(zo => zo.val === el.val))
        },
        changeSupportArea (val) {
            this.otherZoneList = this.zoneList.filter(el =>
                val.find(zo => zo.id === el.id)
            )
            // this.otherZoneList = this.zoneList.filter(el => val.includes(el.name + ' (' + el.country_code + ')'))
        },
        // 获取国家区号列表
        queryCountryList () {
            queryCountryList().then(res => {
                if (res.success && res.data?.length) {
                    const list = res.data
                    this.zoneList = list
                    this.otherZoneList = list
                    if (this.form.registrable.length === 0) {
                        this.form.registrable = [list[0]]
                        this.form.defaultZone = list[0]

                        if (!this.form.registList[0].registCountry) {
                            this.form.registList[0].registCountry = this.form.defaultZone
                        }
                    }
                }
            })
        },
        setPlans (item, index) {
            this.curIndex = index

            if (item.registCountry && item.customerGroupId) {
                this.plansDialogVisible = true
                const data = this.accountTradeList[item.customerGroupId]?.data
                this.checkedTradeType = this.form.registList[index]?.plans
                if (this.checkedTradeType) {
                    this.checkedTradeType.forEach(el => {
                        if ([3, 5, 9].includes(Number(el.id))) {
                            el.allCurrency = el.allCurrency.split(',')
                        }
                    })
                }
                this.getTradeTypeAssets(data)
            } else {
                this.$message({
                    message: '请先选择国家和客户组',
                    type: 'warning'
                })
            }
        },
        getTradeTypeAssets (data) {
            if (Array.isArray(data)) {
                this.tradeTypeList = data.map(el => ({ id: el.trade_type, name: el.trade_name }))
                const tempCheckedTradeType = {}

                this.tradeTypeList.forEach(el => {
                    tempCheckedTradeType[String(el.id)] = this.checkedTradeType?.find(item => item.id === el.id) ||
                        {
                            allCurrency: ['1', '2'].indexOf(String(el.id)) > -1 ? '' : [],
                            sort: 0,
                            alias: '',
                            isWallet: '',
                        }
                })

                this.checkedTradeType = tempCheckedTradeType
                this.tradeTypeAssets = data.map(item => {
                    let customerGroupAssets = []
                    if (Array.isArray(item.assets)) {
                        customerGroupAssets = item.assets.map(el => ({ key: el.code, label: el.code + '-' + el.name }))
                    }
                    return {
                        id: item.trade_type,
                        name: item.trade_name,
                        assetsList: customerGroupAssets
                    }
                })
            }
        },
        submit () {
            this.submitLoading = true
            const _formData = cloneDeep(this.form)

            if (_formData.customerGroupId) {
                _formData.tradeTypeCurrencyList = this.accountTradeList[_formData.customerGroupId]?.data.map(el => {
                    return {
                        name: el.trade_name,
                        tradeType: el.trade_type,
                        id: el.trade_type,
                        allCurrency: el.assets.map(el => el.code).toString()
                    }
                })
            }
            saveViChannel({
                content: JSON.stringify(_formData), // '', //
                id: this.pageId,
                other: ''
            }).then(res => {
                if (!res.success) {
                    return this.$message.error(res.message)
                }
                this.$message({
                    message: '保存成功',
                    type: 'success'
                })
                this.getPageConfig()
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.submitLoading = false
            })
        },
        addFormItem () {
            this.otherZoneList = this.zoneList.filter(item => {
                const registIds = this.form.registList.map(el => el.registCountry)
                return registIds.indexOf(item.id) === -1
            })

            this.form.registList.push({})
        },
        removeItem (index) {
            if (index !== 0) {
                this.form.registList.splice(index, 1)
            }
        },
        handleSavePlans () {
            debugger
            let assetFlag = true
            const plans = []

            for (const key in this.checkedTradeType) {
                if (Object.hasOwnProperty.call(this.checkedTradeType, key)) {
                    const el = this.checkedTradeType[key]
                    if (!el.allCurrency) {
                        assetFlag = false
                    }

                    let allCurrency
                    if ([3, 5, 9].includes(Number(key))) {
                        allCurrency = el.allCurrency.toString()
                    } else {
                        allCurrency = el.allCurrency
                    }

                    plans.push({
                        id: key,
                        alias: el.alias,
                        allCurrency,
                        isWallet: el.isWallet,
                        sort: el.sort,
                        tradeType: key,
                        name: this.tradeTypeList.find(a => Number(a.id) === Number(key)).name

                    })
                }
            }

            plans.sort(function (a, b) {
                return a.sort - b.sort
            })

            if (!assetFlag) {
                return this.$message({
                    message: '每个玩法至少选择一个币种',
                    type: 'warning'
                })
            }

            this.form.registList[this.curIndex].plans = plans
            this.checkedTradeType = {}
            this.plansDialogVisible = false
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
    .tradeType-row {
        display: flex;
        align-items: center;
        margin-bottom: 50px;
        .choose-checkbox {
            margin: 0 50px;
        }
        .el-card {
            flex: 1;
            .el-transfer {
                margin-bottom: 20px;
            }
        }
    }
}
</style>

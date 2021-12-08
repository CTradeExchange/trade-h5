<template>
    <div class='m-setting'>
        <el-row class='setting-header'>
            <!-- <el-col :span='12'>
                <div class='toPages'>
                    <i class='el-icon-back'></i>
                    <span @click='toPage'>
                        页面列表
                    </span>
                </div>
            </el-col> -->

            <el-col class='btns' :span='24'>
                <el-button-group>
                    <el-button
                        icon='el-icon-s-promotion'
                        :loading='submitLoading'
                        type='primary'
                        @click='submit'
                    >
                        {{ $t('channelSetting.save') }}
                    </el-button>

                    <el-button
                        :disabled='getLoading'
                        icon='el-icon-refresh'
                        type='primary'
                        @click='getPageConfig'
                    >
                        {{ $t('channelSetting.reset') }}
                    </el-button>
                </el-button-group>
            </el-col>
        </el-row>
        <el-row>
            <el-col class='btns' :span='24'>
                <el-form ref='form' label-width='110px' :model='form' :rules='rules'>
                    <el-tabs v-model='optionName' type='border-card'>
                        <el-tab-pane class='tab' :label="$t('channelSetting.basicSetting')" name='first'>
                            <el-form-item
                                :label="$t('channelSetting.registerableCode')"
                                prop='registrable'
                                :rules = "[
                                    {
                                        required: true,
                                        message: $t('channelSetting.error4'),
                                        trigger: 'blur',
                                    }
                                ]"
                            >
                                <el-select
                                    v-model='form.registrable'
                                    multiple
                                    :placeholder="$t('pleaseEnter')"
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
                                <el-popover
                                    :content="$t('channelSetting.tip1')"
                                    placement='top-start'
                                    trigger='hover'
                                    :width='200'
                                >
                                    <template #reference>
                                        <img alt='' class='img-tip' src='../../../../imgs/tip.png' />
                                    </template>
                                </el-popover>
                            </el-form-item>
                            <el-form-item
                                :label="$t('channelSetting.defaultAreaCode')"
                                prop='defaultZone'
                                :rules = "[
                                    {
                                        required: true,
                                        message: $t('channelSetting.error5'),
                                        trigger: 'blur',
                                    }
                                ]"
                            >
                                <el-select
                                    v-model='form.defaultZone'
                                    :placeholder="$t('pleaseEnter')"
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
                                :label='index === 0 ? $t("channelSetting.countryRegistration") : ""'
                                prop='registList'
                                :rules="[
                                    {
                                        required: true,
                                        message: $t('channelSetting.error3'),
                                        trigger: 'blur',
                                    }
                                ]"
                            >
                                <el-row>
                                    <el-col :span='6'>
                                        <el-select
                                            v-model='form.registList[index].registCountry'
                                            clearable
                                            :disabled='form.registList[index].registCountry?.isOther'
                                            filterable
                                            :placeholder="$t('channelSetting.selectCountry')"
                                            value-key='id'
                                            @focus='countryChange'
                                        >
                                            <el-option
                                                v-for='country in registZoneList'
                                                :key='country'
                                                :disabled='country.disabled'
                                                :label='country.name'
                                                :value='country'
                                            />
                                        </el-select>
                                    </el-col>
                                    <el-col :span='7'>
                                        <label class='label' for=''>
                                            {{$t('channelSetting.customerGroup')}}
                                        </label>
                                        <el-select
                                            v-model='form.registList[index].customerGroupId'
                                            clearable
                                            :placeholder="$t('channelSetting.selectCustomerGroup')"
                                            @change='customerChange(index)'
                                        >
                                            <el-option
                                                v-for='el in accountTradeList'
                                                :key='el.id'
                                                :disabled='el.disabled'
                                                :label='el.name'
                                                :value='el.id'
                                            />
                                        </el-select>
                                        <el-popover
                                            :content="$t('channelSetting.content1')"
                                            placement='top-start'
                                            trigger='hover'
                                            :width='200'
                                        >
                                            <template #reference>
                                                <img alt='' class='img-tip' src='../../../../imgs/tip.png' />
                                            </template>
                                        </el-popover>
                                    </el-col>
                                    <el-col :span='6'>
                                        <el-button :disabled='form.registList[index].disabledSetCurrency' type='primary' @click='setPlans(item,index,1)'>
                                            {{$t('channelSetting.setCurrency')}}
                                        </el-button>
                                        <el-button v-if='index === 0' type='primary' @click='addFormItem'>
                                            {{$t('channelSetting.add')}}
                                        </el-button>
                                        <el-button v-else type='danger' @click='removeItem(index)'>
                                            {{$t('editor.delete')}}
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item>

                            <el-form-item :label="$t('channelSetting.spotAsWallet')">
                                <el-checkbox v-model='form.isWallet' class='checkBox' :indeterminate='false' label='' />
                                <el-popover
                                    :content="$t('channelSetting.content2')"
                                    placement='top-start'
                                    trigger='hover'
                                    :width='200'
                                >
                                    <template #reference>
                                        <img alt='' class='img-tip' src='../../../../imgs/tip.png' />
                                    </template>
                                </el-popover>
                            </el-form-item>

                            <!-- <el-form-item label='游客客户组'>
                                <el-row>
                                    <el-col :span='6'>
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
                                    </el-col>
                                    <el-col :span='8'>
                                        <el-button type='primary' @click='setPlans(item,index,2)'>
                                            设置玩法别名
                                        </el-button>
                                    </el-col>
                                </el-row>
                            </el-form-item> -->

                            <el-form-item :label="$t('channelSetting.h5SupportLang')" :rules="[
                                    {
                                        required: true,
                                        message: this.$t('channelSetting.error1'),
                                        trigger: 'blur',
                                    },
                                ]" prop='supportLanguage'>
                                <el-select
                                    v-model='form.supportLanguage'
                                    multiple
                                   :placeholder="$t('pleaseEnter')"
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
                            <el-form-item :label="$t('channelSetting.h5DefaultLang')" :rules="[
                                    {
                                        required: true,
                                        message: this.$t('channelSetting.error2'),
                                        trigger: 'blur',
                                    },
                                ]" prop='language'>
                                <el-select
                                    v-model='form.language'
                                    :placeholder="$t('pleaseEnter')"
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

                            <!-- <el-form-item label='开户须知' prop='instructions'>
                                <Tinymce
                                    ref='editor'
                                    v-model:value='form.instructions'
                                    :height='300'
                                    :toolbar="['bold italic underline strikethrough alignleft aligncenter alignright outdent indent  blockquote undo redo removeformat hr', 'fullscreen bullist numlist link table forecolor backcolor fontsizeselect']"
                                    :width='800'
                                />
                            </el-form-item> -->
                            <el-form-item :label="$t('channelSetting.worthMentioning')">
                                <el-checkbox-group v-model='form.thirdLogin'>
                                    <el-checkbox label='google'>
                                        Google
                                    </el-checkbox>
                                    <el-checkbox label='facebook'>
                                        Facebook
                                    </el-checkbox>
                                    <el-checkbox label='twitter'>
                                        Twitter
                                    </el-checkbox>
                                </el-checkbox-group>
                            </el-form-item>
                            <el-form-item :label="$t('channelSetting.themeColor')" prop='themeColor'>
                                <el-color-picker v-model='form.themeColor' :predefine='predefineColors' show-alpha />
                            </el-form-item>
                            <el-form-item :label="$t('channelSetting.buriedPointCode')">
                                <el-input
                                    v-model='form.googleAnalytics'
                                    :placeholder="$t('pleaseEnter')"
                                    row='10'
                                    type='textarea'
                                />
                            </el-form-item>
                            <el-form-item :label="$t('channelSetting.onlineCustomerAddress')">
                                <el-input
                                    v-model='form.onlineService'
                                    :placeholder="$t('pleaseEnter')"
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
                        <el-tab-pane class='tab pay-channel-setting' :label="$t('channelSetting.paymentChannelIconSet')" name='second'>
                            <el-row :gutter='20'>
                                <el-col :offset='0' :span='24'>
                                    <el-tabs v-model='activeName'>
                                        <el-tab-pane v-for='(item,index) in pyamentList' :key='index' :label='item.paymentName'>
                                            <el-card class='box-card'>
                                                <template #header>
                                                    <span class='tip'>
                                                        {{$t('channelSetting.tip2')}}
                                                    </span>
                                                </template>
                                                <div class='lang-wrap'>
                                                    <el-row v-for='(l, i) in lang' :key='i' align='middle' :gutter='20'>
                                                        <el-col :offset='0' :span='2'>
                                                            <h4>{{ l.name }}</h4>
                                                        </el-col>
                                                        <el-col :offset='0' :span='6'>
                                                            <div class='upload' @click='uploadFile(item,l)'>
                                                                <div v-if='form.paymentIconList[item.paymentCode+"_"+item.paymentType+"_"+item.merchantNo][l.val].imgUrl' class='img-wrap'>
                                                                    <img alt='' :src='form.paymentIconList[item.paymentCode+"_"+item.paymentType+"_"+item.merchantNo][l.val].imgUrl' />
                                                                </div>
                                                                <div v-else>
                                                                    <i class='el-icon-plus'></i>
                                                                    <p>{{$t('channelSetting.clickUpload')}}</p>
                                                                </div>
                                                            </div>
                                                        </el-col>
                                                        <el-col :offset='0' :span='14'>
                                                            <el-form-item :label="$t('channelSetting.paymentChannelAlias')">
                                                                <el-input v-model='form.paymentIconList[item.paymentCode+"_"+item.paymentType+"_"+item.merchantNo][l.val].alias' class='alias-input' clearable :placeholder="$t('channelSetting.enterChannelAlias')" />
                                                                <el-button type='primary' @click='resetPayment(item,l)'>
                                                                    {{$t('channelSetting.reset')}}
                                                                </el-button>
                                                            </el-form-item>
                                                        </el-col>
                                                        <el-divider />
                                                    </el-row>
                                                </div>
                                            </el-card>
                                        </el-tab-pane>
                                    </el-tabs>
                                </el-col>
                            </el-row>
                        </el-tab-pane>
                        <el-tab-pane class='tab' :label="$t('channelSetting.interfaceSettings')" name='third'>
                            <amount-set ref='amountSet' />
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
            </el-col>
        </el-row>
        <el-dialog
            v-model='plansDialogVisible'
            :title="$t('channelSetting.tradeType')"
            width='60%'
            @close='closeDialog'
        >
            <el-form
                label-position='right'
                label-width='110px'
            >
                <div v-for='item in tradeTypeAssets' :key='item.id' class='tradeType-row'>
                    <el-card :header='item.name' shadow='always'>
                        <template v-if='setPlansType === 1'>
                            <template v-if="['1','2'].indexOf(item.id)>-1">
                                <el-form-item :label="$t('channelSetting.tradeType')">
                                    <el-select
                                        v-model='checkedTradeType[item.id].allCurrency'
                                        clearable
                                        filterable
                                        :placeholder="$t('pleaseChoose')"
                                    >
                                        <el-option
                                            v-for='asset in item.assetsList'
                                            :key='asset.key'
                                            :label='`${asset.label}`'
                                            :value='asset.key'
                                        />
                                    </el-select>
                                    <p class='notice'>
                                        {{ Number(item.id) === 1 ? $t('channelSetting.tip3'): $t('channelSetting.tip4') }}
                                    </p>
                                </el-form-item>
                                <el-form-item label='' />
                            </template>
                            <template v-else>
                                <el-transfer
                                    v-model='checkedTradeType[item.id].allCurrency'
                                    :data='item.assetsList'
                                    :titles='[$t("channelSetting.optionalCurrency"), $t("channelSetting.selectedCurrency")]'
                                />
                            </template>
                        </template>

                        <!-- <el-form-item class='sort-row' label='玩法别名'>
                            <el-input
                                v-model='checkedTradeType[item.id].alias'
                                placeholder='请输入'
                                size='medium '
                                type='text'
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
                        </el-form-item> -->
                    </el-card>
                </div>
            </el-form>
            <template #footer>
                <span class='dialog-footer'>
                    <el-button @click='plansDialogVisible = false'>
                        {{$t('cancel')}}
                    </el-button>
                    <el-button type='primary' @click='handleSavePlans'>
                         {{$t('sure')}}
                    </el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script>
import { getAccountGroupTradeAssetsList, queryCountryList, getViChannel, saveViChannel, queryPaymentArray } from '@index/Api/editor'
import { lang } from '../../config/lang'
import { getQueryString } from '@admin/utils'
import { cloneDeep } from 'lodash'
import { isEmpty } from '@/utils/util'
import Tinymce from '@index/components/Tinymce'
// components
import amountSet from './components/amount-set.vue'

export default {
    name: 'ChannelSetting',
    components: {
        amountSet,
        Tinymce
    },
    data () {
        return {
            optionName: 'first', // 当前选项卡
            form: {
                tradeTypeCurrencyList: [],
                thirdLogin: [],
                // instructions: 'cvxcvxcv', // 开户须知
                googleAnalytics: '',
                h5Address: '',
                h5PreviewAddress: '',
                defaultZone: {},
                themeColor: '#477fd3',
                registList: [{}],
                onlineService: '',
                supportLanguage: [],
                customerGroupId: '',
                registrable: [],
                isWallet: false,
                paymentIconList: {}, // 支付通道图标列表
            },
            accountTradeList: [],
            lang,
            filterLang: [],
            supportArea: [],
            zoneList: [],
            otherZoneList: [],
            registZoneList: [],
            plansDialogVisible: false,
            activeName: '0',
            tradeTypeList: [],
            checkedTradeType: {},
            tradeTypeAssets: [],
            submitLoading: false,
            pageId: '',
            curIndex: '', // 注册客户组当前操作项
            getLoading: false,
            setPlansType: 1, // 1 注册客户组玩法 2 游客客户组 3 非默认客户组
            pyamentList: [],
            payIcon: {},
            rules: {
                supportLanguage: [
                    {
                        required: true,
                        message: this.$t('channelSetting.error1'),
                        trigger: 'blur',
                    },

                ],
                language: [
                    {
                        required: true,
                        message: '请选择默认语言',
                        trigger: 'blur',
                    }
                ],
                registList: [
                    {
                        required: true,
                        message: '请选择注册国家',
                        trigger: 'blur',
                    }
                ],
                registrable: [
                    {
                        required: true,
                        message: '请选择可注册区号',
                        trigger: 'blur',
                    }
                ],
                defaultZone: [
                    {
                        required: true,
                        message: '请选择默认注册区号',
                        trigger: 'blur',
                    }
                ]

            },
            predefineColors: [
                '#477fd3',
                '#ff8c00',
                '#ffd700',
                '#90ee90',
                '#00ced1',
                '#1e90ff',
                '#c71585',
                'rgba(255, 69, 0, 0.68)',
                'rgb(255, 120, 0)',
                'hsv(51, 100, 98)',
                'hsva(120, 40, 94, 0.5)',
                'hsl(181, 100%, 37%)',
                'hsla(209, 100%, 56%, 0.73)',
                '#c7158577',
            ]

        }
    },
    async created () {
        this.pageId = await getQueryString('id')
        await this.queryCountryList()
        await this.queryAccountGroupTradeList()
        await this.getPageConfig()
        await this.getPaymentArray()
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

                // 设置存款数据
                this.$refs['amountSet'].setData(content)
                // this.$refs['editor'].setContent(content.instructions)
                const other = res.data.other && res.data.other.indexOf('{') === 0 ? JSON.parse(res.data.other) : {}
                that.form = Object.assign(that.form, content, { other })

                if (that.form.googleAnalytics) { that.form.googleAnalytics = window.unzip(that.form.googleAnalytics) }

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

                that.otherZoneList = that.form.registrable
                this.registZoneList = that.otherZoneList.concat(
                    {
                        id: 9999,
                        isOther: true,
                        name: '全部',
                    }
                )
            }).catch(error => {
                console.log(error)
            }).finally(() => {
                this.getLoading = false
            })
        },
        queryAccountGroupTradeList () {
            getAccountGroupTradeAssetsList().then(res => {
                if (res.success && res.data) {
                    Object.values(res.data).forEach(el => {
                        if (Number(el.id) === 2) {
                            el.disabled = true
                        }
                    })
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
            this.registZoneList = this.otherZoneList.concat(
                {
                    id: 9999,
                    isOther: true,
                    name: '全部',
                }
            )
            this.form.defaultZone = ''
            // this.otherZoneList = this.zoneList.filter(el => val.includes(el.name + ' (' + el.country_code + ')'))
        },
        // 获取支付通道
        getPaymentArray () {
            const that = this
            queryPaymentArray().then(res => {
                if (res.success && res.data) {
                    that.pyamentList = res.data
                    if (that.pyamentList.length > 0) {
                        that.pyamentList.forEach(el => {
                            const uniqueKey = el.paymentCode + '_' + el.paymentType + '_' + el.merchantNo
                            if (isEmpty(that.form.paymentIconList[uniqueKey])) {
                                that.form.paymentIconList[uniqueKey] = {}
                                that.lang.forEach(lang => {
                                    that.form.paymentIconList[uniqueKey][lang.val] = {
                                        alias: '',
                                        imgUrl: ''
                                    }
                                })
                            }
                        })
                    }
                }
            })
        },
        // 获取国家区号列表
        queryCountryList () {
            const that = this
            queryCountryList().then(res => {
                if (res.success && res.data?.length) {
                    const list = res.data
                    that.zoneList = list
                    // this.otherZoneList = list
                    if (that.form.registrable.length === 0) {
                        that.form.registrable = [list[0]]
                        this.form.defaultZone = that.form.registrable[0]

                        // 默认第一个是其它
                        if (!that.form.registList[0].registCountry) {
                            that.form.registList[0].registCountry =
                                {
                                    id: 9999,
                                    isOther: true,
                                    name: '全部',
                                }
                        }
                    }
                }
            })
        },
        setPlans (item, index, type) {
            this.setPlansType = type
            this.curIndex = index
            let data = []

            if (type === 1) {
                if (Number(item.customerGroupId) !== 1) {
                    // 只有默认客户组才可以设置币种
                    this.setPlansType = 3
                }
                if (item.registCountry && item.customerGroupId) {
                    this.plansDialogVisible = true
                    data = this.accountTradeList[item.customerGroupId]?.data
                    this.checkedTradeType = this.form.registList[index]?.plans
                    // 遍历选中的玩法币种
                    if (!isEmpty(this.checkedTradeType)) {
                        this.checkedTradeType.forEach(el => {
                            if ([3, 5, 9].includes(Number(el.id)) && typeof el.allCurrency === 'string') {
                                el.allCurrency = el.allCurrency.split(',')
                            }
                        })
                    }

                    this.getTradeTypeAssets(data)
                } else {
                    this.$message({
                        message: this.$t('channelSetting.error6'),
                        type: 'warning'
                    })
                }
            } else {
                if (isEmpty(this.form.customerGroupId)) {
                    return this.$message({
                        message: this.$t('channelSetting.error'),
                        type: 'warning'
                    })
                } else {
                    data = this.accountTradeList[this.form.customerGroupId]?.data
                    this.checkedTradeType = this.form.tradeTypeCurrencyList
                    this.getTradeTypeAssets(data)
                    this.plansDialogVisible = true
                }
            }
        },

        // 已填写的数据回填
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
            try {
                const that = this
                this.$refs['form'].validate((valid) => {
                    if (!valid) {
                        console.log('error submit!!')
                        return false
                    } else {
                        // 表单验证通过
                        that.submitLoading = true
                        const _formData = cloneDeep(this.form)
                        // debugger
                        // const aa = this.$refs['editor'].getContent()
                        // _formData.instructions = aa
                        if (_formData.registList.length > 0) {
                            _formData.registList.forEach(el => {
                                if (isEmpty(el.registCountry)) {
                                    that.$message({
                                        message: this.$t('channelSetting.error3'),
                                        type: 'warning'
                                    })
                                    that.submitLoading = false
                                    throw new Error('no-registCountry')
                                }
                                if (isEmpty(el.customerGroupId)) {
                                    that.$message({
                                        message:  this.$t('channelSetting.error8'),
                                        type: 'warning'
                                    })
                                    that.submitLoading = false
                                    throw new Error('no-customerGroupId')
                                }
                                const hasCurrency = el?.plans && el?.plans.every(el => el.allCurrency)
                                if (!hasCurrency && Number(el.customerGroupId) === 1) {
                                    that.$message({
                                        message: this.$t('channelSetting.error9'),
                                        type: 'warning'
                                    })
                                    that.submitLoading = false
                                    throw new Error('no-plans')
                                } else if (Number(el.customerGroupId) === 1) {
                                    el.plans.forEach(item => {
                                        const allCurrency = Array.isArray(item.allCurrency) ? item.allCurrency.toString() : item.allCurrency
                                        item.allCurrency = allCurrency
                                    })
                                } else {
                                    el.plans.forEach(item => {
                                        const allCurrency = that.accountTradeList[el.customerGroupId].data.find(el => Number(el.trade_type) === Number(item.id)).assets.map(item => item.code).toString()
                                        item.allCurrency = allCurrency
                                        // if ([3, 5, 9].includes(Number(item.id)) && Array.isArray(item.allCurrency)) {
                                        //     item.allCurrency = item.allCurrency.toString()
                                        // }
                                    })
                                }
                            })
                        }

                        // 游客玩法如果没设置则取默认
                        if (that.form.tradeTypeCurrencyList.length === 0) {
                            const plans = []
                            that.accountTradeList[2].data.forEach(el => {
                                plans.push({
                                    id: el.trade_type,
                                    alias: '',
                                    isWallet: '',
                                    sort: 0,
                                    tradeType: el.trade_type,
                                    name: el.trade_name

                                })
                            })
                            _formData.tradeTypeCurrencyList = plans
                        }

                        // 设置存款数据
                        _formData.depositData = this.$refs['amountSet'].getData()

                        // _formData.paymentIconList = {}

                        _formData.googleAnalytics = window.zip(_formData.googleAnalytics)

                        // 获取默认客户组和游客组玩法列表
                        _formData.defaultPlans = {}
                        for (const key in that.accountTradeList) {
                            if (Object.hasOwnProperty.call(that.accountTradeList, key)) {
                                const element = that.accountTradeList[key]
                                if ([1, 2].includes(Number(element.id))) {
                                    _formData.defaultPlans[element.id] = element.data.map(el => {
                                        return {
                                            id: el.trade_type,
                                            tradeType: el.trade_type,
                                            name: el.trade_name
                                        }
                                    })
                                }
                            }
                        }

                        saveViChannel({
                            content: JSON.stringify(_formData), // '{"supportLanguage":[{"name":"中文","val":"zh-CN","isDefault":true}]}', //
                            id: that.pageId,
                            other: '',
                        }).then(res => {
                            if (!res.success) {
                                return this.$message.error(res.message)
                            }
                            that.$message({
                                message: this.$t('channelSetting.success1'),
                                type: 'success'
                            })
                            that.getPageConfig()
                        }).catch(error => {
                            console.log(error)
                        }).finally(() => {
                            that.submitLoading = false
                        })
                    }
                })
            } catch (error) {
                console.log('error', error)
            }
        },
        customerChange (index) {
            this.curIndex = index
            const customerGroupId = this.form.registList[index].customerGroupId

            if (Number(customerGroupId) !== 1) {
                this.form.registList[index].disabledSetCurrency = true
                this.disabledSetCurrency = false
                const plans = []
                this.accountTradeList[customerGroupId].data.forEach(el => {
                    const allCurrency = el.assets.map(el => el.code) || ''
                    plans.push({
                        id: el.trade_type,
                        alias: '',
                        isWallet: '',
                        sort: 0,
                        allCurrency: allCurrency.toString(),
                        tradeType: el.trade_type,
                        name: el.trade_name

                    })
                })
                this.form.registList[index].plans = plans
            } else {
                this.form.registList[index].disabledSetCurrency = false
                // this.form.registList[index].plans = {}
                const plans = []
                this.accountTradeList[customerGroupId].data.forEach(el => {
                    plans.push({
                        id: el.trade_type,
                        alias: '',
                        isWallet: '',
                        sort: 0,
                        allCurrency: [],
                        tradeType: el.trade_type,
                        name: el.trade_name

                    })
                })
                this.form.registList[index].plans = plans
            }
        },
        addFormItem () {
            this.handleCountry()
            this.form.registList.push({ disabledSetCurrency: true })
        },
        countryChange () {
            this.handleCountry()
        },
        // 处理注册国家下拉框数据，不能重复选择国家
        handleCountry () {
            this.registZoneList.map(item => {
                const registIds = this.form.registList.map(el => el.registCountry?.id)
                item.disabled = false
                if (registIds.indexOf(item.id) > -1) {
                    item.disabled = true
                }
            })
        },
        removeItem (index) {
            if (index !== 0) {
                this.form.registList.splice(index, 1)
            }
        },

        handleSavePlans () {
            let assetFlag = true

            const plans = []

            // 非默认客户不设置币种。默认全部币种
            if (Number(this.setPlansType === 3)) {
                const curCustomerGroupId = this.form.registList[this.curIndex].customerGroupId
                if (Number(curCustomerGroupId) !== 1) {
                    this.accountTradeList[curCustomerGroupId].data && this.accountTradeList[curCustomerGroupId].data.forEach(el => {
                        const allCurrency = el.assets.map(item => item.code)
                        if ([3, 5, 9].includes(Number(el.trade_type))) {
                            this.checkedTradeType[el.trade_type].allCurrency = allCurrency
                        } else {
                            this.checkedTradeType[el.trade_type].allCurrency = allCurrency.toString()
                        }
                    })
                }
            }
            for (const key in this.checkedTradeType) {
                if (Object.hasOwnProperty.call(this.checkedTradeType, key)) {
                    const el = this.checkedTradeType[key]
                    if (!el.allCurrency) {
                        assetFlag = false
                    }

                    let allCurrency = el.allCurrency || ''
                    if ([3, 5, 9].includes(Number(key))) {
                        allCurrency = allCurrency.toString()
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

            // 玩法排序
            plans.sort(function (a, b) {
                return a.sort - b.sort
            })

            if (!assetFlag && this.setPlansType === 1) {
                return this.$message({
                    message: this.$t('channelSetting.error10'),
                    type: 'warning'
                })
            }

            if (this.setPlansType === 2) {
                this.form.tradeTypeCurrencyList = plans
            } else {
                this.form.registList[this.curIndex].plans = plans
            }

            this.plansDialogVisible = false
        },
        closeDialog () {
            this.checkedTradeType = {}
            this.tradeTypeAssets = []
            // this.form.tradeTypeCurrencyList = []
        },
        uploadFile (item, lang) {
            try {
                // 调用wp的方法上传图片
                if (window.tb_show) {
                    window.tb_show('', 'media-upload.php?type=image&amp;TB_iframe=true')
                    // 设置callBack
                    window.send_to_editor = (html) => {
                        if (window.tb_remove) {
                            window.tb_remove()
                        }
                        console.log(html)
                        const _div = document.createElement('div')
                        _div.innerHTML = html
                        const imgUrl = _div.querySelector('img').src
                        console.log('imgUrl', imgUrl)
                        const uniqueKey = item.paymentCode + '_' + item.paymentType + '_' + item.merchantNo
                        this.form.paymentIconList[uniqueKey][lang.val].imgUrl = imgUrl
                    }
                } else {
                    console.log('执行WordPress window.tb_show方法显示上传图片功能')
                }
            } catch (error) {
                console.log(error)
            }
        },
        resetPayment (item, lang) {
            const uniqueKey = item.paymentCode + '_' + item.paymentType + '_' + item.merchantNo
            this.form.paymentIconList[uniqueKey][lang.val].alias = ''
            this.form.paymentIconList[uniqueKey][lang.val].imgUrl = ''
        },
        toPage () {
            this.$router.push({
                name: 'Pages',
                query: {
                    id: this.pageId
                }
            })
        }
    }
}
</script>

<style lang="scss" scoped>
.m-setting {
    height: calc(100vh);
        overflow-y: scroll;
    .setting-header {
        padding: 20px;
        .btns {
            text-align: right;
        }
         .toPages{
            line-height: 40px;
            font-size: 14px;
            cursor: pointer;
            span{
                color: #477FD3;
            }
        }
    }
    .row {
        padding-bottom: 30px;
    }
    .checkBox{
        vertical-align: middle;
    }
    .img-tip{
        cursor: pointer;
        width: 18px;
        vertical-align: middle;
        margin-left: 10px;
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
        .notice{
            color: #F00;
        }
    }
    .label {
        margin-right: 5px;
        color: #606266;
    }
    .pay-channel-setting {
        .alias-input {
            width: 70%;
            margin-right: 30px;
        }
        .upload {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            width: 180px;
            height: 180px;
            overflow: hidden;
            text-align: center;
            border: 1px dashed #D9D9D9;
            border-radius: 6px;
            cursor: pointer;
            &:hover {
                border: 1px dashed #477FD3;
            }
            .el-icon-plus {
                display: block;
                font-weight: bold;
                font-size: 14px;
                vertical-align: middle;
            }
            .img-wrap {
                padding: 10px;
                img {

                }
                .tip {
                    line-height: 30px;
                }
            }
        }
    }
    .box-card{
        .tip{
            color: red;
        }
    }
}
</style>

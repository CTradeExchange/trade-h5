import { UDFCompatibleDatafeed } from './datafeeds/udf/lib/udf-compatible-datafeed'
import { portraitOptions, landscapeOptions } from './datafeeds/userConfig/config.js'

// 创建Chart实例
export function createChart (...args) {
    return new Chart(...args)
}

/**
    产品数据结构
    initial = {
        description: '欧元美元' || '123',// 图表左上角名称显示
        symbolId: 1,  //产品id
        digits: '4', //小数点
        buyPrice: '1.23', //买价
        sellPrice: '1.35', //卖价
    }
 */

/**
    图表属性-默认值
    property = {
        chartType: '1', // 图表类型
        showLastPrice: true, // 现价线
        showBuyPrice: false, // 买价线
        showSellPrice: false, // 卖价线
        showPositionPrice: false, // 持仓线
        showSeriesOHLC: false, // 高开低收
        showBarChange: false, // 涨跌幅
        showPriceBox: false, // 价格框
        showSeriesTitle: false // K线标题
    }
 */

/**
    扩展字段-默认值
    extension = {
        theme: 'Light' // 主题
        fullScreen: false // 全屏功能（右上角缩放按钮、横屏监听等）
    }
 */

class Chart {
    constructor ({ containerId, initial, property = {}, indicators = [], extension = {} }, chartReadyCallback = () => {}) {
        // 产品初始值
        this.initial = {
            description: initial.description, // 图表左上角名称显示
            symbolId: initial.symbolId, // 产品id
            digits: initial.digits, // 小数点
            buyPrice: initial.buyPrice || 0, // 买价
            sellPrice: initial.sellPrice || 0, // 卖价
        }
        // 产品id
        this.symbolId = initial.symbolId
        // 图表属性
        this.property = property
        // 扩展
        this.extension = extension
        // 容器id
        this.containerId = containerId
        // 容器节点
        this.elm = document.querySelector(containerId)
        // 容器高度
        this.containerHeight = this.elm.offsetHeight
        // 图表渲染后回调
        this.chartReadyCallback = chartReadyCallback
        // 数据适配器
        this.datafeed = new UDFCompatibleDatafeed('', {
            isControl: true,
            symbolInfo: initial
        })
        // 指标列表
        this.indicators = indicators
        // 已创建指标实体(指标实体id和指标名称的映射关系，用于图表直接删除指标时，及时更新)
        this._indicatorsEntity = []

        // 默认竖屏
        this._orientation = 'portrait'
        // 价格线实例
        this._linesMap = {}
        // 持仓线实例
        this._positionLines = []
        // 事件订阅,通过实例方法subscribe订阅
        this._listener = {
            isLandscape: [], // 是否横屏
            click: [], // 短按
        }
        // 存储图表订阅事件
        this._nativeListener = []

        // 离开图表前必须执行的事件队列
        this._destroyedFns = []

        // 第一次执行
        this._firstInit = true

        this._init()
    }

    _init () {
        this.destroyed()
        const { initial, containerHeight, datafeed, containerId } = this
        if (!containerHeight || !initial) {
            return
        }

        console.group('%c当前产品:⬇', 'color:green')
        console.log(JSON.stringify(initial))
        console.groupEnd()

        // 获取横竖屏配置项
        const options = { ...this._options }

        if (!this._firstInit) {
            // 还原上一次用户操作（例如绘图）
            this.widget.save((data) => (options.saved_data = data))
        }

        // eslint-disable-next-line new-cap
        this.widget = window.tvWidget = new window.TradingView.widget({
            ...options,
            datafeed: datafeed,
            container_id: containerId.slice(1),
            symbol: this.symbolId,
            interval: '1',
            locale: 'zh'
        })

        this.widget.onChartReady(() => {
            this.updateIndicator(this.indicators)
            this.updateProperty(this.property)
            this._addPriceBox()
            this._bindEvent()
            if (this._firstInit && this._orientation === 'portrait' && [90, -90].includes(window.orientation)) {
                // 横屏，但是默认值是竖屏时
                this._setStyle('landscape')
            }
            this._firstInit = false
            // 执行图表创建成功的回调函数
            this.chartReadyCallback()
        })
    }

    get _options () {
        let options = null
        if (this.fullScreen && this._firstInit && this._orientation === 'portrait' && [90, -90].includes(window.orientation)) {
            // 横屏，但是默认值是竖屏时
            options = landscapeOptions()
        } else {
            options = this._orientation === 'portrait' ? portraitOptions() : landscapeOptions()
        }

        ['theme'].forEach(key => {
            if (this.extension[key]) {
                options[key] = this.extension[key]
            }
        })

        // 覆盖图表属性
        Object.assign(options.overrides, this._setProperty(this.property, {}))

        return options
    }

    _bindEvent () {
        this._bindResize()
        this._bindClick()
    }

    // 监听窗口变化
    _bindResize () {
        if (!this.extension.fullScreen) return

        this._addFullScreenBtn()
        const handleResize = debounce(() => {
            // 火狐的orientation延迟超过200ms以上
            if (window.orientation === 0 && this._orientation !== 'portrait') {
                this._toggleFullScreen('portrait')
            } else if ((window.orientation === 90 || window.orientation === -90) && this._orientation !== 'landscape') {
                this._toggleFullScreen('landscape')
            }
        }, 300)
        window.addEventListener('resize', handleResize)
        this._destroyedFns.push(() => {
            window.removeEventListener('resize', handleResize)
        })
    }

    /**
     *  添加点击事件，显示两侧菜单
     *  在图表上点击显示菜单或其他事件与图表有冲突（图表自身已有点击/长按事件，指标/画图实体的交互等）
     *  通过订阅图表多个事件（mouse_down/mouse_up/drawing_event/drawingundo_redo_state_changed）以及延迟触发
     *  维护非图表的自定义点击状态
     */
    _bindClick () {
        const iframeWindow = this.elm.querySelector('iframe').contentWindow
        // 绘图状态
        let isDrawing = false
        // 交互状态 mouseDown => mouseMove => mouseUp
        let touchStatus = ''

        // touchmove
        const handleTouchmove = () => {
            if (touchStatus === 'mouseDown') {
                touchStatus = 'mouseMove'
            }
        }
        iframeWindow.addEventListener('touchmove', handleTouchmove)
        this._destroyedFns.push(() => {
            iframeWindow.removeEventListener('touchmove', handleTouchmove)
        })
        // mouseDown
        const handleMouseDown = () => {
            touchStatus = 'mouseDown'
        }
        // mouseUp
        const handleMouseUp = (e) => {
            setTimeout(() => {
                const oldStatus = touchStatus
                touchStatus = 'mouseUp'
                // 绘图/长按/平移均不触发
                if (isDrawing || oldStatus === 'mouseMove') {
                    return
                }
                this._listener['click'].forEach(f => f())
            }, 0)
        }

        this.widget.subscribe('mouse_down', handleMouseDown)
        this.widget.subscribe('mouse_up', handleMouseUp)

        // 隐藏，显示，移动，移除或单击绘图(hide，show、move、remove、click)
        this.widget.subscribe('drawing_event', (a, type) => {
            switch (type) {
            case 'remove': {
                isDrawing = false
                break
            }
            case 'click': {
                isDrawing = true
                break
            }
            default: {
                isDrawing = false
            }
            }
        })

        // 绘图将添加到图表中
        this.widget.subscribe('drawing', () => {
            isDrawing = true
        })

        // Undo/Redo状态已更改
        this.widget.subscribe('undo_redo_state_changed', () => {
            setTimeout(() => {
                isDrawing = false
            }, 50)
        })
    }

    // 批量创建指标
    _createStudies (info) {
        this.indicators.forEach(e => {
            this.widget.activeChart().createStudy(e.name, ...e.params, {
                precision: info.digits
            })
        })
    }

    // 添加买卖价节点（左上角）
    _addPriceBox () {
        const contentWindow = this.elm.querySelector('iframe').contentWindow
        this.priceBox = appendPriceBoxToIframe(contentWindow, this.initial.sellPrice, this.initial.buyPrice, this.property.showPriceBox)
    }

    togglePriceBox (bool) {
        if (bool) {
            this.priceBox.show()
        } else {
            this.priceBox.hide()
        }
    }

    _addFullScreenBtn () {
        const len = this.initial.sellPrice ? this.initial.sellPrice.length : 10
        appendBtnToIframe({
            el: this.elm.querySelector('iframe'),
            type: 'landscape',
            style: {
                right: 11 * len + 'px'
            }
        }, () => {
            this._toggleFullScreen(this._orientation === 'portrait' ? 'landscape' : 'portrait')
        })
    }

    _toggleFullScreen (type) {
        this._orientation = type
        this._init()
        this._setStyle(type)
    }

    _setStyle (type) {
        this._orientation = type
        if (type === 'landscape') {
            this._setLandscape()
            this._listener['isLandscape'].forEach(f => f(true))
        } else {
            this._setPortrait()
            this._listener['isLandscape'].forEach(f => f(false))
        }
    }

    // 设置横屏
    _setLandscape () {
        const { elm } = this
        let width = window.innerWidth
        let height = window.innerHeight

        if (window.orientation === 90 || window.orientation === -90) {
            [width, height] = [height, width]
        }

        const temp = {
            width: height + 'px',
            height: width + 'px',
            top: (height - width) / 2 + 'px',
            left: -(height - width) / 2 + 'px'
        }

        document.body.scrollTop = 0
        elm.style.width = temp.width
        elm.style.height = temp.height
        elm.style.top = temp.top
        elm.style.left = temp.left
    }

    // 设置竖屏
    _setPortrait () {
        const { elm } = this
        elm.style.width = null
        elm.style.height = null
        elm.style.top = null
        elm.style.left = null
    }

    // 修改现有指标价格精度
    _setPrecisionForStudies (precision) {
        const chart = this.widget.activeChart()
        chart.getAllStudies().forEach(e => {
            chart.getStudyById(e.id)
                .applyOverrides({
                    precision
                })
        })
    }

    // 价格线
    _setLine (config) {
        const { _linesMap, symbolId } = this
        !_linesMap[symbolId] && (_linesMap[symbolId] = {})
        const target = _linesMap[symbolId]

        if (typeof config.showBuyPrice === 'boolean') {
            if (config.showBuyPrice) {
                target.buyPriceLine = target.buyPriceLine || this.widget.activeChart().createOrderLine()
                    .setPrice(this.initial.buyPrice)
                    .setText('')
                    .setLineStyle(0)
                    .setLineColor('#e3525c')
                    .setQuantity(false)
            } else if (target.buyPriceLine) {
                target.buyPriceLine.remove()
                target.buyPriceLine = null
            }
        }
        if (typeof config.showSellPrice === 'boolean') {
            if (config.showSellPrice) {
                target.sellPriceLine = target.sellPriceLine || this.widget.activeChart().createOrderLine()
                    .setPrice(this.initial.sellPrice)
                    .setText('')
                    .setLineStyle(0)
                    .setLineColor('#10b873')
                    .setQuantity(false)
            } else if (target.sellPriceLine) {
                target.sellPriceLine.remove()
                target.sellPriceLine = null
            }
        }
    }

    // 对部分订阅事件进行二次封装
    _resolveFn (type, callback) {
        let fn = callback
        switch (type) {
        case 'study_event': {
            // 默认返回指标实体id改为返回指标名称
            fn = (id, event) => {
                const target = this._indicatorsEntity.find(e => e.id === id)
                callback(target ? target.name : '', event)
            }
            break
        }
        }
        return fn
    }

    // 覆盖图表属性
    _applyOverrides (config) {
        const options = this._setProperty(config, {})
        this.widget.applyOverrides(options)
    }

    _setProperty (property, overrides) {
        Object.keys(property || {}).forEach(key => {
            if (['showSeriesTitle', 'showSeriesOHLC', 'showBarChange'].includes(key)) {
                overrides[`paneProperties.legendProperties.${key}`] = property[key]
            } else if (key === 'showLastPrice') {
                overrides['mainSeriesProperties.showPriceLine'] = property[key]
                overrides['scalesProperties.showSeriesLastValue'] = property[key]
            }
        })
        return overrides
    }

    /** ---------------------------- 分割线 ------------------------------------------------------------------------------------------- */
    /** ---------------------------- 以下是公开方法 ------------------------------------------------------------------------------------ */
    // 切换产品
    setSymbol = info => {
        this.symbolId = info.symbolId
        // 修改产品属性
        this.datafeed.setSymbolInfo(info)

        return new Promise((resolve, reject) => {
            // 修改图表产品
            this.widget.activeChart()
                .setSymbol(this.symbolId + '', () => {
                    this._setPrecisionForStudies(info.digits)
                    this.updateProperty(this.property)
                    resolve(this.symbolId)
                    console.log(`%c切换产品: ${JSON.stringify(info)}`, 'color:green')
                })
        })
    }

    // 切换图表类型
    setChartType = (type) => {
        if (typeof type === 'number') {
            // 0:Bar 1:Candle 2:Line 3:Area ,8:Heikin-Ashi ,9: Hollow Candle 10: Baseline 12 10Hi-Lo
            this.widget.activeChart().setChartType(type)
        }
    }

    // 切换周期
    setResolution = (val) => {
        console.log('setResolution:', val)
        this.widget.activeChart()
            .setResolution(val, () => {
                console.log(`%c切换周期: ${val}`, 'color:green')
            })
    }

    // 更新买/卖价格线
    updateLineData = ({ buyPrice, sellPrice }) => {
        const { _linesMap, symbolId } = this
        const target = _linesMap[symbolId] || {}
        target.buyPriceLine && target.buyPriceLine.setPrice(buyPrice)
        target.sellPriceLine && target.sellPriceLine.setPrice(sellPrice)
        if (this.priceBox) {
            this.priceBox.setSellPrice(sellPrice)
            this.priceBox.setBuyPrice(buyPrice)
        }
    }

    // 更新指标（全量更新/删除）
    updateIndicator = (value) => {
        if (!value) return []
        if (!Array.isArray(value)) {
            value = [value]
        }

        const allStudies = this.widget.activeChart().getAllStudies()
        const temp = {}
        allStudies.forEach(e => {
            temp[e.name] = true
        })

        // 新添加指标
        const addList = value.filter(e => !temp[e.name])
        // 待删除指标
        const removeList = this._indicatorsEntity.filter(item => !value.find(e => e.name === item.name))

        addList.forEach(e => {
            this.widget.activeChart().createStudy(e.name, ...e.params, {
                precision: this.initial.digits
            }).then(id => {
                // 更新指标实体
                this._indicatorsEntity.push({
                    name: e.name,
                    id
                })
            })
        })

        removeList.forEach(e => {
            this.widget.activeChart().removeEntity(e.id)
            // 更新指标实体
            this._indicatorsEntity = this._indicatorsEntity.filter(item => item.id !== e.id)
        })
    }

    // 订阅事件
    subscribe = (eventName, callback) => {
        this._listener[eventName].push(function (...args) {
            try {
                return callback.apply(this, args)
            } catch (error) {
                console.error(error)
            }
        })
    }

    // 图表原生订阅
    nativeSubscribe (type, callback) {
        callback = this._resolveFn(type, callback)
        this._nativeListener[type] = [
            ...(this._nativeListener[type] || []),
            callback
        ]

        this.widget.subscribe(type, callback)
    }

    // 销毁前必须执行的方法
    destroyed = () => {
        while (this._destroyedFns.length) {
            const fn = this._destroyedFns.shift()
            fn()
        }
    }

    // 覆盖图表配置
    updateProperty (config) {
        Object.assign(this.property, config)

        this._applyOverrides(config)
        config.property && this.setChartType(config.property.chartType)
        this._setLine(config)
        if (typeof config.showPositionPrice === 'boolean') {
            !config.showPositionPrice && this.updatePosition()
        }
    }

    // 实时tick
    setTick (price, time) {
        this.datafeed._historyProvider.onTick(price, time)
    }

    // 批量创建持仓线
    updatePosition (positions = []) {
        while (this._positionLines.length) {
            this._positionLines.pop().remove()
        }
        if (!this.property.showPositionPrice) {
            return
        }
        this._positionLines = positions.map(el => {
            const currency = 'USD'
            let text = el.direction === 1 ? '买' : '卖'
            text += ` ${el.volume}` + '手'
            const profitLoss = el.profitLoss * 1
            const n = profitLoss >= 0 ? '+' : ''
            const color = profitLoss < 0 ? 'green' : 'red'
            const entity = this.widget.activeChart().createOrderLine()
                .setPrice(el.openPrice)
                .setText(text)
                .setExtendLeft(false)
                .setLineStyle(0)
                .setQuantity(n + profitLoss.toFixed(2) + ' ' + currency)
                .setQuantityBackgroundColor(color)
                .setBodyBorderColor(color)
                .setLineColor(color)
                .setQuantityBorderColor(color)
                .setLineLength(55)
            return entity
        })
    }
}

function appendBtnToIframe ({ el, type, fillColor = '#ccc', style = {} }, callback) {
    const landscape = type === 'landscape'
    const div = document.createElement('div')
    div.classList.add('fullScreenBtn')
    if (landscape) {
        // 横屏
        div.innerHTML = getIconHtml({ fillColor }, 'landscape')
    } else {
        div.innerHTML = getIconHtml({ fillColor })
    }
    div.addEventListener('click', callback)

    div.style.right = style.right
    el.contentWindow.document.body.appendChild(div)
}

function getIconHtml ({ fillColor }, type) {
    if (type === 'landscape') {
        return `<svg t="1621511438709" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="10429"><path d="M625.777778 568.888889h341.333333c34.133333 0 56.888889 22.755556 56.888889 56.888889s-22.755556 56.888889-56.888889 56.888889h-199.111111l238.933333 238.933333c22.755556 22.755556 22.755556 62.577778 0 85.333333-22.755556 22.755556-62.577778 22.755556-85.333333 0L682.666667 768V967.111111c0 34.133333-22.755556 56.888889-56.888889 56.888889s-56.888889-22.755556-56.888889-56.888889v-341.333333c0-34.133333 22.755556-56.888889 56.888889-56.888889zM56.888889 341.333333h199.111111L17.066667 108.088889C-5.688889 85.333333-5.688889 45.511111 17.066667 22.755556S79.644444 0 102.4 22.755556L341.333333 256V56.888889c0-34.133333 22.755556-56.888889 56.888889-56.888889s56.888889 22.755556 56.888889 56.888889v341.333333c0 34.133333-22.755556 56.888889-56.888889 56.888889H56.888889c-28.444444 0-56.888889-22.755556-56.888889-56.888889s28.444444-56.888889 56.888889-56.888889z" fill="${fillColor}" p-id="10430"></path></svg>`
    }

    return `<svg t="1621511137390" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="9915" data-spm-anchor-id="a313x.7781069.0.i9"><path d="M967.111111 1024h-342.869333a56.888889 56.888889 0 0 1-56.888889-56.888889v-0.455111a56.888889 56.888889 0 0 1 56.888889-56.888889h197.916444l-236.088889-236.088889a61.952 61.952 0 0 1 87.608889-87.608889l236.088889 236.088889v-197.916444a56.888889 56.888889 0 0 1 56.888889-56.888889H967.111111a56.888889 56.888889 0 0 1 56.888889 56.888889V967.111111a56.888889 56.888889 0 0 1-56.888889 56.888889zM398.222222 113.777778H201.045333l235.178667 235.178666a61.724444 61.724444 0 1 1-87.267556 87.267556L113.777778 201.045333V398.222222a56.888889 56.888889 0 0 1-113.777778 0V56.888889a56.888889 56.888889 0 0 1 56.888889-56.888889h341.333333a56.888889 56.888889 0 0 1 0 113.777778z" fill="${fillColor}" p-id="9916"></path></svg>`
}

function appendPriceBoxToIframe (iframeWindow, sellPrice, buyPrice, isShow) {
    const elm = iframeWindow.document.querySelector('.noWrap-ODIQgNap')
    const div = document.createElement('div')
    div.classList.add('price-box')
    !isShow && div.classList.add('hide')
    div.innerHTML = `<div class='block sell'>
                        <span class='num'>
                            ${sellPrice}
                        </span>
                        <span class='text'>
                            sell
                        </span>
                    </div>
                    <div class='block buy'>
                        <span class='num'>
                            ${buyPrice}
                        </span>
                        <span class='text'>
                            buy
                        </span>
                    </div>`
    const sellElm = div.querySelector('.sell .num')
    const buyElm = div.querySelector('.buy .num')
    elm.appendChild(div)

    let oldSellPrice = 0
    const setSellPrice = price => {
        if (Number(oldSellPrice) < Number(price)) {
            div.classList.add('rise')
            div.classList.remove('fall')
        } else {
            div.classList.add('fall')
            div.classList.remove('rise')
        }
        sellElm.innerText = price
        oldSellPrice = price
    }
    const setBuyPrice = price => { buyElm.innerText = price }

    const show = () => {
        div.classList.remove('hide')
    }
    const hide = () => {
        div.classList.add('hide')
    }

    return {
        setSellPrice,
        setBuyPrice,
        show,
        hide
    }
}

/**
 * @desc 函数防抖
 * @param func 函数
 * @param wait 延迟执行毫秒数
 * @param immediate true 表立即执行，false 表非立即执行
 */
function debounce (func, wait = 200, immediate = false) {
    let timer
    return function (...rest) {
        if (timer) clearTimeout(timer)
        if (immediate) {
            const callNow = !timer
            timer = setTimeout(() => {
                timer = null
            }, wait)
            if (callNow) func.apply(this, rest)
        } else {
            timer = setTimeout(() => {
                func.apply(this, rest)
            }, wait)
        }
    }
}

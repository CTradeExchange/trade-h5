import { resolutionToKlineType } from '../../userConfig/config.js'
import {  RequestKData }from '../../userConfig/requestKData'
import dayjs from 'dayjs'
class HistoryProvider {
     constructor(datafeedUrl, requester) {
        // this._datafeedUrl = datafeedUrl;
        // this._requester = requester;
        this._requestKData = new RequestKData()
        this._onTick = null
        this.resolveQueue = []
    }
    // 获取历史k线
    getBars (symbolInfo, resolution, periodParams) {
        const { countBack, firstDataRequest, from, to } = periodParams

        this.symbolParams = {
            symbolId: symbolInfo.symbolId,
            klineType: resolutionToKlineType[resolution],
            startTime: from,
            endTime: to,
            resolution,
            tradeType: symbolInfo.tradeType,
            countBack: countBack
        }

        if(typeof firstDataRequest === 'boolean'){
            return this._requestKData.getKline(this.symbolParams, firstDataRequest)
        }
    }
    // 实时更新k线
    async onTick(price, time){
        if(!this._onTick) return
        const ticks = await this.getTick(price, time) || []
        if(!(ticks.length && this._onTick)) {
            return
        }
        this.resolveQueue.length = []
        // console.log('onTick', ticks.map( t => dayjs(t.time).format('HH:mm:ss')), dayjs(time).format('HH:mm:ss'))
        ticks.forEach(t => this._onTick(t))
    }
    // 用于存储udf获取的tick函数
    setTick(cb){
        this.resolveQueue.forEach(fn => fn([]))
        this.resolveQueue.length = 0
        this._onTick = cb
    }
    // 切换周期却不重新调用getBars时（快速切换周期时，图表会缓存最近几个周期的数据）
    setResolution(resolution){
        this.symbolParams.resolution = resolution
        this._requestKData.setProduct({
            klineType: resolutionToKlineType[resolution]
        })
    }

    getTick(price, time)  {
        return new Promise( async(resolve, reject) => {
            this.resolveQueue.push(resolve)
            resolve (await this._requestKData.normalizeTick(price, time, this.symbolParams.resolution))
        })
    }
}

export { HistoryProvider };

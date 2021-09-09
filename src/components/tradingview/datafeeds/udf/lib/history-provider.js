import { resolutionToKlineType } from '../../userConfig/config.js'
import {  RequestKData }from '../../userConfig/requestKData'

class HistoryProvider {
     constructor(datafeedUrl, requester) {
        // this._datafeedUrl = datafeedUrl;
        // this._requester = requester;
        this._requestKData = new RequestKData()
        this._onTick = null
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
        const ticks = await this._requestKData.normalizeTick(price, time, this.symbolParams.resolution) || []
        ticks.forEach(t => this._onTick(t))
    }
    // 用于存储udf获取的tick函数
    setTick(cb){
        this._onTick = cb
    }
}

export { HistoryProvider };

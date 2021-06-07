import { resolutionToKlineType } from '../../userConfig/config.js'
import {  RequestKData }from '../../userConfig/requestKData'

class HistoryProvider {
     constructor(datafeedUrl, requester) {
        this._datafeedUrl = datafeedUrl;
        this._requester = requester;
        this._requestKData = new RequestKData()
    }
    // 获取历史k线
    getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, firstDataRequest) {
        this.symbolParams = {
            symbolId: symbolInfo.symbolId,
            klineType: resolutionToKlineType[resolution],
            startTime: rangeStartDate,
            endTime: rangeEndDate,
            resolution
        }

        if(typeof firstDataRequest === 'boolean'){
            return this._requestKData.getKline(this.symbolParams, firstDataRequest)
        }
    }
    // 实时更新k线
    onTick(price, time){
        if(!this._onTick) return
        const tick = this._requestKData.normalizeTick(price, time, this.symbolParams.resolution)
        this._onTick(tick)
    }
    // 用于存储udf获取的tick函数
    __onTick(){}
}

export { HistoryProvider };

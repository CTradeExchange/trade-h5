import { resolutionToKlineType } from './constant'
import { getKline, getTick }from './getData'

class HistoryProvider {
     constructor(datafeedUrl, requester) {
        this._datafeedUrl = datafeedUrl;
        this._requester = requester;
    }
    getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, firstDataRequest) {
        console.log('firstDataRequest: ', firstDataRequest)
        const params = {
            symbolId: symbolInfo.ticker,
            klineType: resolutionToKlineType[resolution],
            startTime: rangeStartDate,
            endTime: rangeEndDate,
            resolution
        }

        if(typeof firstDataRequest === 'boolean'){
            // 历史k线
            return getKline(params, firstDataRequest)
        } else {
            // 实时tick
            return getTick(params)
        }
    }
}

export { HistoryProvider };

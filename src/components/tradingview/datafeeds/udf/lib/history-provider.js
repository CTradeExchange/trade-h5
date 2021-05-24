import { resolutionToKlineType } from './constant'
import { getKline, setTickRequest, setTicklistener }from './getData'

class HistoryProvider {
     constructor(datafeedUrl, requester) {
        this._datafeedUrl = datafeedUrl;
        this._requester = requester;
    }
    getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, firstDataRequest) {
        // console.log('firstDataRequest: ', firstDataRequest)
        const params = {
            symbolId: symbolInfo.ticker,
            klineType: resolutionToKlineType[resolution],
            startTime: rangeStartDate,
            endTime: rangeEndDate,
            resolution
        }

        setTickRequest(params)

        if(typeof firstDataRequest === 'boolean'){
            // 历史k线
            return getKline(params, firstDataRequest)
        }
    }
    setListenerForTick(onTick){
        setTicklistener(onTick)
    }
}

export { HistoryProvider };

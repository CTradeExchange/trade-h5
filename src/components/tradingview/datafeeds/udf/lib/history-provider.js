import { resolutionToKlineType } from '../../userConfig/config.js'
import { getKline, setTickRequest, setTicklistener }from '../../userConfig/getData'

class HistoryProvider {
     constructor(datafeedUrl, requester) {
        this._datafeedUrl = datafeedUrl;
        this._requester = requester;
    }
    getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, firstDataRequest) {
        // console.log('firstDataRequest: ', firstDataRequest)
        const params = {
            symbolId: symbolInfo.symbolId,
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

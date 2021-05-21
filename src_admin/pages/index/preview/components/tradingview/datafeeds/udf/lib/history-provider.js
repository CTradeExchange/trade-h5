import { resolutionToKlineType } from './constant'
import { getKline, setTickRequest } from './getData'

class HistoryProvider {
    constructor (datafeedUrl, requester) {
        this._datafeedUrl = datafeedUrl
        this._requester = requester
    }

    getBars (symbolInfo, resolution, rangeStartDate, rangeEndDate, firstDataRequest, tickListener) {
        // console.log('firstDataRequest: ', firstDataRequest)
        const params = {
            symbolId: symbolInfo.ticker,
            klineType: resolutionToKlineType[resolution],
            startTime: rangeStartDate,
            endTime: rangeEndDate,
            resolution
        }

        if (tickListener) {
            setTickRequest(params, tickListener)
        }

        if (typeof firstDataRequest === 'boolean') {
            // 历史k线
            return getKline(params, firstDataRequest)
        }
    }
}

export { HistoryProvider }

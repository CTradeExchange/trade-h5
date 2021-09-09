import { __extends } from "tslib";
import { UDFCompatibleDatafeedBase } from './udf-compatible-datafeed-base';
import { QuotesProvider } from './quotes-provider';
import { Requester } from './requester';
var UDFCompatibleDatafeed = /** @class */ (function (_super) {
    __extends(UDFCompatibleDatafeed, _super);
    /**
     *
     *
     * @param {*} datafeedURL
     * @param {*} otherConfig 通过该配置覆盖Datafeed的默认逻辑
     * @param {*} updateFrequency
     * @return {*}
     */
    function UDFCompatibleDatafeed(datafeedURL, otherConfig, updateFrequency) {
        if (updateFrequency === void 0) { updateFrequency = 0.5 * 1000; }
        var _this = this;
        var requester = new Requester();
        var quotesProvider = new QuotesProvider(datafeedURL, requester);
        _this = _super.call(this, datafeedURL, quotesProvider, requester, updateFrequency, otherConfig) || this;
        return _this;
    }
    return UDFCompatibleDatafeed;
}(UDFCompatibleDatafeedBase));
export { UDFCompatibleDatafeed };

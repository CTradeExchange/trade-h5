(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["contract"],{"1edd":function(e,t,c){"use strict";c.r(t);var a=c("f2bf"),n=Object(a["bb"])("data-v-0ec218a8");Object(a["H"])("data-v-0ec218a8");var i={class:"contractWrapper"},r={class:"container"},l={class:"margin-info"},u={class:"left-label header"},b={class:"right-val header"},o={class:"left-label"},s={class:"right-val"},O={class:"margin-info"},j={class:"left-label"},m={class:"right-val"},d={key:0,class:"item-item"},f={key:0,class:"item-item"};Object(a["F"])();var v=n((function(e,t,c,v,p,g){var T=Object(a["M"])("top"),y=Object(a["M"])("van-cell");return Object(a["E"])(),Object(a["i"])("div",i,[Object(a["n"])(T,{"sub-title":v.product.symbolCode,title:v.product.symbolName},null,8,["sub-title","title"]),Object(a["n"])("div",r,[Object(a["n"])(y,{title:e.$t("contract.symbolCode"),value:v.product.symbolCode},null,8,["title","value"]),Object(a["n"])(y,{title:e.$t("contract.contractSize"),value:v.product.contractSize},null,8,["title","value"]),Object(a["n"])(y,{title:e.$t("contract.profitCurrency"),value:v.product.profitCurrency},null,8,["title","value"]),Object(a["n"])(y,{title:e.$t("contract.spread"),value:e.$t("contract.float")},null,8,["title","value"]),Object(a["n"])(y,{title:e.$t("contract.singleNumbers"),value:v.product.minVolume+"-"+v.product.maxVolume},null,8,["title","value"]),Object(a["n"])(y,{title:e.$t("contract.steper"),value:v.product.volumeStep},null,8,["title","value"]),Object(a["n"])(y,{title:e.$t("contract.limitDistance"),value:v.product.priceMinLimit+"/"+v.product.priceMaxLimit+"点"},null,8,["title","value"]),v.usedMarginSet&&v.usedMarginSet.length?(Object(a["E"])(),Object(a["i"])(y,{key:0,title:e.$t("contract.advance")},{default:n((function(){return[Object(a["n"])("div",l,[Object(a["n"])("span",u,Object(a["Q"])(e.$t("contract.volumeRange")),1),Object(a["n"])("span",b,Object(a["Q"])(e.$t("contract.margins")),1)]),(Object(a["E"])(!0),Object(a["i"])(a["a"],null,Object(a["K"])(v.usedMarginSet,(function(t,c){return Object(a["E"])(),Object(a["i"])("div",{key:c,class:"margin-info"},[Object(a["n"])("span",o,Object(a["Q"])(t.rangeLeftVolume)+" < "+Object(a["Q"])(e.$t("contract.volumes"))+" ≤ "+Object(a["Q"])(t.rangeRightVolume),1),Object(a["n"])("span",s,Object(a["Q"])(100*t.percent)+"% ",1)])})),128)),Object(a["n"])("div",O,[Object(a["n"])("span",j,Object(a["Q"])(e.$t("contract.volumes"))+" > "+Object(a["Q"])(v.usedMarginSet[v.usedMarginSet.length-1].rangeRightVolume),1),Object(a["n"])("span",m,Object(a["Q"])(100*v.usedMarginSet[v.usedMarginSet.length-1].percent)+"% ",1)])]})),_:1},8,["title"])):Object(a["j"])("",!0),Object(a["n"])(y,{title:e.$t("contract.feeType"),value:e.$t(1===parseFloat(v.product.feeFormula)?"contract.ratio":"contract.amount")},null,8,["title","value"]),Object(a["n"])(y,{title:e.$t("fee"),value:v.fee},null,8,["title","value"]),Object(a["n"])(y,{title:e.$t("contract.interest"),value:v.interest},null,8,["title","value"]),Object(a["n"])(y,{title:e.$t("contract.zone"),value:"GMT +"+(0-(new Date).getTimezoneOffset()/60)},null,8,["title","value"]),v.quoteTimeList&&v.quoteTimeList.length?(Object(a["E"])(),Object(a["i"])(y,{key:1,class:"timeListCell",title:e.$t("contract.quoteTime")},{default:n((function(){return[(Object(a["E"])(!0),Object(a["i"])(a["a"],null,Object(a["K"])(v.quoteTimeList,(function(t,c){return Object(a["E"])(),Object(a["i"])(a["a"],{key:c},[t.length?(Object(a["E"])(),Object(a["i"])("div",d,[Object(a["m"])(Object(a["Q"])(e.$t("weekdayMap."+t[0].dayOfWeek))+": ",1),Object(a["n"])("template",null,[(Object(a["E"])(!0),Object(a["i"])(a["a"],null,Object(a["K"])(t,(function(e){return Object(a["E"])(),Object(a["i"])("span",{key:e.timeStr,class:"timeItem"},Object(a["Q"])(e.timeStr),1)})),128))])])):Object(a["j"])("",!0)],64)})),128))]})),_:1},8,["title"])):Object(a["j"])("",!0),v.tradeTimeList&&v.tradeTimeList.length?(Object(a["E"])(),Object(a["i"])(y,{key:2,class:"timeListCell",title:e.$t("contract.tradeTime")},{default:n((function(){return[(Object(a["E"])(!0),Object(a["i"])(a["a"],null,Object(a["K"])(v.tradeTimeList,(function(t,c){return Object(a["E"])(),Object(a["i"])(a["a"],{key:c},[t.length?(Object(a["E"])(),Object(a["i"])("div",f,[Object(a["m"])(Object(a["Q"])(e.$t("weekdayMap."+t[0].dayOfWeek))+": ",1),(Object(a["E"])(!0),Object(a["i"])(a["a"],null,Object(a["K"])(t,(function(e){return Object(a["E"])(),Object(a["i"])("span",{key:e.timeStr,class:"timeItem"},Object(a["Q"])(e.timeStr),1)})),128))])):Object(a["j"])("",!0)],64)})),128))]})),_:1},8,["title"])):Object(a["j"])("",!0),v.product.eodTime?(Object(a["E"])(),Object(a["i"])(y,{key:3,title:e.$t("contract.eodTime"),value:v.eodTime},null,8,["title","value"])):Object(a["j"])("",!0),v.expireTime?(Object(a["E"])(),Object(a["i"])(y,{key:4,title:e.$t("contract.expireTime"),value:v.expireTime},null,8,["title","value"])):Object(a["j"])("",!0)])])})),p=(c("d81d"),c("ac1f"),c("5319"),c("5aac")),g=c("5502"),T=c("6c02"),y=c("ca00"),h=c("2f46"),$=c("2ae1"),S=c("47e2"),k=c("d642"),E=(c("cb29"),c("4160"),c("a9e3"),c("b680"),c("159b"),function(e,t){var c=new Array(7).fill("").map((function(){return[]}));return e.forEach((function(e){var a=e.dayOfWeek,n=e.endTime,i=e.startTime,r=c[a-1],l=c[7===a?0:a];if(i+t>1440){var u=Object.assign({},e,{dayOfWeek:7===a?0:a+1,startTime:(i+t-1440).toFixed(0)});l.unshift(u)}else if(n+t>1440){var b=Object.assign({},e,{dayOfWeek:7===a?1:a+1,startTime:0,endTime:(n+t-1440).toFixed(0)});l.unshift(b);var o=Object.assign({},e,{startTime:i+t,endTime:1440});r.push(o)}else{var s=Object.assign({},e,{startTime:i+t,endTime:n+t});r.push(s)}})),c}),L=function(e){e.forEach((function(e){e.forEach((function(e){var t=e.startTime,c=e.endTime,a=Object(h["a"])().utc().startOf("day").add(t,"minute").format("HH:mm"),n=Object(h["a"])().utc().startOf("day").add(c,"minute").format("HH:mm"),i="";i=c===Number(1440)?a+"-24:00":a+"-"+n,e.timeStr=i}))}))},M=c("901e"),Q=c.n(M),q={components:{top:p["a"]},setup:function(){var e=Object(g["c"])(),t=Object(T["e"])(),c=Object(T["d"])(),n=Object(S["b"])({useScope:"global"}),i=n.t,r=parseFloat(sessionStorage.getItem("utcOffset"))||Object(h["a"])().utcOffset(),l=c.query.symbolId,u=Object(a["g"])((function(){return e.state._quote.productMap[l]}));u.value?e.dispatch("_quote/querySymbolInfo",l):t.replace("/");var b=Object(a["g"])((function(){if(!Object(y["m"])(u.value.usedMarginSet)){var e=u.value.contractSize;return Object(y["p"])(u.value.usedMarginSet,"rangeLeft").map((function(t){return t.rangeLeftVolume=Q()(t.rangeLeft).div(e).toNumber(),t.rangeRightVolume=Q()(t.rangeRight).div(e).toNumber(),t}))}})),o=Object(a["g"])((function(){if(!Object(y["m"])(u.value.tradeTimeList)){var e=E(u.value.tradeTimeList,r);return L(e),e}return[]})),s=Object(a["g"])((function(){if(!Object(y["m"])(u.value.quoteTimeList)){var e=E(u.value.quoteTimeList,r);return L(e),e}return[]})),O=Object(a["g"])((function(){return Object(y["m"])(u.value.eodTime)?"":Object(h["a"])().utc().startOf("day").utcOffset(r).add(u.value.eodTime,"minute").format("HH:mm")})),j=Object(a["g"])((function(){return Object(k["i"])(u.value.buyInterest,100)+"%/"+Object(k["i"])(u.value.sellInterest,100)+"%("+i("contract.interestRate")+")"})),m=Object(a["g"])((function(){return 1===parseFloat(u.value.feeFormula)?Object(k["i"])(u.value.feeRate,100)+"%":u.value.fee})),d=Object(a["g"])((function(){return 9999999999999===u.value.endTime?null:Object(h["a"])(u.value.endTime).format("YYYY-MM-DD HH:mm:ss")}));return $["b"].send_subscribe([l]),{product:u,tradeTimeList:o,quoteTimeList:s,eodTime:O,interest:j,fee:m,expireTime:d,usedMarginSet:b}}};c("44ec");q.render=v,q.__scopeId="data-v-0ec218a8";t["default"]=q},"44ec":function(e,t,c){"use strict";c("d3bc")},cb29:function(e,t,c){var a=c("23e7"),n=c("81d5"),i=c("44d2");a({target:"Array",proto:!0},{fill:n}),i("fill")},d3bc:function(e,t,c){}}]);
//# sourceMappingURL=contract.e9295d82.js.map
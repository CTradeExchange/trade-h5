(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["search"],{"4a74":function(t,e,c){},"4e0c":function(t,e,c){"use strict";c("4a74")},a6ff:function(t,e,c){"use strict";c("d313")},d313:function(t,e,c){},f3f3:function(t,e,c){"use strict";c.r(e);var o=c("f2bf"),n=Object(o["ab"])("data-v-2d8632b5");Object(o["G"])("data-v-2d8632b5");var r={class:"searchWrapper"},a={key:0,class:"searchRecord"},u={class:"label"},s={class:"searchBody"};Object(o["E"])();var l=n((function(t,e,c,l,i,d){var b=Object(o["L"])("van-search"),O=Object(o["L"])("ResultItem");return Object(o["D"])(),Object(o["i"])("div",r,[Object(o["m"])(b,{modelValue:t.keywords,"onUpdate:modelValue":[e[2]||(e[2]=function(e){return t.keywords=e}),l.updateVal],background:t.$style.contentColor,placeholder:t.$t("search.placeholder"),"show-action":"",onSearch:l.onSearch},{action:n((function(){return[Object(o["m"])("div",{class:"van-search__action",onClick:e[1]||(e[1]=function(){return l.onCancel&&l.onCancel.apply(l,arguments)})},Object(o["P"])(t.$t("compLang.cancel")),1)]})),_:1},8,["modelValue","background","placeholder","onSearch","onUpdate:modelValue"]),t.keywords?Object(o["j"])("",!0):(Object(o["D"])(),Object(o["i"])("div",a,[Object(o["m"])("div",u,Object(o["P"])(t.$t("search.lastest")),1),(Object(o["D"])(!0),Object(o["i"])(o["a"],null,Object(o["J"])(l.localRecord,(function(t){return Object(o["D"])(),Object(o["i"])(O,{key:t.sourceId,product:t},null,8,["product"])})),128))])),Object(o["m"])("div",s,[(Object(o["D"])(!0),Object(o["i"])(o["a"],null,Object(o["J"])(t.resultList,(function(t){return Object(o["D"])(),Object(o["i"])(O,{key:t.sourceId,product:t},null,8,["product"])})),128))])])})),i=(c("4de4"),c("d81d"),c("5530")),d=Object(o["ab"])("data-v-15a7a827");Object(o["G"])("data-v-15a7a827");var b={class:"searchResultItem"},O={class:"name"},j={class:"block"},f={class:"symbol-code"},p={key:0,class:"optional"};Object(o["E"])();var m=d((function(t,e,c,n,r,a){return Object(o["D"])(),Object(o["i"])("div",b,[Object(o["m"])("div",{class:"product",onClick:e[1]||(e[1]=function(){return n.toProduct&&n.toProduct.apply(n,arguments)})},[Object(o["m"])("div",O,[Object(o["m"])("span",null,Object(o["P"])(c.product.symbolName),1)]),Object(o["m"])("div",j,[Object(o["m"])("span",f,Object(o["P"])(c.product.symbolCode),1)])]),t.$store.state._user.customerInfo?(Object(o["D"])(),Object(o["i"])("div",p,[Object(o["m"])("i",{class:["icon_zixuan1",{icon_zixuan2:n.inSelfSymbolList,loading:t.toggleSelfimg}],onClick:e[2]||(e[2]=Object(o["Z"])((function(t){return n.toggleSelf(c.product,t)}),["stop"]))},null,2)])):Object(o["j"])("",!0)])})),v=(c("7db0"),c("c975"),c("5502")),g=c("6c02"),h=c("ca00"),y={props:["product"],setup:function(t){var e=Object(v["c"])(),c=Object(g["e"])(),n=Object(o["H"])({toggleSelfimg:!1}),r=Object(o["g"])((function(){var c=e.getters.userSelfSymbolList||[];return c.find((function(e){return e.symbolId===t.product.symbolId}))})),a=function(){s()},u=function(){var e=t.product.symbolId,o=JSON.parse(Object(h["n"])("searchProducts"))||[];-1===o.indexOf(e)&&o.push(e),Object(h["o"])("searchProducts",JSON.stringify(o)),c.push({name:"Product",query:{symbolId:e}})},s=function(){n.toggleSelfimg=!0;var c=r.value?"_user/removeCustomerOptionals":"_user/addCustomerOptionals";e.dispatch(c,[t.product.symbolId]).then((function(t){n.toggleSelfimg=!1})).catch((function(t){n.toggleSelfimg=!1}))};return Object(i["a"])(Object(i["a"])({},Object(o["Q"])(n)),{},{inSelfSymbolList:r,toggleSelf:a,toProduct:u,modifyOptional:s})}};c("a6ff");y.render=m,y.__scopeId="data-v-15a7a827";var S=y,k=c("2465"),I={components:{ResultItem:S},setup:function(){var t=Object(v["c"])(),e=Object(o["g"])((function(){return t.state._quote.productMap})),c=Object(o["H"])({keywords:"",localList:JSON.parse(Object(h["n"])("searchProducts"))||[],resultList:[]}),n=Object(o["g"])((function(){return c.localList.map((function(t){return e.value[t]})).filter((function(t){return t}))})),r=function(t){u(t)},a=function(){c.resultList=[]},u=Object(h["c"])((function(o){if(!o)return!1;Object(k["d"])({name:o,customerGroupId:t.getters.customerGroupId}).then((function(t){if(t.check()){var o=t.data||[];o=o.map((function(t){return e.value[t.id]})).filter((function(t){return!!t})),c.resultList=o}}))})),s=function(){history.back()};return Object(i["a"])(Object(i["a"])({},Object(o["Q"])(c)),{},{localRecord:n,updateVal:r,onClear:a,onSearch:u,onCancel:s})}};c("4e0c");I.render=l,I.__scopeId="data-v-2d8632b5";e["default"]=I}}]);
//# sourceMappingURL=search.a617952f.js.map
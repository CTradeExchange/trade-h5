(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["authentication"],{"0169":function(e,t,n){e.exports=n.p+"img/level_1.5fa1b4e0.png"},"0a02":function(e,t,n){e.exports=n.p+"img/level_2.fe31e023.png"},"0a5b":function(e,t,n){},"0ea5":function(e,t,n){e.exports=n.p+"img/logo.98a35781.png"},"0f38":function(e,t,n){"use strict";n.r(t);var c=n("f2bf"),a=Object(c["ab"])("data-v-5d18b21a");Object(c["G"])("data-v-5d18b21a");var o={class:"authConditionWrapper"};Object(c["E"])();var i=a((function(e,t,n,a,i,l){var u=Object(c["L"])("LayoutTop"),r=Object(c["L"])("auth-condition");return Object(c["D"])(),Object(c["i"])("div",o,[Object(c["m"])(u,{back:"",menu:!1}),Object(c["m"])(r,{"business-code":a.businessCode},null,8,["business-code"])])})),l=n("6c02"),u=n("77c0"),r={components:{authCondition:u["a"]},setup:function(e){var t=Object(l["d"])(),n=Object(c["g"])((function(){return t.query.businessCode}));return{businessCode:n}}};n("7d5e");r.render=i,r.__scopeId="data-v-5d18b21a";t["default"]=r},1916:function(e,t,n){"use strict";n.r(t);n("d3b7"),n("25f0");var c=n("f2bf"),a=Object(c["ab"])("data-v-d1384984");Object(c["G"])("data-v-d1384984");var o={class:"page-wrap"},i={key:0,class:"empty-data"},l={key:1},u={class:"title"},r={class:"auth-list"},d={class:"content"},s={class:"t1"},b={class:"t2"},f={key:0},p={class:"notice"},m={key:1},j={class:"btn-text"};Object(c["E"])();var O=a((function(e,t,O,v,h,g){var y=Object(c["L"])("LayoutTop"),C=Object(c["L"])("Loading"),k=Object(c["L"])("van-empty"),R=Object(c["L"])("van-icon"),w=Object(c["L"])("van-button");return Object(c["D"])(),Object(c["i"])(c["a"],null,[Object(c["m"])(y,{back:!0,menu:!1,title:"",onBackEvent:v.back},null,8,["onBackEvent"]),Object(c["m"])("div",o,[Object(c["m"])(C,{show:e.loading},null,8,["show"]),0===e.list.length?(Object(c["D"])(),Object(c["i"])("div",i,[Object(c["m"])(k,{description:e.$t("auth.noRequired"),image:"/images/empty.png"},null,8,["description"])])):(Object(c["D"])(),Object(c["i"])("div",l,[Object(c["m"])("p",u,Object(c["P"])(e.$t("auth.authComplete")),1),Object(c["m"])("div",r,[(Object(c["D"])(!0),Object(c["i"])(c["a"],null,Object(c["J"])(e.list,(function(t,o){return Object(c["D"])(),Object(c["i"])("div",{key:o,class:"auth-item"},[Object(c["m"])("img",{alt:"",class:"auth-img",src:n("fecd")("./"+t.levelCode+".png")},null,8,["src"]),Object(c["m"])("div",d,[Object(c["m"])("p",s,Object(c["P"])(t.levelName),1),Object(c["m"])("p",b,Object(c["P"])(e.$t("auth.authPass"))+" ["+Object(c["P"])(t.businessNameList.toString())+"] ",1)]),t.preLevelObj&&2!==t.preLevelObj.status?(Object(c["D"])(),Object(c["i"])("div",f,[Object(c["m"])("span",p,Object(c["P"])(e.$t("auth.executeAuth",[t.preLevelObj.levelName])),1)])):(Object(c["D"])(),Object(c["i"])("div",m,[Object(c["m"])(w,{plain:"",round:"",size:"small",onClick:function(e){return v.handleNext(t)}},{default:a((function(){return[Object(c["m"])("span",j,Object(c["P"])(t.statusName),1),Object(c["m"])(R,{color:v.style.color,name:"arrow"},null,8,["color"])]})),_:2},1032,["onClick"])]))])})),128))])]))])],64)})),v=(n("4160"),n("a9e3"),n("ac1f"),n("5319"),n("159b"),n("5530")),h=n("6c02"),g=n("c24f"),y=n("5502"),C=n("ca00"),k={setup:function(e,t){t.emit,t.attrs;var n=Object(y["c"])(),a=Object(h["e"])(),o=Object(h["d"])(),i=Object(c["g"])((function(){return n.state.style})),l=Object(c["H"])({list:[],loading:!1}),u=Object(c["g"])((function(){return n.state._user.kycState})),r=function(){l.loading=!0,Object(g["m"])().then((function(e){l.loading=!1,e.check()&&(e.data.forEach((function(t){if(t.preLevelName){var n=Object(C["f"])(e.data,"levelName",t.preLevelName);t.preLevelObj=n}})),l.list=e.data)})).catch((function(e){l.loading=!1}))},d=function(e){0!==Number(e.status)&&3!==Number(e.status)||a.push({path:"/authForm",query:{levelCode:e.levelCode,businessCode:o.query.businessCode}})},s=function(){a.replace("/personal")};return Object(h["c"])((function(e,t){0!==Number(u.value)&&3!==Number(u.value)||"/authForm"===e.path||n.dispatch("_user/logout").then((function(){return a.push("/login")})).then((function(){location.reload()}))})),Object(c["w"])((function(){r()})),Object(v["a"])({kycState:u,handleNext:d,back:s,style:i},Object(c["Q"])(l))}};n("8169");k.render=O,k.__scopeId="data-v-d1384984";t["default"]=k},2224:function(e,t,n){e.exports=n.p+"img/handheld_identity_card.4247a89f.png"},"317c":function(e,t,n){e.exports=n.p+"img/back_identity_card.4d727fda.png"},"55d2":function(e,t,n){e.exports=n.p+"img/front_identity_card.211974a1.png"},"5b80":function(e,t,n){"use strict";n("7a4d")},"6f56":function(e,t,n){var c={"./back_bank_card.png":"c992","./back_identity_card.png":"317c","./front_bank_card.png":"af72","./front_identity_card.png":"55d2","./handheld_identity_card.png":"2224"};function a(e){var t=o(e);return n(t)}function o(e){if(!n.o(c,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return c[e]}a.keys=function(){return Object.keys(c)},a.resolve=o,e.exports=a,a.id="6f56"},"77c0":function(e,t,n){"use strict";var c=n("f2bf"),a=Object(c["ab"])("data-v-610d7bf8");Object(c["G"])("data-v-610d7bf8");var o={class:"page-wrap"},i={class:"conditon-wrap"},l={key:1},u={class:"upload-text"},r={key:2};Object(c["E"])();var d=a((function(e,t,d,s,b,f){var p=Object(c["L"])("Loading"),m=Object(c["L"])("van-field"),j=Object(c["L"])("van-uploader"),O=Object(c["L"])("van-button"),v=Object(c["L"])("van-picker"),h=Object(c["L"])("van-popup");return Object(c["D"])(),Object(c["i"])(c["a"],null,[Object(c["m"])(p,{show:e.loading},null,8,["show"]),Object(c["m"])("div",o,[Object(c["K"])(e.$slots,"notice",{},void 0,!0),Object(c["m"])("div",i,[(Object(c["D"])(!0),Object(c["i"])(c["a"],null,Object(c["J"])(e.elementList,(function(o,i){return Object(c["D"])(),Object(c["i"])("div",{key:i,class:"c-item"},["input"===o.showType?(Object(c["D"])(),Object(c["i"])(m,{key:0,modelValue:e.conditionModel[o.elementCode],"onUpdate:modelValue":function(t){return e.conditionModel[o.elementCode]=t},clearable:"",label:o.elementName,placeholder:e.$t("common.input")+o.elementName,type:"phone"===o.elementCode?"number":"text"},null,8,["modelValue","onUpdate:modelValue","label","placeholder","type"])):Object(c["j"])("",!0),"image"===o.showType?(Object(c["D"])(),Object(c["i"])("div",l,[Object(c["m"])(j,{"after-read":s.afterRead,name:o.elementCode,"result-type":"file"},{default:a((function(){return[Object(c["m"])("img",{id:o.elementCode,alt:"",class:"upload-img",src:n("6f56")("./"+o.elementCode+".png"),srcset:""},null,8,["id","src"]),Object(c["m"])("p",u,Object(c["P"])(o.elementName),1)]})),_:2},1032,["after-read","name"])])):Object(c["j"])("",!0),"inputGroup"===o.showType?(Object(c["D"])(),Object(c["i"])("div",r,[Object(c["m"])(m,{modelValue:e.typeValue,"onUpdate:modelValue":t[1]||(t[1]=function(t){return e.typeValue=t}),clickable:"",label:e.$t("register.certificateType"),placeholder:e.$t("register.chooseCertificateType"),readonly:"",onClick:t[2]||(t[2]=function(t){return e.showPicker=!0})},null,8,["modelValue","label","placeholder"]),Object(c["m"])(m,{modelValue:e.conditionModel[e.typeCode],"onUpdate:modelValue":t[3]||(t[3]=function(t){return e.conditionModel[e.typeCode]=t}),label:e.$t("register.certificateNo"),placeholder:e.$t("register.pleaseEnter")+e.typeValue},null,8,["modelValue","label","placeholder"])])):Object(c["j"])("",!0)])})),128)),Object(c["m"])(O,{class:"confirm-btn",onClick:s.onConfirm},{default:a((function(){return[Object(c["l"])(Object(c["P"])(e.$t("common.submit")),1)]})),_:1},8,["onClick"])])]),Object(c["m"])(h,{show:e.showPicker,"onUpdate:show":t[5]||(t[5]=function(t){return e.showPicker=t}),position:"bottom",round:""},{default:a((function(){return[Object(c["m"])(v,{columns:e.columns,"columns-field-names":s.columnsFields,onCancel:t[4]||(t[4]=function(t){return e.showPicker=!1}),onConfirm:s.handleConfirm},null,8,["columns","columns-field-names","onConfirm"])]})),_:1},8,["show"])],64)})),s=(n("4de4"),n("4160"),n("b0c0"),n("a9e3"),n("4d63"),n("ac1f"),n("25f0"),n("5319"),n("159b"),n("5530")),b=(n("e7e5"),n("d399")),f=n("6c02"),p=n("c24f"),m=n("ca00"),j=n("a417"),O=n("47e2"),v={props:{businessCode:{type:String}},setup:function(e){var t=Object(f["e"])(),n=Object(f["d"])(),a=Object(O["b"])({useScope:"global"}),o=a.t,i=n.query.levelCode,l=Object(c["H"])({area:"",pathCode:"",loading:!1,list:[],elementList:[],conditionVis:!0,conditionModel:{},typeValue:"",showPicker:!1,value1:"",columns:[],typeCode:"",extendsMap:{}}),u={text:"name"},r=function(){l.loading=!0,Object(p["n"])({levelCode:i}).then((function(e){l.loading=!1,l.list=e.data,Number(1===e.data.length)&&(l.area=e.data[0].pathName,l.pathCode=e.data[0].pathCode,l.elementList=Object(m["f"])(l.list,"pathCode",l.pathCode).elementList,l.areaShow=!1,d())})).catch((function(e){l.loading=!1}))},d=function(){var e=Object(m["f"])(l.elementList,"showType","inputGroup");Object(m["m"])(e)||v(),l.elementList.forEach((function(e){l.extendsMap[e.elementCode]={name:e.elementName,extend:e.extend}}))},v=function(){Object(j["c"])({parentCode:"id_card_type"}).then((function(e){e.check()&&e.data.length>0&&(l.columns=e.data,e.data.length>0&&e.data.forEach((function(e){l.extendsMap[e.code]={name:e.name,extend:e.extend}})))})).catch((function(e){}))},h=function(e,t){l.loading=!0;var n=new FormData;n.append("object",e.file),Object(j["d"])(n).then((function(e){l.loading=!1,e.check()&&(document.getElementById(t.name).src=e.data,l.conditionModel[t.name]=e.data,Object(b["a"])(o("auth.uploadSuccess")))})).catch((function(e){l.loading=!1,console.log(e)}))},g=function(){var n,c=[];if(!Object(m["m"])(l.conditionModel))for(var a in l.conditionModel)if(l.conditionModel.hasOwnProperty(a)){if(!Object(m["m"])(l.extendsMap[a].extend)){var u=new RegExp(l.extendsMap[a].extend);if(!u.test(l.conditionModel[a]))return Object(b["a"])("".concat(l.extendsMap[a].name)+o("register.incorrectlyFormed"))}c.push({elementCode:a,elementValue:l.conditionModel[a]})}if(c.length<l.elementList.length)return Object(b["a"])(o("auth.allAuthPlease"));Object(m["m"])(e.businessCode)?(n={levelCode:i,elementList:c},l.loading=!0,Object(p["w"])(n).then((function(e){l.loading=!1,e.check()&&t.replace({name:"KycCommitted"})})).catch((function(e){l.loading=!1,console.log(e)}))):(n={businessCode:e.businessCode,elementList:c,levelCode:i},l.loading=!0,Object(p["v"])(n).then((function(e){l.loading=!1,e.check()&&(t.replace({name:"KycCommitted"}),sessionStorage.removeItem("kycList"))})).catch((function(e){l.loading=!1,console.log(e)})))},y=function(){var e=l.columns.filter((function(e){return e.code!==l.typeCode}));e.length>0&&e.forEach((function(e){delete l.conditionModel[e.code]}))},C=function(e){l.typeValue=e.name,l.typeCode=e.code,l.showPicker=!1,y()};return Object(c["w"])((function(){var e=sessionStorage.getItem("kycList");Object(m["m"])(e)?r():(l.elementList=JSON.parse(e)[0].elementList,d())})),Object(c["x"])((function(){sessionStorage.removeItem("kycList")})),Object(s["a"])(Object(s["a"])({},Object(c["Q"])(l)),{},{onConfirm:g,getConditon:r,afterRead:h,handleConfirm:C,columnsFields:u})}};n("5b80");v.render=d,v.__scopeId="data-v-610d7bf8";t["a"]=v},"7a4d":function(e,t,n){},"7d5e":function(e,t,n){"use strict";n("0a5b")},8169:function(e,t,n){"use strict";n("d227")},aa56:function(e,t,n){e.exports=n.p+"img/level_3.b2626751.png"},af72:function(e,t,n){e.exports=n.p+"img/front_bank_card.e9bb6082.png"},bd05:function(e,t){e.exports="data:image/png;base64,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"},c992:function(e,t,n){e.exports=n.p+"img/back_bank_card.da85d173.png"},d227:function(e,t,n){},fecd:function(e,t,n){var c={"./face.png":"bd05","./level_1.png":"0169","./level_2.png":"0a02","./level_3.png":"aa56","./logo.png":"0ea5"};function a(e){var t=o(e);return n(t)}function o(e){if(!n.o(c,e)){var t=new Error("Cannot find module '"+e+"'");throw t.code="MODULE_NOT_FOUND",t}return c[e]}a.keys=function(){return Object.keys(c)},a.resolve=o,e.exports=a,a.id="fecd"}}]);
//# sourceMappingURL=authentication.0fa82f50.js.map
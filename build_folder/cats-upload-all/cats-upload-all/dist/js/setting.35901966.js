(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["setting"],{"0de3":function(t,e,o){},"0fc6":function(t,e,o){"use strict";o("0de3")},"17ba":function(t,e,o){"use strict";o.r(e);o("a9e3");var n=o("f2bf"),l=Object(n["ab"])("data-v-635afc0e");Object(n["G"])("data-v-635afc0e");var c={class:"page-wrap"};Object(n["E"])();var i=l((function(t,e,o,i,a,s){var r=Object(n["L"])("LayoutTop"),u=Object(n["L"])("van-switch"),b=Object(n["L"])("van-cell"),g=Object(n["L"])("van-button"),d=Object(n["L"])("van-action-sheet"),m=Object(n["L"])("Loading");return Object(n["D"])(),Object(n["i"])(n["a"],null,[Object(n["m"])(r,{back:!0,menu:!1,title:""}),Object(n["m"])("div",c,[Object(n["m"])(b,{title:t.$t("setting.enableNews")},{"right-icon":l((function(){return[Object(n["m"])(u,{modelValue:t.checked,"onUpdate:modelValue":e[1]||(e[1]=function(e){return t.checked=e}),"active-color":"#54C41C",size:"24px",onChange:i.changeNewsState},null,8,["modelValue","onChange"])]})),_:1},8,["title"]),i.customInfo?(Object(n["D"])(),Object(n["i"])(b,{key:0,"is-link":"",title:t.$t(1===Number(i.customInfo.loginPassStatus)?"forgot.setPwd":"login.modifyLoginPwd"),to:"/setLoginPwd"},null,8,["title"])):Object(n["j"])("",!0),i.customInfo&&!i.customInfo.phone?(Object(n["D"])(),Object(n["i"])(b,{key:1,"is-link":"",title:t.$t("setting.bindPhone"),to:"/bindMobile"},null,8,["title"])):Object(n["j"])("",!0),i.customInfo&&!i.customInfo.email?(Object(n["D"])(),Object(n["i"])(b,{key:2,"is-link":"",title:t.$t("setting.bindEmail"),to:"/bindEmail"},null,8,["title"])):Object(n["j"])("",!0),i.customInfo&&i.customInfo.email?(Object(n["D"])(),Object(n["i"])(b,{key:3,"is-link":"",title:t.$t("setting.replaceEmail"),to:"/changeBindEmail"},null,8,["title"])):Object(n["j"])("",!0),i.customInfo&&i.customInfo.phone?(Object(n["D"])(),Object(n["i"])(b,{key:4,"is-link":"",title:t.$t("setting.replacePhone"),to:"/changeBindMobile"},null,8,["title"])):Object(n["j"])("",!0),Object(n["m"])(b,{"is-link":"",title:t.$t("setting.setLang"),value:i.langText,onClick:e[2]||(e[2]=function(e){return t.langVisible=!0})},null,8,["title","value"]),Object(n["m"])(b,{"is-link":"",title:t.$t("setting.color"),value:i.colorText,onClick:e[3]||(e[3]=function(e){return t.colorVisible=!0})},null,8,["title","value"]),i.customInfo?(Object(n["D"])(),Object(n["i"])(g,{key:5,class:"logout-btn",loading:t.loading,type:"primary",onClick:i.handleLogout},{default:l((function(){return[Object(n["m"])("span",null,Object(n["P"])(t.$t("setting.logout")),1)]})),_:1},8,["loading","onClick"])):Object(n["j"])("",!0),Object(n["m"])(d,{show:t.langVisible,"onUpdate:show":e[4]||(e[4]=function(e){return t.langVisible=e}),actions:t.langActions,onSelect:i.langSelect},null,8,["show","actions","onSelect"]),Object(n["m"])(d,{show:t.colorVisible,"onUpdate:show":e[5]||(e[5]=function(e){return t.colorVisible=e}),actions:i.colorsActions,onSelect:i.colorSelect},null,8,["show","actions","onSelect"]),Object(n["m"])(m,{show:t.loading},null,8,["show"])])],64)})),a=(o("7db0"),o("b0c0"),o("5530")),s=(o("e17f"),o("2241")),r=o("6c02"),u=o("ca00"),b=o("5502"),g=o("47e2"),d=o("a417"),m=o("6856"),j={setup:function(t){var e=Object(n["o"])(),o=Object(g["b"])({useScope:"global"}),l=o.t,c=Object(n["g"])((function(){return j.state._user.customerInfo})),i=[{val:"night",name:"黑夜"},{val:"light",name:"白天"}],j=Object(b["c"])(),O=Object(r["e"])(),f=Object(n["H"])({checked:!1,loading:!1,langVisible:!1,colorVisible:!1,lang:Object(u["n"])("lang")||j.state._base.wpCompanyInfo.language,langActions:j.state.supportLanguages}),p=Object(n["g"])((function(){var t=f.langActions.find((function(t){return t.val===f.lang}));return t?t.name:""})),h=Object(n["g"])((function(){var t=i.find((function(t){return t.val===j.state.invertColor}));return t?t.name:""}));Object(n["w"])((function(){Object(u["m"])(Object(u["n"])("openNews"))||(f.checked=JSON.parse(Object(u["n"])("openNews")))}));var v=function(t){Object(u["o"])("openNews",t)},y=function(){s["a"].confirm({title:l("common.tip"),message:l("setting.logoutConfirm")}).then((function(){return f.loading=!0,e.appContext.config.globalProperties.$MsgSocket.logout(),j.dispatch("_user/logout")})).then((function(){return O.push("/login")})).then((function(){location.reload()})).catch((function(){}))},C=function(t){f.loading=!0,Object(d["a"])(t.val).then((function(e){f.loading=!1,e.check()&&(f.langVisible=!1,f.lang=t.val,Object(u["o"])("lang",t.val))})).catch((function(t){return f.loading=!1}))},w=function(t){j.commit("Update_invertColor",t.val),Object(m["b"])(t.val),f.colorVisible=!1;var e=sessionStorage.getItem("themeColors");Object(u["m"])(e)||(e=JSON.parse(e),document.body.style.setProperty("--color",e[t.val].color),document.body.style.setProperty("--contentColor",e[t.val].contentColor),document.body.style.setProperty("--primaryAssistColor",e[t.val].primaryAssistColor),document.body.style.setProperty("--bgColor",e[t.val].bgColor),document.body.style.setProperty("--normalColor",e[t.val].normalColor),document.body.style.setProperty("--minorColor",e[t.val].minorColor),document.body.style.setProperty("--lineColor",e[t.val].lineColor),document.body.style.setProperty("--assistColor",e[t.val].assistColor),document.body.style.setProperty("--placeholdColor",e[t.val].placeholdColor))};return Object(a["a"])({colorsActions:i,customInfo:c,handleLogout:y,changeNewsState:v,langText:p,langSelect:C,colorSelect:w,colorText:h},Object(n["Q"])(f))}};o("0fc6");j.render=i,j.__scopeId="data-v-635afc0e";e["default"]=j}}]);
//# sourceMappingURL=setting.35901966.js.map
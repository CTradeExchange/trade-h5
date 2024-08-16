function getDevice() {
    let openFrom = false // PC
    if (/mobile|android|ios|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(window.navigator.userAgent)) {
        openFrom = true // h5
    }
    return openFrom
}

function initMessage() {
    if ('function' !== typeof importScripts) return;
    importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
    importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');
    // importScripts('https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js');
    // importScripts('https://www.gstatic.com/firebasejs/10.2.0/firebase-messaging.js');
    // import { initializeApp } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-app.js";
    // import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.2.0/firebase-messaging.js";
  

    const firebaseConfig = {
        apiKey: 'AIzaSyBEBk5vgB2rdYlD003IdDkYdm9sEXx6VOo',
        authDomain: 'headline-app-a3988.firebaseapp.com',
        projectId: 'headline-app-a3988',
        storageBucket: 'headline-app-a3988.appspot.com',
        messagingSenderId: '357833684311',
        appId: '1:357833684311:web:dbc566f8fcd3b1eb8a3a12',
        measurementId: 'G-YPLGMSBT0D',
    };

    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();

    // 获取消息类型列表
    const msgTypeList = [
        '1', // 首页 Index
        '2', // 热点事件详情 hotTopic
        '3', // 财经日历详情 economicCalendarDetails
        '20', // 行情列表 quote/index
        '30', // 产品详情 webview/product
        '40', // 充值
        '50', // 消息列表 msg
        '60', // 购买数字货币 buyCrypto
        '70', // 推广链接
    ]

    const getPathName = (payload, url) => {
        const { gotoType, ItemID = '', PromoteUrl, symbolId, symbolName, tradeType } = payload || {}
        const urls = url.indexOf('en-US/') > -1 ? url : `${url}en-US/`
        if (msgTypeList.includes(gotoType)) {
            switch (gotoType) {
                case '2': // 热点事件详情
                    return `${urls}infoDetail?id=${ItemID}`
                case '3': // 财经日历详情
                    return `${urls}economicCalendar?id=${ItemID}`
                case '20': // 行情列表
                    return `${urls}quote`
                case '50':
                    return `${urls}${getDevice() ? 'msg' : 'notice'}`
                case '40':
                case '60':
                    return `${urls}assets`
                case '70': // 推广链接
                    return PromoteUrl
                case '30': // 产品详情
                    return `${urls}${getDevice() ? 'product' : 'order'}?symbolId=${symbolId}&tradeType=${tradeType}&name=${symbolName}`
                case '1': // 首页
                default:
                    return urls
            }
        }
        return urls
    }

    const getMessage = (payload) => {
        const { notification, data } = payload || {};
        const { gotoData, gotoType } = data || {}
        const { title, body } = notification || {};
        let payloadItem = {}
        try {
            payloadItem = JSON.parse(gotoData)
        } catch { }
        payloadItem = { ...payloadItem, gotoType }

        const notificationOptions = {
            body: body || '通知',
            icon: 'https://news-pub.mcgrp.com/mc900/1681091510565170996.png',
            requireInteraction: true,
            vibrate: [200, 100, 200, 100, 200],
        };

        self.registration.showNotification(title || 'Headline.net', notificationOptions);

        if (!gotoType) return console.warn('Invalid Notice')

        self.addEventListener('notificationclick', function (event) {
            const clickedNotification = event.notification;
            clickedNotification.close();
            const urlToOpen = new URL(self.location.origin, 'https://www.headline.net').href;
            const promiseChain = clients.matchAll({
                type: 'window',
                includeUncontrolled: true
            })
                .then((windowClients) => {
                    let matchingClient = null;
                    for (let i = 0; i < windowClients.length; i++) {
                        const windowClient = windowClients[i];
                        if (windowClient.url === urlToOpen) {
                            matchingClient = windowClient;
                            break;
                        }
                    }
                    if (matchingClient) {
                        return matchingClient.focus();
                    } else {
                        const urls = getPathName(payloadItem, urlToOpen)
                        return clients.openWindow(urls);
                    }
                });

            event.waitUntil(promiseChain);
        });
    }

    self.addEventListener('push', function (event) {
        const options = event?.data?.json();
        event.waitUntil(getMessage(options));
    });

    // 后台更新
    // messaging.onBackgroundMessage(getMessage)
}

// 应用后台
initMessage();

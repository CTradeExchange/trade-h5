import ReconnectingWebSocket from 'reconnectingwebsocket'
export default function (wsURL, extra = '') {
    const protocol = location.protocol === 'http:' ? 'ws:' : 'wss:'
    const url = wsURL.startsWith('ws') ? wsURL : protocol + location.host + wsURL
    const ws = new ReconnectingWebSocket(url, extra || null, { automaticOpen: false, connectionTimeout: 10000 })
    return ws
}

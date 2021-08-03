import ReconnectingWebSocket from 'reconnectingwebsocket'
export default function (wsURL) {
    const protocol = location.protocol === 'http:' ? 'wss:' : 'wss:'
    const url = wsURL.startsWith('ws') ? wsURL : protocol + wsURL
    const ws = new ReconnectingWebSocket(url, null, { automaticOpen: false })
    return ws
}

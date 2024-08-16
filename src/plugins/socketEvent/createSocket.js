import ReconnectingWebSocket from 'reconnectingwebsocket'
export default function (url) {
    const ws = new ReconnectingWebSocket(url, null, { automaticOpen: false })
    return ws
}

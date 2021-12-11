import ReconnectingWebSocket from 'reconnectingwebsocket'
export default function (wsURL) {
    if (process.env.VUE_APP_h5Preview) {
        return {
            open: () => {},
            addEventListener: () => {}
        }
    }
    const protocol = location.protocol === 'http:' ? 'ws:' : 'wss:'
    const url = wsURL.startsWith('ws') ? wsURL : protocol + wsURL
    const ws = new ReconnectingWebSocket(url, null, { automaticOpen: false })
    return ws
}

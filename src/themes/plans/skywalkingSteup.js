import ClientMonitor from 'skywalking-client-js'

const collectorDomain = 'https://preskyapi.cats-trade.com'

export function skywalkingRegister () {
    ClientMonitor.register({
        collector: collectorDomain,
        service: 'test-ui',
        pagePath: location.pathname,
        serviceVersion: 'v1.0.0',
        noTraceOrigins: ['https://prodcn.displore.com.cn'],
        enableSPA: true,
        useFmp: true
    })
}

export function skywalkingRreportErrors (err) {
    ClientMonitor.reportFrameErrors({
        collector: collectorDomain,
        service: 'test-ui',
        pagePath: location.pathname,
        serviceVersion: 'v1.0.0',
    }, err)
}

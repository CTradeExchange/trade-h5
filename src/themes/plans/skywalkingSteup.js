import ClientMonitor from 'skywalking-client-js'

const collectorDomain = 'https://preskyapi.cats-trade.com'
const service = 'test-ui'
const serviceVersion = 'v1.0.0'

export function skywalkingRegister (router) {
    // 注册skywalking
    ClientMonitor.register({
        collector: collectorDomain,
        service,
        pagePath: location.href,
        serviceVersion,
        noTraceOrigins: ['https://prodcn.displore.com.cn'],
        // enableSPA: true,
    })

    // 路由变化追踪
    router.afterEach((to, from) => {
        ClientMonitor.setPerformance({
            collector: collectorDomain,
            service,
            serviceVersion,
            pagePath: location.href,
            useFmp: true
        })
    })
}

export function skywalkingRreportErrors (err) {
    ClientMonitor.reportFrameErrors({
        collector: collectorDomain,
        service: 'test-ui',
        pagePath: location.href,
        serviceVersion: 'v1.0.0',
    }, err)
}

import axios from 'axios'

const mergeParhParam = (path, params) => {
    const arr = Object.keys(params).map(i => `${i}=${[params[i]]}`)
    return `${path}?${arr.join('&')}`
}

function getTrackingInvesting (param) {
    const development = process.env.NODE_ENV === 'development'
    const url = 'https://us-central1-madrid-investing.cloudfunctions.net/PostbackCloudFunciton'
    console.log('getTrackingInvesting', param)
    const sId = localStorage.getItem('subID')
    if (param.subID) {
        localStorage.setItem('subID', param.subID)
    } else if (!param.subID && sId) {
        param.subID = sId
    }

    const params = {
        token: 'YWR2ZXJpc2VyX2FmZmlsYXRpb25fdXJs',
        advertiser: 'MagicCompass',
        brand: 'MagicCompass',
        model: 'CPL',
        affiliate_id: '1',
        event_type: 'Lead',
        user_id: '%3Auser_id',
        subID: 'sid',
        ...(param || {})
    }

    const path = mergeParhParam(development ? '/PostbackCloudFunciton' : url, params)

    axios.get(path).then(
        response => {
            const result = response.data.data
            console.log(result)
            this.repositoryName = result.name
            this.web3_urls = result
        }
    )
}

export default getTrackingInvesting

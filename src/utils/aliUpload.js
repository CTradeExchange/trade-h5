import OSS from 'ali-oss'
import { GetStsToken } from '@/api/newApi'
const OSS_PREFIX = 'mc900'

const getUploadToken = () => {
    return new Promise((r, j) => {
        const { uploadToken } = global || {}
        const { expiration } = uploadToken || {}
        const nowTime = Date.now() + 5 * 60 * 1000
        const expira = new Date(expiration).getTime()
        if (expira <= nowTime || !uploadToken) {
            GetStsToken({ body: {} }).then((res) => {
                const {
                    AccessKeyId,
                    AccessKeySecret,
                    Bucket,
                    Code,
                    Endpoint,
                    Expiration,
                    RegionID,
                    SecurityToken,
                    cdnUrl,
                } = res
                if (Code === 1000) {
                    const OSSKEY = {
                        accessKeyId: AccessKeyId,
                        accessKeySecret: AccessKeySecret,
                        bucket: Bucket,
                        endpoint: Endpoint,
                        expiration: Expiration,
                        region: RegionID,
                        stsToken: SecurityToken,
                        cdnUrl,
                    }
                    global.uploadToken = OSSKEY
                    r(OSSKEY)
                } else {
                    j()
                }
            })
        } else {
            r(uploadToken)
        }
    })
}

const UploadToOSS = async (self, file, name, onProgress) => {
    const url = `${OSS_PREFIX}/${name}`
    return new Promise((resolve, reject) => {
        new OSS(self)
            .multipartUpload(url, file, {
                parallel: 3,
                partSize: 1024 * 1024,
                progress: (p) => {
                    const result = {
                        key: name,
                        percent: Math.round(p * 100),
                    }
                    onProgress(result)
                },
            })
            .then((data) => {
                const { res = {} } = data || {}
                if (res.status === 200) {
                    resolve(data)
                } else {
                    reject(data)
                }
            })
            .catch((error) => {
                reject(error)
            })
    })
}

export const UploadOSS = async ({
    file,
    fileKey,
    onProgress = () => {},
    onFinish = () => {},
}) => {
    try {
        await getUploadToken()
    } catch {
        onFinish('error', {
            key: fileKey,
            url: '',
        })
        return
    }
    const { uploadToken } = global
    if (!uploadToken) {
        onFinish('error', {
            key: fileKey,
            url: '',
        })
        return
    }
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onloadend = () => {
        const { cdnUrl, ...OSSTOKEN } = uploadToken
        UploadToOSS(OSSTOKEN, file, fileKey, onProgress)
            .then((data) => {
                const { name } = data || {}
                onFinish('done', {
                    key: fileKey,
                    url: `${cdnUrl}/${name}`,
                })
            })
            .catch(() => {
                onFinish('error', {
                    key: fileKey,
                    url: '',
                })
            })
    }
}

export const createFileKey = (file) => {
    if (file) {
        const { name = '' } = file || {}
        const nameSuffix = name.toString().split('.').reverse()[0]
        const prefix =
      String(Date.now()) + Math.floor(Math.random() * 899999 + 100000)
        return `${prefix}.${nameSuffix}`
    }
    return ''
}

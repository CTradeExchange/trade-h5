import md5 from 'js-md5'
import JSEncrypt from 'jsencrypt'
// const pubKey = 'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQC1SL0JdZRTcHZ1mesu8j74EeJ9b+bu5wvjEETTmo2dqQXbjxgJVbqr8bxS+xhaCssnSQyMb3zmImEbe6PgXZeeHRPssNJKwhM6Tr1NeABMecwgnsJxRiDCtwXXzYIdVyHoaJGxjfv9ZcnQqKN5HyODiVy4eJjSAaKcWyZmehoZQwIDAQAB'
// const privkey = 'yU5zV8pcXoCGTtpcp0RxIEUBT/EKMePFVCTH0bm/13gMPZLjWKDZ+cm7Yej2Ch8j0li6YKVx1wMFHZao+rIGeuUo8TFwnpHPOI3fnQ7Psih6VnnvZ0EQnmZ0KKjLllgtyzw6fooDcRMTYsts2lQdSs9dyinDx/abBXmEtcVAl/xvfAOcZtfKYMYDXWPsqDVk6BIZ+yjL/KC0Fo9T2X1sdGmfA+KSzevYrEXjm30lwaqOZG4Jm4Ynk3XtsdTJZ8dzWTheS6qxqA6vNfd0ewoh5pEHmtSAb4IVIKez4HeSVF9kDdIBbmq0sLh3O3SlvPHbJ/mJteSFdrn3JxvKqVc3dkdpXUW3Eadi6JFw+htsmy350MK914KUXmUCBvsTtovs0/3n1UdEKUj3dEKm1/B3jlOQI3YLvEt4UWazI1KsSjtiPUN+NLXfLom6U3WaFS6Vfdcles5Dh/lZJrBmJO0CP9zBtmik9gL/VWyaccWQpxJUh+PErKIe+GekirzhsiEFhMGXEVKz8MO6mGhDRU8humNkbv64eJ0lbt1NY+HnPnLTi1Y4gpkVx2oiwtHXTPCgei2I1dH20mTa+54iXgp13qWzlt94enfavPuBpGhC7CU+1v6Q8mFaxLY9p+FdEGW05lZofl8vFgq5j+zdOTUonMyBCGm+Gn4fn/3vsewSM+BJrF/bnHM8+DzKM7s/YzOTJ/s1+kZ3G+p+yhzSQL2RCzHiT0IC4gYi9ON4KkZ2OTBAgHBhnsweQhdVisbibVPrtdV9Emmw8/ylnejay9Ad0TWWKkh0ijNDIJ448JhHcbHArpNqz2Njn3IlieQMZO79M7CUkxsWVV11kwMUvhR9YYmO+RySjOW/RebEUoKO8tw6JME4GJPBjFCc12HFh+E65ibdB6KOazNBKQ3WjkSpa9yb51dUyY2T80l2ytPWwUmpwc+9wk6/1j3CZGYpGh0adeitQUK2mgl2kpiuKCzGqThGZ+rGugBopsviJYCXmGBW/DIjjAXCV/0g3cYlETLTWC1cKU2qNp7imygWnASEV1Wxc03Jm3lS2sb/+va7+HKL4gCh6er8iLA8gbDW29t1Ryj/LbzPX8oHmmLyjBQh1NCg5F+VruGPcZUTWmb0YKxZjIl/jyV6EjmzGqEI2v71'

const pubKey = '-----BEGIN PUBLIC KEY----- MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCpCvqMGFeJcWsJnqj/8wi7w4UL E5q/uSXl/qx6ybMlxyovYtuvspG3P5RrWyPcI/BuYYjs5gnJiPV1St4/wZN7ZY2F 3L5sQ31EIwp1hRfnKdApMOSdDomN3baX0i52M24vvtWY1VRi4gIXR9+IekVqxfxh Iz7IXzEDw3u9GD0aBQIDAQAB -----END PUBLIC KEY-----'
const privkey = '-----BEGIN RSA PRIVATE KEY----- MIICXAIBAAKBgQCpCvqMGFeJcWsJnqj/8wi7w4ULE5q/uSXl/qx6ybMlxyovYtuv spG3P5RrWyPcI/BuYYjs5gnJiPV1St4/wZN7ZY2F3L5sQ31EIwp1hRfnKdApMOSd DomN3baX0i52M24vvtWY1VRi4gIXR9+IekVqxfxhIz7IXzEDw3u9GD0aBQIDAQAB AoGAImaakFIP1mefacjBCb1SxKtIcvWdY3DxVnnabe6IJ6L9YcFThdDoOIuWz7Yv eQhTUJNGwzcZPMtDcIg47G6fbYLSRyM7VT9niC92k3VvsUjlP9G/9bjwYVf1CF3r YCEBq/A+WgK3Kir1KcZiJXOlp6VYPsfTJFknQY4A4dqOw80CQQDt0ua9pL8AiowV uXxUEO06ch6w7yBOQN7lk1PxrvHbkslGcu1uTUQZ/WtpOl9LjT1bkmshznEy4YxH 1WOiPVmXAkEAtfZbOFApUnFHEm06wqyEVj2lUxEUi38YV4JUk8ghMfOHcstQdOIO toaHXrupBfeNgSR+K+/7aqmXb+7BMzCEwwJACPhzi6OzMKoJLqiYb/NTf2jej331 kf4QakhsWilnJgkbXnTnT8nKT9CnRIjXH1psfg+/yr6mtmybhfoej/gQcQJAMYYs i6YdqQeVrWk3PfbQSdybW4FhkxnzWRXqyRIGHt9GNTMq4bUJBhqVS25N8YbP5580 C+dUCVLBGcDkqncBGwJBANrEZkSsdQKa3C0NwL9D/VP98LN6fbghVaO864UInydv X3o3R66gRLxxFwe736ys+HdVzvcN3OUf2MQnx+0DmSY= -----END RSA PRIVATE KEY-----'

// request入参加密
export function encryptParams (data = {}, timestamp) {
    data = Object.assign({}, data, { timestamp })
    const keys = Object.keys(data).filter(el => ['string', 'number'].includes(typeof (data[el]))).sort((a, b) => a.localeCompare(b))
    const encryptA = keys.map(el => `&${el}=${data[el]}`)
    const encryptB = `timestamp=${timestamp}`
    const encryptC = encryptB + encryptA.join('')
    const encryptD = md5(encryptC).toUpperCase()
    const newData = { signature: encryptD }
    for (const key in data) {
        if (Object.hasOwnProperty.call(data, key) && typeof (data[key]) !== 'undefined') {
            newData[key] = data[key]
        }
    }

    /* 加密 */
    const newDataStr = JSON.stringify(newData)
    const encryptedDataString = encryptByChunk(newDataStr)
    console.log(encryptC, encryptD, newData, encryptedDataString)
    return encryptedDataString
}

// request入参分块加密
export function encryptByChunk (str) {
    const encryptor = new JSEncrypt() // 创建加密对象实例
    encryptor.setPublicKey(pubKey)// 设置公钥
    // encryptor.setPublicKey(privkey)
    const chunk = 100
    let i = 0
    let encryptedStr = ''
    for (i = 0; i < str.length / chunk; i++) {
        // 对内容进行分块加密
        encryptedStr += encryptor.encrypt(str.slice(i * chunk, (i + 1) * chunk))
        encryptedStr += ','
    }
    encryptedStr += encryptor.encrypt(str.slice(i * chunk))
    return encryptedStr
}

// request入参分块解密
export function decryptByChunk (encrypted) {
    const encryptedArr = encrypted.split(',')
    let encryptedStr = ''
    const decrypt = new JSEncrypt()
    decrypt.setPublicKey(privkey)
    encryptedArr.forEach(el => {
        encryptedStr += decrypt.decrypt(el)
    })
    const encryptedData = JSON.parse(encryptedStr)
    console.log(encryptedData)
    return encryptedData
}

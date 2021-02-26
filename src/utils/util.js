import pako from 'pako'

export const randomId = () => {
    const r = Math.random() + Math.random() + Math.random()
    return r.toString().slice(2)
}

// Gzip解压 对应wp接口数据
export function unzip(str){
    let strData = atob(str);
    let charData = strData.split('').map((t)=>(t.charCodeAt(0)));
    const binData = new Uint8Array(charData);
    const data = pako.inflate(binData);
    strData = String.fromCharCode.apply(null, new Uint16Array(data));
    strData = decodeURIComponent(strData)
    console.warn('解压字符',JSON.parse(strData));
    return strData;
}

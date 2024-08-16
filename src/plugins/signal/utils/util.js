import dayjs from 'dayjs'

// 合并两组信号列表 limit代表最大长度
export function mergeSignalList (arr = [], arr2 = [], limit = 10) {
    // 第一组取当前推送的数组
    if (arr.length === 0 || arr2.length === 0) {
        return [
            ...arr,
            ...arr2
        ].slice(0, limit)
    }
    const listMap = {}
    const listList = [...arr, ...arr2]
    // 去重
    listList.forEach((item) => {
        listMap[item.id] = item
    })
    // 根据时间排序
    const listSort = Object.keys(listMap).sort((a, b) => {
        const aSortNum = dayjs(a.t).valueOf()
        const bSortNum = dayjs(b.t).valueOf()
        return bSortNum - aSortNum
    })
    return listSort.slice(0, limit).map((item) => {
        return listMap[item]
    })
}

// symbolCode 转换
export function formatSymbolCode (symbolCode, tradeType) {
    let symbolName = symbolCode
    switch (symbolCode) {
    case 'GOLD':
        symbolName = 'XAUUSD'
        break
    case 'SILVER':
        symbolName = 'XAGUSD'
        break
    }
    return tradeType ? (symbolName + '_' + tradeType) : symbolName
}

// 行情里面的symbolCode转成信号支持的symbolcode
export function formatScFromCats (symbolCode) {
    const symbolName = symbolCode ? symbolCode.replace('/', '') : ''
    return symbolName
}

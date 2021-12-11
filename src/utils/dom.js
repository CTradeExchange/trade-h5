// 获取处于当前屏和上半屏、下半屏的产品
export const getScreenList = (parentElm, childSelector, allList) => {
    const children = parentElm.querySelectorAll(childSelector)
    if (!children.length) return []
    const paremtH = parentElm.clientHeight
    const scrollTop = parentElm.scrollTop
    const itemH = children[0].offsetHeight
    const singleScreenMax = Math.ceil(paremtH / itemH) // 一屏显示的产品数
    let start = Math.floor(scrollTop / itemH) // 显示的第一个产品
    start = Math.max(start - singleScreenMax / 2, 0)
    const end = Math.round(start + singleScreenMax * 2)

    return allList.slice(start, end)
}

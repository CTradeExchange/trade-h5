import BigNumber from 'bignumber.js'

/** 四舍五入转化为指定小数位数，不足补0
 * @num num表示需要四舍五入的小数
 * @pNum s表示需要保留几位小数
 */
export function toFixed (num, s = 2) {
    return BigNumber(num).toFixed(s)
}

/* 获取数字小数位长度 */
export function getDecimalNum (num) {
    return BigNumber(num).dp()
}

/* 加法 */
export function plus (num1, num2) {
    num1 = num1 || 0
    num2 = num2 || 0
    return BigNumber(num1).plus(num2).toString()
}

/* 减法 */
export function minus (num1, num2) {
    num1 = num1 || 0
    num2 = num2 || 0
    return BigNumber(num1).minus(num2).toString()
}

/* 除法 */
export function divide (num1, num2) {
    num1 = num1 || 0
    num2 = num2 || 1
    return BigNumber(num1).div(num2).toString()
}
/* 除法 */
export function div (num1, num2) {
    num1 = num1 || 0
    num2 = num2 || 1
    return BigNumber(num1).div(num2).toString()
}
/* 乘法 */
export function mul (num1, num2) {
    num1 = num1 || 0
    num2 = num2 || 0
    return BigNumber(num1).multipliedBy(num2).toString()
}
/* 幂 */
export function pow (num1, num2) {
    num1 = num1 || 0
    num2 = num2 || 0
    return BigNumber(num1).pow(num2).toString()
}
/* 大于 */
export function gt (num1, num2) {
    return BigNumber(num1).gt(num2)
}
/* 大于等于 */
export function gte (num1, num2) {
    return BigNumber(num1).gte(num2)
}
/* 小于 */
export function lt (num1, num2) {
    return BigNumber(num1).lt(num2)
}
/* 小于等于 */
export function lte (num1, num2) {
    return BigNumber(num1).lte(num2)
}
/* 等于 */
export function eq (num1, num2) {
    return BigNumber(num1).eq(num2)
}
/* 移位比 shiftedBy(num1, num2)
 * num1 要处理的数字
 * num2 移位为小数点，即10的幂，如果n为负则向左移位，如果n为正则向右移位。
 */
export function shiftedBy (num1, num2) {
    if (!num1 || !num2) return num1
    return BigNumber(num1).shiftedBy(num2).toFixed(Math.abs(num2))
}
/* 比较两个数字值是否相等，包含null, undefined,0,'',false类型 */
export function equalTo (a, b) {
    const aBool = !!a
    const bBool = !!b
    if (aBool === false && aBool === bBool) {
        return true
    } else {
        return BigNumber(a).eq(b)
    }
}
/* 去绝对值 */
export function abs (num1) {
    return BigNumber(num1).abs().toString()
}

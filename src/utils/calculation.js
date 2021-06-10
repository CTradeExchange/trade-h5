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
export function plus (num1 = 0, num2 = 0) {
    return BigNumber(num1).plus(num2)
}

/* 减法 */
export function minus (num1 = 0, num2 = 0) {
    return BigNumber(num1).minus(num2)
}

/* 除法 */
export function divide (num1 = 0, num2 = 1) {
    return BigNumber(num1).div(num2)
}
/* 乘法 */
export function mul (num1 = 0, num2 = 0) {
    return BigNumber(num1).multipliedBy(num2)
}

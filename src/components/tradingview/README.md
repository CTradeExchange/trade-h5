# 使用说明

## 属性

| 参数                                        | 说明     | 类型   |
| ------------------------------------------- | -------- | ------ |
| <font color='red'> \* </font>`initialValue` | 产品属性 | object |
| `options`                                   | 图表配置 | object |
| `positionList`                              | 持仓数据 | array  |

## 回调函数

| 事件名称             | 说明               | 回调函数            |
| -------------------- | ------------------ | ------------------- |
| `symbolChanged`      | 切换产品后触发     | 切换后的产品 id     |
| `indicatorRemoved`   | 指标移除后触发     | 被移除的指标名称    |
| `orientationChanged` | 设备方向变化后触发 | 是否横屏（bool 值） |

## 方法

| 方法名            | 说明                     | 参数                             | 可选值 |
| ----------------- | ------------------------ | -------------------------------- | ------ |
| `setChartType`    | 设置图表类型             | Function(props: number)          |        |
| `setResolution`   | 设置图表周期             | Function(props: sring)           |
| `setSymbol`       | 切换产品                 | Function(props: number \| sring) |
| `updateIndicator` | 更新指标（全量更新）     | Function(props: array \| object) |
| `updateLineData`  | 更新买卖价线（全量更新） | Function(props: object)          |
| `updatePosition`  | 更新持仓 （全量更新）    | Function(props: array)           |

### 数据类型说明

| 数据类型     | 说明       | 数据结构                                                                                                                                                      |
| ------------ | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| initialValue | 产品属性   | {<br> &emsp;description: '欧元美元',<br>&emsp;symbolId: 1,<br>&emsp;digits: '4',<br>&emsp;buyPrice: '1.23',<br>&emsp;sellPrice: '1.35'<br>}                   |
| options      | 图表配置   | {<br>property, <br>indicators,<br>extension<br>}                                                                                                              |
| chartType    | 图表类型   | 0:Bar <br>1:Candle <br>2:Line <br>3:Area <br>4:Renko <br>5:Kagi <br>6:PnF <br>7:Line Break <br>8:Heikin-Ashi <br>9:Hollow Candle <br>10:Baseline <br>12:Hi-Lo |
| resolution   | 图表周期   | '1' \| '5' \| '15' \| '30' \| '60' \| '240' \| '1D' \| '1W' \| '1M' \| '10'                                                                                   |
| indicator    | 指标       | [{name, params}]                                                                                                                                              |
| positionList | 持仓数据   | 接口返回的数据结构（未做处理）                                                                                                                                |
| lineData     | 买卖价数据 | { <br> &emsp;buyPrice: number, <br> &emsp;sellPrice: number<br>}                                                                                              |

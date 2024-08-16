import request from '@/utils/request_new'

// 通过id获取新闻详情
export const GetItemByID = request('post', '/C/Item/GetItemByID')
// 通过id获取新闻详情
export const GetItemForCalendarByID = request('post', '/C/Item/GetItemHistoryByID')
// 客户端获取新闻列表
export const GetItems = request('post', '/C/Item/GetItems')
// 客户端获取自定义页面详情
export const GetCustomPage = request('post', '/C/Item/GetCustomPage')
// 观点投票
export const postViewPoint = request('post', '/C/Item/Viewpoint/Like')
// cats的token换新闻服务的token -- 已弃用
export const Token2Token = request('post', '/C/User/Token2Token')
// cats的token换新闻服务的token
export const CatsID2Token = request('post', '/C/User/CatsID2Token')
// 获取国家信息
export const GetCountries = request('post', '/C/Util/GetCountries')
// 获取系统配置
export const GetSysConfig = request('post', '/C/Util/GetSysConfig')
// 获取trade
export const GetTrade = request('post', '/C/Item/GetTrade')
// 获取trade详情
export const GetTradeByID = request('post', '/C/Item/GetTradeByID')
// 订阅新闻
export const SubscribeItem = request('post', '/C/Item/SubscribeItem')
// 取消订阅新闻
export const UnsubscribeItem = request('post', '/C/Item/UnsubscribeItem')
// 修改订阅新闻
export const UpdateSubscribeItem = request('post', '/C/Item/UpdateSubscribeItem')
// 获取比赛排行版
export const GetRankByActiveID = request('post', '/C/Activity/GetRankByID')
// 根据新闻id获取比赛列表
export const getAcitiveListByItemID = request('post', '/C/Activity/ListByItemID')
// 获取用户的比赛
export const getUserActiveList = request('post', '/C/Activity/UserBelongs')
// 获取比赛详情
export const getAcitiveDetail = request('post', '/C/Activity/GetActivity')
// 获取用户信息
export const getUserInfo = request('post', '/C/User/Info')
// 修改用户信息
export const UpdateUserInfo = request('post', '/C/User/UpdateInfo')
// 获取阿里云上传需要的信息
export const GetStsToken = request('post', '/C/User/GetStsToken')
// 上报firebase事件
export const ReportEvent = request('post', '/C/Util/ReportEvent')
// 上报客户端设备信息
export const ReportDevice = request('post', '/C/Util/ReportDevice')

//测试环境
var datapost = {
    dataSourceCode: 'DATA_000017',
    url: "",
    codeurl: "https://happy.andoner.cn", //python后台
    data_url: "http://wechatapp.cdifs.cn", //sass地址
    appid: "wx0c3c6dbf68c7831b",
    shareurl: "http://ifs.andoner.cn"
}
var host = document.domain
var devhost = "wechat.cdifs.cn" //正式地址
var testhost = "ifs.andoner.cn"
if (host == devhost || host == testhost) {
    datapost.url = '/weixin'
}
// 上线后的配置
if (host == devhost) {
    datapost.dataSourceCode = 'DATA_000006'
    datapost.codeurl = 'https://wechatapp.cdifs.cn' //python后台
    datapost.data_url = 'https://wechatapp.cdifs.cn' //sass地址
    datapost.appid = 'wxad12ff16661fb7f2'
    datapost.shareurl = 'https://wechat.cdifs.cn/'
}
export {
    datapost
}
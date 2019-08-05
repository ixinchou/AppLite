// 主域名
var host = "http://10.141.130.4:8080"; //"https://www.ixchou.com";

// 配置对象
var config = {
    usePost: `POST`,
    useGet: `GET`,
    host,

    // 热点轮播图列表
    hotImgUrl: `${host}/api/hotImages`,

    // 分类列表
    classesList: `${host}/api/classesList`,

    // 微信信息
    wxInfo: `${host}/api/wx/registry`,

    // 解密微信绑定的手机号码
    wxPhone: `${host}/api/wx/phone`,

    // 通过 sessionId 查找用户信息
    findMemberBySessionId: `${host}/api/member/find/`,
    // 更新名字
    updateMemberName: `${host}/api/member/update/name`,

    // 添加孩子的信息
    childAdd: `${host}/api/child/add`,
    // 孩子信息列表
    childList: `${host}/api/child/list/`,

    // 显示加载中界面
    showLoading: function(title) {
        wx.showLoading({
            title: title,
            mask: true,
        });
    },

    // 隐藏加载对话框
    hideLoading: function() {
        wx.hideLoading();
    },

    // 显示短时间的提示信息
    toast: function(title, icon) {
        wx.showToast({
            title: title,
            icon: icon,
            duration: 2000
        });
    },

    // 拉取远程服务器上的数据
    fetchingData: function(url, params, usedMethod, callback) {
        config.showLoading("加载数据，请稍候...");
        wx.request({
            url: url,
            method: usedMethod,
            data: params,
            success: res => {
                callback(res);
            },
            complete: res => {
                config.hideLoading();
            }
        });
    }
}
module.exports = config;
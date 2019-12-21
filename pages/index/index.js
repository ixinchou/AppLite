//index.js
//获取应用实例
const app = getApp().globalData;

Page({
    data: {
        motto: '如果您是首次使用小程序，则需要向微信申请相关授权',
        userInfo: {},
        hasUserInfo: false,
        canIUse: wx.canIUse('button.open-type.getUserInfo')
    },
    onLoad: function() {
        if (app.userInfo) {
            this.setData({
                userInfo: app.userInfo,
                hasUserInfo: true
            })
        } else if (this.data.canIUse) {
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            getApp().userInfoReadyCallback = res => {
                this.setData({
                    userInfo: res.userInfo,
                    hasUserInfo: true
                })
            }
        } else {
            // 在没有 open-type=getUserInfo 版本的兼容处理
            wx.getUserInfo({
                success: res => {
                    app.userInfo = res.userInfo
                    this.setData({
                        userInfo: res.userInfo,
                        hasUserInfo: true
                    });
                    getApp().fetchingUserSession(res.signature, res.iv, res.encryptedData);
                }
            })
        }
    },
    getUserInfo: function(e) {
        console.log(e)
        app.userInfo = e.detail.userInfo
        this.setData({
            userInfo: e.detail.userInfo,
            hasUserInfo: true
        });
        getApp().fetchingUserSession(e.detail.signature, e.detail.iv, e.detail.encryptedData);
    },
    fireToMain: function() {
        wx.redirectTo({
            url: '../main/main'
        })
    }
})
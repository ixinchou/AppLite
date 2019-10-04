//app.js
const config = require("config.js");

App({
    onLaunch: function() {
        // 查看本地存储中是否有 session 信息
        var that = this;
        var session = wx.getStorageSync("ixchou_session");
        if (null == session || "" === session) {
            this.globalData.hasSession = false;
        } else {
            this.globalData.hasSession = true;
            // 本地有 session 缓存则读取用户信息，准备进入小程序
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        wx.getUserInfo({
                            success: res => {
                                // 可以将 res 发送给后台解码出 unionId
                                //console.log(res);
                                that.globalData.userInfo = res.userInfo;

                                // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                                // 所以此处加入 callback 以防止这种情况
                                if (that.userInfoReadyCallback) {
                                    that.userInfoReadyCallback(res);
                                }
                            }
                        });
                    }
                }
            });
            that.fetchingDetails(session);
        }
    },
    fetchingDetails: function(session) {
        var that = this;
        config.get(config.findMemberBySessionId + session, null, function(res) {
            // 拉取服务器上的用户信息
            console.log(res);
            // 缓存我的信息
            that.globalData.myInfo = res.data;
        });
    },
    globalData: {
        userInfo: null,
        hasSession: false,
        myInfo: null,
        children: []
    },
    fetchingUserSession: function(signature, iv, encryptedData) {
        var that = this;
        // 通过后台拉取用户的详细信息
        if (!this.globalData.hasSession) {
            wx.login({
                success: res => {
                    // 拿到登录的code
                    var login_code = res.code;
                    var obj = {};
                    obj.signature = signature;
                    obj.iv = iv;
                    obj.encryptedData = encryptedData;
                    obj.loginCode = login_code;
                    obj.nickName = this.globalData.userInfo.nickName;
                    obj.gender = this.globalData.userInfo.gender;
                    config.post(config.wxInfo, obj, function(res) {
                        console.log(res);
                        // 本地保存服务器生成的sessionId
                        wx.setStorageSync("ixchou_session", res.data.sessionId);
                        // 拉取用户的详细信息
                        that.globalData.myInfo = res.data;
                    });
                }
            })
        }
    }
})
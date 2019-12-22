//app.js
const api = require("config.js");
const storage = require("storage.js");
const editor = require("editor.js");
const file = require("file.js");
const page = require("page.js");

App({
    onLaunch: function() {
        // 查看本地存储中是否有 session 信息
        var that = this;
        var session = storage.get(storage.IXCHOU_SESSION);
        if (api.isEmpty(session)) {
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
        // 拉取服务器上的用户信息
        api.get(api.findMemberBySessionId + session, null, function(res) {
            // 缓存我的信息
            that.globalData.myInfo = res.data;
            // 缓存是否具有管理员属性
            //storage.set(storage.IXCHOU_ADMIN, res.data.isUploadAble);
            if (that.userSessionReadyCallback) {
                that.userSessionReadyCallback(res.data);
            }
        }, res => {
            // session 绑定的微信id不存在，需要重新拿取微信信息绑定
            this.globalData.hasSession = false;
        });
    },
    globalData: {
        api: api,
        storage: storage,
        editor: editor,
        file: file,
        page: page,
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
                    api.post(api.wxInfo, obj, function(res) {
                        console.log(res);
                        // 本地保存服务器生成的sessionId
                        storage.set(storage.IXCHOU_SESSION, res.data.sessionId);
                        // 是否具有管理员属性
                        //storage.set(storage.IXCHOU_ADMIN, res.data.isUploadAble);
                        // 拉取用户的详细信息
                        that.globalData.myInfo = res.data;
                        if (that.userSessionReadyCallback) {
                            that.userSessionReadyCallback(res.data);
                        }
                    });
                }
            })
        }
    }
})
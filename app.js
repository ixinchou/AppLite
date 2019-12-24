//app.js
const api = require("api.js");
const storage = require("storage.js");
const editor = require("editor.js");
const file = require("file.js");
const page = require("page.js");

App({
    onLaunch: function() {
        wx.getSystemInfo({
            success: res => {
                if (!!res && res.brand === 'devtools') {
                    this.globalData.dev = true;
                }
            }
        });
        // 查看本地存储中是否有 session 信息
        var that = this;
        var session = storage.get(storage.IXCHOU_SESSION);
        that.globalData.hasSession = !api.isEmpty(session);
        if (that.globalData.hasSession) {
            // 本地有 session 缓存则读取用户信息，准备进入小程序
            wx.getSetting({
                success: res => {
                    if (res.authSetting['scope.userInfo']) {
                        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
                        that.refetchingUserInfo(false);
                    } else {
                        // 未授权，重新发起授权请求
                        that.refetchingUserInfo(true);
                    }
                },
                fail: res => {
                    // 获取本地微信授权失败，则重新发起授权
                    that.refetchingUserInfo(true);
                }
            });
        }
    },
    /**拉取用户的注册信息 */
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
            console.log("not bind user info, now auto binding.....");
            that.refetchingUserInfo(true);
        });
    },
    globalData: {
        api: api,
        // 是否开发模式
        dev: false,
        storage: storage,
        editor: editor,
        file: file,
        page: page,
        mottoChanged: false,
        userInfo: null,
        hasSession: false,
        myInfo: null,
        children: []
    },
    refetchingUserInfo: function(loginable) {
        let self = this;
        if (null != self.globalData.userInfo) {
            // 当前用户信息的缓存不为空则直接调用登录
            if (loginable) {
                let info = self.globalData.userInfo;
                self.fetchingUserSession(info.signature, info.iv, info.encryptedData);
            } else {
                self.fetchingDetails(storage.get(storage.IXCHOU_SESSION));
            }
        } else {
            // 从微信拉取用户信息
            wx.getUserInfo({
                success: res => {
                    // 保存登录信息以供下次继续调用
                    self.globalData.userInfo = res.userInfo;
                    self.globalData.userInfo.signature = res.signature;
                    self.globalData.userInfo.iv = res.iv;
                    self.globalData.userInfo.encryptedData = res.encryptedData;
                    if (loginable) {
                        // 如果需要重新绑定微信账户则重新登录一次
                        self.fetchingUserSession(res.signature, res.iv, res.encryptedData);
                    } else {
                        // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
                        // 所以此处加入 callback 以防止这种情况
                        if (self.userInfoReadyCallback) {
                            self.userInfoReadyCallback(res);
                        }
                        // 拉取用户的基本信息
                        self.fetchingDetails(storage.get(storage.IXCHOU_SESSION));
                    }
                }
            });
        }
    },
    /**重新绑定用户信息和微信账号 */
    fetchingUserSession: function(signature, iv, encryptedData) {
        var that = this;
        console.log("re-login to bind user info...")
        // 通过后台拉取用户的详细信息
        //if (!this.globalData.hasSession) {
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
                    // console.log(res);
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
        //}
    }
})
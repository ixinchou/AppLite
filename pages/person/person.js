// pages/person/person.js
const app = getApp();
const childrenTemp = require('../../data-temp.js').children;
const config = require('../../config.js');
const util = require('../../utils/util.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        menus: [{
            id: 1,
            icon: "xingming",
            text: "您的名字",
            value: "",
            dftValue: "您的姓名"
        }, {
            id: 2,
            icon: "phone",
            text: "联系方式",
            value: "",
            dftValue: "您的联系方式"
        }],
        children: [],
        dialogShowning: false,
        singleInputDialogSHowning: false,
        inputableDialogTitle: "",
        inputableDialogHint: "",
        inputableType: "text",
        inputableLength: 10,
        isInputName: false,
        isInputPhone: false,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        var menu = this.data.menus;
        menu[0].value = (null == app.globalData.myInfo ? "" : app.globalData.myInfo.userName);
        menu[1].value = (null == app.globalData.myInfo ? "" : app.globalData.myInfo.phone);
        this.setData({
            userInfo: app.globalData.userInfo,
            menus: menu
        });
        if (app.globalData.children.length <= 0) {
            // 没有拉取过孩子信息，则这里拉取并缓存
            var that = this;
            // 拉取我添加的孩子列表
            config.get(config.childList + app.globalData.myInfo.sessionId, null, function(res) {
                console.log(res);
                var list = res.data;
                for (let item of list) {
                    var birthday = item.birthday.substring(0, 10);
                    item.age = util.calculateAge(util.parseDate(birthday));
                }
                app.globalData.children = res.data
                that.setData({
                    children: res.data
                });
            });
        } else {
            this.setData({
                children: app.globalData.children
            });
        }
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {
        //获得modal组件
        this.modal = this.selectComponent("#modal");
        this.modalInput = this.selectComponent("#modalInput");
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },
    menuItemClick: function(e) {
        var id = e.currentTarget.dataset.index;
        this.openInputableDialog(e);
    },
    getPhoneNumber: function(e) {
        var that = this;
        console.log(e);
        // wx.checkSession({
        //     success: res => {
        //         console.log("session 未过期，可以直接使用");
        //     },
        //     fail: res => {
        //         console.log("session 已过期，需要重新登陆");
        //         // wx.login({
        //         //     success: res=>{

        //         //     }
        //         // });
        //     }
        // });
        var param = {};
        param.iv = e.detail.iv;
        param.encryptedData = e.detail.encryptedData;
        param.sessionId = app.globalData.myInfo.sessionId;
        config.post(config.wxPhone, param, function(e) {
            console.log(e);
            // 本地全局缓存我的详细信息
            app.globalData.myInfo = e.data;
            var menu = that.data.menus;
            menu[1].value = e.data.phone;
            // 更新UI上的手机号码
            that.setData({
                menus: menu
            });
        });
    },
    openInputableDialog: function(e) {
        var id = e.currentTarget.dataset.index;
        if (id == "1") {
            if (this.data.menus[0].value == "") {
                this.setData({
                    isInputName: true,
                    isInputPhone: false,
                    inputableType: "text",
                    inputableLength: 10,
                    inputableDialogTitle: "绑定您的名字",
                    inputableDialogHint: "您的姓名"
                });
                this.modalInput.showDialog();
            }
        } else {
            // if (this.data.menus[1].value == "") {
            //     this.setData({
            //         isInputName: false,
            //         isInputPhone: true,
            //         inputableType: "number",
            //         inputableLength: 11,
            //         inputableDialogTitle: "绑定您的手机",
            //         inputableDialogHint: "您的联系方式"
            //     });
            //     this.modalInput.showDialog();
            // }
        }
    },
    cancelInputableDialog: function(e) {
        this.setData({
            isInputName: false,
            isInputPhone: false
        });
        this.modalInput.hideDialog();
    },
    confirmInputabledDialog: function(e) {
        this.modalInput.hideDialog();
        var index = this.data.isInputName ? 0 : (this.data.isInputPhone ? 1 : -1);
        if (index >= 0) {
            var data = this.modalInput.data;
            var items = this.data.menus;
            // 更新名字
            if (index == 0) {
                var that = this;
                // 更新我的名字
                var param = {};
                param.sessionId = app.globalData.myInfo.sessionId;
                param.userName = data.inputValue;
                config.post(config.updateMemberName, param, function(res) {
                    // 更改成功
                    var item = items[index];
                    item.value = data.inputValue;
                    items[index] = item;
                    that.setData({
                        menus: items
                    });
                });
            } else {
                var item = items[index];
                item.value = data.inputValue;
                items[index] = item;
                this.setData({
                    menus: items
                });
            }
        }
        this.setData({
            isInputName: false,
            isInputPhone: false
        });
    },
    openChildBindDialog: function(e) {
        this.modal.showDialog();
    },
    confirmChildDialog: function() {
        this.modal.hideDialog();
        var child = {};
        var data = this.modal.data;
        child.name = data.childName;
        child.birthday = data.childBirthday + " 00:00:00";
        child.sex = data.childSex;
        child.age = data.childAge;
        child.sessionId = app.globalData.myInfo.sessionId;
        // 向远程服务器添加一条孩子的信息
        var that = this;
        config.post(config.childAdd, child, function(res) {
            console.log(res)
            var chs = that.data.children;
            child.id = chs.length + 1;
            chs.push(child);
            that.setData({
                children: chs
            });
        });
    },
    cancelChildDialog: function() {
        this.modal.hideDialog();
    },
    childrenDelete: function(e) {
        var id = e.currentTarget.dataset.index;
        var child = this.data.children.filter(function(value) {
            return value.id == id;
        });
        if (child.length > 0) {
            var that = this;
            var del = child[0];
            wx.showModal({
                content: "确定要删除 " + del.name + " 的信息吗？",
                confirmText: "确定",
                cancelText: "取消",
                success(res) {
                    if (res.confirm) {
                        config.post(config.childDelete + del.id, null, function(data) {
                            console.log("删除已登记的孩子的信息");
                            var source = that.data.children;
                            source.splice(del, 1);
                            that.setData({
                                children: source
                            });
                        });
                    }
                }
            });
        }
    }
})
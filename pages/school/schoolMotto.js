// pages/school/schoolMotto.js
const storage = require("../../storage.js");
const api = require("../../config.js");
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        uploadAble: false,
        motto: null,
        html: '',
        isEditorReturn: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            userInfo: app.globalData.userInfo,
            uploadAble: app.globalData.myInfo.uploadAble
        });
        // 页面加载的时候拉取一次校训内容
        this.fetchingMotto();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        if (this.data.isEditorReturn > 0) {
            // 编辑器返回，则需要先提交编辑器中的内容到服务器上，然后再拉取服务器中的内容并显示
            let that = this;
            // 新建
            var obj = {};
            obj.sessionId = storage.get(storage.IXCHOU_SESSION);
            obj.content = storage.get(storage.EDITOR_CONTENT);
            var isNew = null == this.data.motto;
            obj.id = isNew ? 0 : this.data.motto.id;
            // 当前校训对象为空则需要添加新的，否则是更新内容
            api.post(isNew ? api.mottoAdd : api.mottoEdit, obj, res => {
                that.setData({
                    motto: res.data,
                    html: res.data.content,
                    // 新建添加完毕之后，本地缓存数据清空
                    isEditorReturn: 0
                });
            });
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

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

    /**
     * 点击进入校训编辑和发布页面
     */
    fireToMottoEdit: function() {
        // 设置当前准备接受编辑器传回的内容
        this.setData({
            isEditorReturn: 0
        });
        storage.set(storage.EDITOR_TITLE, "编辑校训内容");
        if (null != this.data.motto) {
            storage.set(storage.EDITOR_CONTENT, this.data.motto.content);
        }
        wx.navigateTo({
            url: '/pages/editor/editor',
        })
    },
    /**
     * 拉取校训内容
     */
    fetchingMotto: function() {
        let that = this;
        api.get(api.mottoGet, null, res => {
            //console.log(res);
            if (null != res.data) {
                that.setData({
                    motto: res.data,
                    html: res.data.content
                });
            }
        });
    }
})
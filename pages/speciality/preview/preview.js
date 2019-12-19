// pages/speciality/preview/preview.js
const app = getApp();
const api = require("../../../config.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item: null,
        cover: null,
        content: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let data = options.data;
        var obj = null;
        if (!api.isEmpty(data)) {
            obj = JSON.parse(options.data);
        }
        this.setData({
            uploadAble: app.globalData.myInfo.uploadAble,
            item: obj,
            cover: obj.cover,
            content: obj.content
        });
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

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
    /**
     * 转到添加编辑页
     */
    fireToSpecialityEdit: function() {
        let json = JSON.stringify(this.data.item);
        wx.navigateTo({
            url: '/pages/speciality/edit/edit?data=' + json,
        });
    }
})
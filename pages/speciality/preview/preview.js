// pages/speciality/preview/preview.js
const app = getApp();
const api = require("../../../config.js");
Page({

    /**
     * 页面的初始数据
     */
    data: {
        http: '',
        item: null,
        cover: null,
        content: null,
        fee: 0.00,
        html: '<p>来呀快活呀反正有大把时光</p>'
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
            http: api.http + '/',
            uploadAble: app.globalData.myInfo.uploadAble,
            item: obj,
            cover: obj.cover,
            content: obj.content,
            fee: ((!!obj.classFee ? obj.classFee : 0) / 100).toFixed(2)
        });
        wx.setNavigationBarTitle({
            title: obj.name
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
    /**预览封面图 */
    previewCover: function() {

    },
    /**
     * 转到添加编辑页
     */
    fireToSpecialityEdit: function() {
        let json = JSON.stringify(this.data.item);
        wx.navigateTo({
            url: '/pages/speciality/edit/edit?data=' + json,
        });
    },
    /**
     * 报名
     */
    fireToApply: function() {

    }
})
// pages/speciality/preview/confirm.js
const app = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        item: null,
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let data = app.storage.getLargeData();
        var obj = null;
        if (!app.api.isEmpty(data)) {
            obj = JSON.parse(data);
        }
        this.setData({
            item: obj
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

    /**确定下单 */
    onConfirm: function() {
        wx.navigateTo({
            url: './purchase',
        })
    }
})
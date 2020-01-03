// pages/speciality/preview/purchase.js
const app = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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

    requestPayment: function() {
        const self = this

        self.setData({
            loading: true
        });

        app.api.toast('暂时无法发起支付', '');
        setTimeout(() => {
            self.setData({
                loading: false
            });
        }, 5000);
    }
})
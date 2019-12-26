// pages/moment/preview/preview.js
const app = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        id: 0,
        html: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let value = app.storage.getLargeData();
        let obj = JSON.parse(value);
        this.setData({
            id: obj.id,
            html: !!obj && !!obj.content ? obj.content.content : '<p>没有内容...</p>'
        });
        wx.setNavigationBarTitle({
            title: !!obj ? obj.title : '没有内容',
        });
        //this.fetchingMoment();
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

    /**拉取详情 */
    fetchingMoment: function() {
        let that = this;
        app.api.get(`${app.api.momentGet}/${that.data.id}`, null, res => {
            that.setData({
                html: !!res.data && !!res.data.content ? res.data.content.content : '<p>没有内容...</p>'
            });
            wx.setNavigationBarTitle({
                title: !!res.data ? res.data.title : '没有内容',
            });
        });
    }
})
// pages/speciality/list/list.js
const app = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        uploadAble: false,
        skills: [],
        http: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            http: app.api.http + "/",
            uploadAble: !!app.myInfo ? app.myInfo.uploadAble : false
        });
        this.fetchingCourses();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

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
    onItemClick: function(item) {
        //console.log(item.currentTarget.dataset.item);
        // 转到详情页
        let json = JSON.stringify(item.currentTarget.dataset.item);
        app.storage.setLargeData(json);
        wx.navigateTo({
            url: '/pages/speciality/preview/preview',
        });
    },
    fetchingCourses: function() {
        let that = this;
        app.api.get(app.api.courseList, {
            pageIndex: 1,
            pageSize: 10
        }, res => {
            that.setData({
                skills: res.data.list
            });
        });
    },
    /**
     * 转到添加编辑页
     */
    fireToSpecialityEdit: function() {
        wx.navigateTo({
            url: '/pages/speciality/edit/edit?data=',
        });
    }
})
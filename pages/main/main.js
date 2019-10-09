// pages/main/main.js
const app = getApp()
const hotImages = require('../../data-temp.js').hotImage
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: {},
        hotImages: hotImages,
        swiper_height: 0,
        menu: [{
            id: 1,
            name: "新筹校训",
            icon: "ixchou-qiyejianjie",
            icon_color: "#FF0"
        }, {
            id: 2,
            name: "特长分类",
            icon: "ixchou-fenlei",
            icon_color: "#F00"
        }, {
            id: 3,
            name: "教师风采",
            icon: "ixchou-fengcai",
            icon_color: "#00F"
        }, {
            id: 4,
            name: "学生才艺",
            icon: "ixchou-huazhuangshi",
            icon_color: "#F0F"
        }]
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            userInfo: app.globalData.userInfo,
            swiper_height: 350
        })
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
    fireToPersonal: function() {
        wx.navigateTo({
            url: '/pages/person/person',
        });
    },
    /**
     * 转到校训页面
     */
    fireToMotto: function() {
        wx.navigateTo({
            url: '/pages/school/schoolMotto',
        });
    },
    /**
     * 转到特长分类页面
     */
    fireToSpeciality: function() {
        wx.navigateTo({
            url: '/pages/speciality/list/list',
        });
    }
})
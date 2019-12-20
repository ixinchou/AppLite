// pages/speciality/preview/preview.js
const app = getApp().globalData;
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
        time: '',
        html: '<p>没有内容</p>',
        isEditorReturn: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let data = options.data;
        var obj = null;
        if (!app.api.isEmpty(data)) {
            obj = JSON.parse(options.data);
        }
        this.setData({
            http: app.api.http + '/',
            uploadAble: app.myInfo.uploadAble,
            item: obj
        });
        this.loadItem();
    },
    loadItem: function() {
        let obj = this.data.item;
        this.setData({
            cover: obj.cover,
            content: obj.content,
            html: !!obj.content ? obj.content.content : "",
            fee: ((!!obj ? obj.fee : 0) / 100).toFixed(2),
            time: (!!obj && !!obj.term) ? obj.term.name : ""
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
        if (this.data.isEditorReturn > 0) {
            this.loadItem();
            this.setData({
                isEditorReturn: 0
            });
        }
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
        this.setData({
            isEditorReturn: 0
        });
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
// pages/moment/list/list.js
const app = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        http: '',
        type: 0,
        name: '',
        more: true,
        pageIndex: 1,
        uploadAble: false,
        items: [],
        empty1: '请先添加一些精彩的教师采风...',
        empty2: '请先添加一些精彩的学生才艺...',
        isEditorReturn: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let val = options.data;
        let type = app.api.isEmpty(val) ? 1 : parseInt(val)
        this.setData({
            uploadAble: app.myInfo.uploadAble,
            type: type,
            http: app.api.http,
            name: type == 2 ? "学生才艺" : "教师风采"
        });
        wx.setNavigationBarTitle({
            title: this.data.name
        });
        this.fetchingMoments(false);
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
            // 重新刷新列表
            wx.startPullDownRefresh();
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
        // 重新设置拉取第一页
        this.setData({
            pageIndex: 1,
            items: []
        });
        this.fetchingMoments(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.more) {
            this.setData({
                pageIndex: this.data.pageIndex + 1
            });
            this.fetchingMoments(true);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**拉取个人才艺相关列表 */
    fetchingMoments: function(stopable) {
        let that = this;
        app.api.get(app.api.momentList, {
            pageIndex: this.data.pageIndex,
            type: this.data.type
        }, res => {
            let obj = res.data;
            let array = this.data.items;
            obj.list.forEach(item => {
                array.push(item);
            });
            that.setData({
                pageIndex: obj.pageIndex,
                more: obj.totalPages > obj.pageIndex,
                items: array
            });
            if (stopable) {
                // 停止页面的下拉刷新
                wx.stopPullDownRefresh();
            }
        });
    },

    /**打开个人风采编辑器 */
    fireToMomentEdit: function() {
        this.setData({
            isEditorReturn: 0
        });
        wx.navigateTo({
            url: '/pages/moment/edit/edit?data=' + this.data.type,
        });
    },

    /**列表点击打开详情 */
    onItemClick: function(item) {
        //console.log(item.currentTarget.dataset.item);
        // 转到详情页
        let id = item.currentTarget.dataset.item.id;
        wx.navigateTo({
            url: '/pages/moment/preview/preview?data=' + id,
        });
    }
})
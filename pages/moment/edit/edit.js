// pages/moment/edit/edit.js
const app = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        type: 0,
        attachments: [],
        content: null,
        isEditorReturn: 0,
        html: '',
        title: '',
        pageTitle: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let val = options.data;
        let type = parseInt(val);
        this.setData({
            type: type,
            pageTitle: type == 1 ? '教师风采' : '学生才艺'
        });
        wx.setNavigationBarTitle({
            title: this.data.pageTitle,
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
        if (this.data.isEditorReturn > 0) {
            this.setData({
                html: !!this.data.content ? this.data.content.content : ''
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

    bindInput: function(e) {
        var value = e.detail.value;
        this.setData({
            title: value
        })
    },
    /**图文内容编辑 */
    fireToContent: function() {
        app.editor.goingToEditor(this.data.pageTitle, (!!this.data.content ? this.data.content.id : 0), this.data.html);
    },
    /**保存内容 */
    fireToSave: function() {
        if (app.api.isEmpty(this.data.title)) {
            app.api.toast("标题不能为空", "none");
            return;
        }
        if (!this.data.content) {
            app.api.toast("内容不能为空", "none");
            return;
        }
        app.api.post(app.api.momentAdd, {
            title: this.data.title,
            content: !!this.data.content ? this.data.content.id : 0,
            type: this.data.type,
            attachments: this.data.attachments
        }, res => {
            // 设置上一页的内容
            app.page.setPreviousData({
                isEditorReturn: 1
            });
            // 返回上一页
            app.page.back();
        });
    }
})
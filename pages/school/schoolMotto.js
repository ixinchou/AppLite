// pages/school/schoolMotto.js
const app = getApp().globalData;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        uploadAble: false,
        motto: null,
        content: null,
        html: '',
        isEditorReturn: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            uploadAble: !!app.myInfo ? app.myInfo.uploadAble : false
        });
        // 页面加载的时候拉取一次校训内容
        this.fetchingMotto();
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {},

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        if (this.data.isEditorReturn > 0) {
            // 编辑器返回，则需要先提交编辑器中的内容到服务器上，然后再拉取服务器中的内容并显示
            let self = this;
            var obj = {};
            obj.sessionId = app.storage.get(app.storage.IXCHOU_SESSION);
            obj.contentId = this.data.content.id;
            let mt = this.data.motto;
            var isNew = null == mt || null == mt.id || mt.id <= 0;
            obj.id = isNew ? 0 : mt.id;
            // 重新发布简介
            app.api.post(isNew ? app.api.mottoAdd : app.api.mottoEdit, obj, res => {
                self.resetExistMotto(res.data);
                self.setData({
                    isEditorReturn: 0
                });
            });
            // 标记简介内容已修改，需要重新拉取再显示
            app.mottoChanged = true;
        }
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {},

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {
        app.editor.clearEditorContent();
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
    resetExistMotto: function(data) {
        this.setData({
            motto: data,
            content: data.content,
            html: !!data.content ? data.content.content : ""
        });
    },
    /**
     * 点击进入校训编辑和发布页面
     */
    fireToMottoEdit: function() {
        // 设置当前准备接受编辑器传回的内容
        this.setData({
            isEditorReturn: 0
        });
        let data = this.data.content;
        app.editor.goingToEditor("编辑校训内容", !!data ? data.id : 0, this.data.html);
    },
    /**
     * 拉取校训内容
     */
    fetchingMotto: function() {
        let that = this;
        app.api.get(app.api.mottoGet, null, res => {
            //console.log(res);
            if (null != res.data) {
                that.resetExistMotto(res.data);
            }
        });
    }
})
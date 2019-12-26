// pages/member/member.js
const app = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        mySession: app.storage.get(app.storage.IXCHOU_SESSION),
        pageIndex: 1,
        searchText: '',
        loading: false,
        more: false,
        items: [],
        dialogButtons: [{
            text: '取消'
        }, {
            text: '确定'
        }],
        currentItem: null
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        this.setData({
            search: this.search.bind(this)
        });
        this.fetchingMembers(false);
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
        // 重置第一页
        this.setData({
            pageIndex: 1
        });
        this.fetchingMembers(true);
    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {
        if (this.data.more) {
            this.setData({
                pageIndex: this.data.pageIndex + 1
            });
            this.fetchingMembers(true);
        }
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    },

    /**搜索 */
    search: function(value) {
        let empty = app.api.isEmpty(value);
        if (empty || value.length >= 2) {
            // 重新拉取第一页
            this.setData({
                pageIndex: 1,
                searchText: empty ? '' : value
            });
            if (!this.data.loading) {
                this.fetchingMembers(false);
            }
        }
        return new Promise((resolve, reject) => {
            resolve([]);
        });
    },
    /**搜索框清除事件 */
    onSearchClear: function() {
        this.setData({
            pageIndex: 1,
            searchText: ''
        });
        this.fetchingMembers(false);
    },
    onFocus: function() {

    },
    /**搜索框失去焦点事件 */
    onBlur: function() {
        this.setData({
            pageIndex: 1,
            searchText: ''
        });
        this.fetchingMembers(false);
    },
    /**拉取用户列表 */
    fetchingMembers: function(stopable) {
        if (this.data.loading) {
            app.api.toast('别着急，请稍候...', 'none');
            return;
        }
        let that = this;
        // 标记正在加载内容还未返回
        that.switchLoading(true);
        app.api.get(app.api.memberList, {
            pageIndex: this.data.pageIndex,
            query: this.data.searchText
        }, res => {
            let obj = res.data;
            let array = obj.pageIndex == 1 ? [] : that.data.items;
            obj.list.forEach(item => {
                array.push(item);
            });
            that.setData({
                more: obj.totalPages > obj.pageIndex,
                items: array
            });
            if (stopable) {
                // 停止页面的下拉刷新
                wx.stopPullDownRefresh();
            }
            // 标记加载结束
            that.switchLoading(false);
        }, err => {
            // 标记加载结束
            that.switchLoading(false);
        });
    },

    /**更改加载状态 */
    switchLoading: function(loading) {
        this.setData({
            loading: loading
        });
    },

    /**列表点击打开详情 */
    onItemClick: function(item) {
        //console.log(item.currentTarget.dataset.item);
        // 转到详情页
        // let id = item.currentTarget.dataset.item.id;
        // wx.navigateTo({
        //     url: '/pages/moment/preview/preview?data=' + id,
        // });
    },

    /**管理员设定 */
    onItemSwitchChange: function(item) {
        let obj = item.currentTarget.dataset.item;
        // if (obj.sessionId === this.data.mySession) {
        //     app.api.toast('您不能改变您自己的管理员权限', 'none');
        //     this.hideDialog(false);
        //     return;
        // }
        let setted = obj.uploadAble ? false : true;
        let type = setted ? '设置为管理员' : '取消管理员';
        let name = !!obj.userName ? obj.userName : obj.wxNickName;
        let content = `您确实要将 ${name} ${type}吗？`;
        this.setData({
            currentItem: obj,
            //dialogContent: content,
            //dialogShow: true
        });
        this.modalConfirm(content);
    },

    /**修改管理员权限确认框 */
    modalConfirm: function(content) {
        let that = this;
        wx.showModal({
            title: '修改管理员权限',
            content: content,
            confirmText: "确定",
            cancelText: "取消",
            success(res) {
                if (res.confirm) {
                    // 确定按钮
                    app.api.post(app.api.updateMemberUploadAble, {
                        sessionId: that.data.currentItem.sessionId,
                        uploadAble: !that.data.currentItem.uploadAble
                    }, res => {
                        that.hideDialog(true);
                    }, err => {
                        that.hideDialog(false);
                    });
                } else {
                    that.hideDialog(false);
                }
            }
        });
    },
    hideDialog: function(updated) {
        let obj = this.data.currentItem;
        let index = -1;
        this.data.items.forEach((item, idx) => {
            if (item.sessionId == obj.sessionId) {
                index = idx;
                return;
            }
        });
        let uploadAble = updated ? !obj.uploadAble : obj.uploadAble;
        this.setData({
            dialogShow: false,
            currentItem: obj,
            ['items[' + index + '].uploadAble']: uploadAble
            //items: this.data.items
        });
    }
})
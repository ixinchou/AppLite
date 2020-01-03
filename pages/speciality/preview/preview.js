// pages/speciality/preview/preview.js
const app = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        http: '',
        changed: false,
        item: null,
        cover: null,
        content: null,
        fee: 0.00,
        actualFee: 0.00,
        rebate: 0,
        showOriginal: false,
        rebatedFee: 0.0,
        time: '',
        html: '<p>没有内容</p>',
        isEditorReturn: 0,
        uploadAble: false,
        showGallery: false,
        galleryImages: [],
        showingActionSheets: false,
        actions: [{
                text: '给自己报名',
                type: 'warn',
                value: 1
            },
            {
                text: '给孩子报名',
                value: 2
            }
        ]
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
            http: app.api.http + '/',
            uploadAble: !!app.myInfo ? app.myInfo.uploadAble : false,
            item: obj
        });
        this.loadItem();
    },
    loadItem: function() {
        let obj = this.data.item;
        let rebate = (100 - (!!obj ? obj.rebate : 0)) / 100;
        let fee = (!!obj ? obj.fee : 0) / 100;
        let images = [];
        if (!!obj.cover) {
            images.push(this.data.http + obj.cover.url)
        }
        this.setData({
            cover: !!obj.cover ? obj.cover : null,
            content: !!obj.content ? obj.content : null,
            html: !!obj.content ? obj.content.content : "",
            fee: (fee).toFixed(2),
            rebate: rebate,
            rebated: (fee * rebate).toFixed(2),
            showOriginal: !!obj ? (obj.showOriginalPrice != 0) : false,
            time: (!!obj && !!obj.term) ? obj.term.name : "",
            galleryImages: images
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
                changed: true,
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
        app.storage.setLargeData("");
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
        this.setData({
            showGallery: true
        });
    },
    /**
     * 转到添加编辑页
     */
    fireToSpecialityEdit: function() {
        this.setData({
            isEditorReturn: 0
        });
        //let json = JSON.stringify(this.data.item);
        // 直接使用 storage 缓存中的数据进行编辑
        wx.navigateTo({
            url: '/pages/speciality/edit/edit',
        });
    },
    /**报名类型反馈 */
    onActionTap: function(e) {
        switch (e.detail.value) {
            case 1:
                // 给自己报名
                this.checkApplyMyInfos();
                break;
            case 2:
                // 给孩子报名
                break;
        }
        this.openActions(false);
    },
    openActions: function(opening) {
        this.setData({
            showingActionSheets: opening
        });
    },
    /**
     * 报名
     */
    fireToApply: function() {
        this.openActions(true);
    },
    /**给自己报名时检查名字和联系方式是否都已经更改过 */
    checkApplyMyInfos: function() {
        // 检测用户名是否更改
        let isNamed = !!app.myInfo && !app.api.isEmpty(app.myInfo.userName);
        let isPhoned = !!app.myInfo && !app.api.isEmpty(app.myInfo.phone);
        if (!isNamed || !isPhoned) {
            // 提醒去修改名字和联系方式
            let content = !isNamed ? "【姓名】" : "";
            content += !isPhoned ? ((!app.api.isEmpty(content) ? "、" : "") + "【联系方式】") : "";
            app.wx.showDialog({
                text: "为了切实保障您的学习权益，请先绑定" + content + "后再报名！",
                confirmText: "去绑定",
                onConfirm: function() {
                    wx.navigateTo({
                        url: '/pages/person/person',
                    });
                }
            });
        } else {
            // 发起报名
            wx.navigateTo({
                url: './confirm',
            })
        }
    }
})
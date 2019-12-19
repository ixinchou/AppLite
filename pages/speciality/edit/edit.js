// pages/speciality/edit/edit.js

const storage = require("../../../storage.js");
var file = require('../../../file.js');
var api = require('../../../config.js');
var editor = require('../../../editor.js');
const app = getApp();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        uploadAble: false,
        course: null,
        content: null,
        cover: null,
        name: '',
        time: '',
        classTypes: ['整年期', '半年期', '季度期', '月期', '周期'],
        classIndex: 0,
        classFee: 0,
        image_src: '',
        html: '',
        isEditorReturn: 0
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let data = options.data;
        var obj = null;
        if (!api.isEmpty(data)) {
            obj = JSON.parse(options.data);
        }
        this.setData({
            uploadAble: app.globalData.myInfo.uploadAble,
            course: obj,
            content: !!obj ? obj.content : null,
            cover: !!obj ? obj.cover : null,
            name: !!obj ? obj.name : '',
            classIndex: this.getIndexOfClassType(!!obj ? obj.classType : ''),
            time: !!obj ? obj.classTime : '',
            html: (!!obj && !!obj.content) ? obj.content.content : '',
            image_src: (!!obj && !!obj.cover) ? (api.http + "/" + obj.cover.url) : ''
        });
    },
    getIndexOfClassType: function(type) {
        let idx = 0;
        this.data.classTypes.forEach((item, index) => {
            if (item === type) {
                idx = index;
            }
        });
        return idx;
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
                html: storage.get(storage.EDITOR_CONTENT)
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
    chooseImage: function() {
        const that = this;
        file.choose({
            type: 'image',
            count: 1,
            success: res => {
                console.log(res);
                that.setData({
                    image_src: res.path
                })
                // 文件选择成功，查询远程服务器上是否有相同记录
                file.checkRemoteFile({
                    signature: res.signature,
                    success: data => {
                        console.log("远程服务器上存在相同文件可以直接使用，不需要上传");
                        that.setData({
                            cover: data,
                            image_src: api.http + "/" + data.url
                        });
                    },
                    fail: () => {
                        console.log("远程服务器上不存在相同文件，需要上传");
                        api.upload(res, data => {
                            console.log(data);
                            that.setData({
                                cover: data,
                                image_src: api.http + "/" + data.url
                            });
                        }, error => {
                            console.log(error);
                        });
                    }
                });
            },
            fail: res => {
                console.log(res);
            }
        });
    },
    bindClassTypePickerChange: function(e) {
        this.setData({
            classIndex: e.detail.value
        });
    },
    fireToContent: function() {
        // 设置当前准备接受编辑器传回的内容
        this.setData({
            isEditorReturn: 0
        });
        editor.goingToEditor("课程简介", this.data.html);
    },
    fireToSave: function() {
        let courseId = 0;
        // 保存课程之前先保存内容
        let obj = {};
        // 图文内容
        obj.content = this.data.html;
        // 课程简介
        obj.type = 2;
        if (!!this.data.content) {
            obj.id = this.data.content.id;
        }
        let isNew = !!this.data.content ? false : true;
        api.post(isNew ? api.contentAdd : api.contentEdit, obj, res => {
            //courseId = res.data.id;
        });
    }
})
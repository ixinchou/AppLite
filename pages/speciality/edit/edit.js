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
        http: api.http + "/",
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
        });
        this.retriveCourse();
    },
    retriveCourse: function() {
        let obj = this.data.course;
        this.setData({
            name: !!obj ? obj.name : '',
            classIndex: this.getIndexOfClassType(!!obj ? obj.classType : ''),
            time: !!obj ? obj.classTime : '',
            classFee: !!obj ? obj.fee : 0,
            html: !!this.data.content ? this.data.content.content : '',
            image_src: !!this.data.cover ? (this.data.http + this.data.cover.url) : ''
        });
    },
    getIndexOfClassType: function(type) {
        let idx = -1;
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
                isEditorReturn: 0,
                html: !!this.data.content ? this.data.content.content : '',
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
    bindInput: function(e) {
        this.setData({
            classFee: parseInt(e.detail.value)
        });
    },
    fireToContent: function() {
        // 设置当前准备接受编辑器传回的内容
        this.setData({
            isEditorReturn: 0
        });
        editor.goingToEditor("课程简介", (!!this.data.content ? this.data.content.id : 0), this.data.html);
    },
    fireToSave: function() {
        console.log(this.data)
        let isNew = !!this.course ? false : true;
        api.post(isNew ? api.courseAdd : api.courseEdit, {
            id: !!this.data.course ? this.data.course.id : 0,
            name: this.data.name,
            cover: !!this.data.cover ? this.data.cover.id : 0,
            classType: this.data.classTypes[this.data.classIndex],
            classTime: this.data.time,
            classFee: this.data.classFee,
            content: !!this.data.content ? this.data.content.id : 0
        }, res => {
            console.log(res)
            // 返回上一页
            wx.navigateBack({
                delta: 1
            });
        });
    }
})
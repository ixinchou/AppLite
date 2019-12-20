// pages/speciality/edit/edit.js

const app = getApp().globalData;

Page({

    /**
     * 页面的初始数据
     */
    data: {
        http: app.api.http + "/",
        uploadAble: false,
        course: null,
        content: null,
        cover: null,
        name: '',
        time: '',
        classTypes: [],
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
        if (!app.api.isEmpty(data)) {
            obj = JSON.parse(options.data);
        }
        this.setData({
            uploadAble: app.myInfo.uploadAble,
            course: obj,
            content: !!obj ? obj.content : null,
            cover: !!obj ? obj.cover : null,
        });
        this.retriveCourse();
        this.fetchingClassTypes();
    },
    fetchingClassTypes: function() {
        let that = this;
        app.api.get(app.api.termList, null, res => {
            that.setData({
                classTypes: res.data.list
            });
            if(!!that.data.course){
                that.setData({
                    classIndex: that.getTermIndex(that.data.course.classType)
                });
            }
        });
    },
    retriveCourse: function() {
        let obj = this.data.course;
        if (null == obj) {
            return;
        }
        this.setData({
            name: !!obj ? obj.name : '',
            classIndex: !!obj ? this.getTermIndex(obj.classType) : 0,
            time: !!obj ? obj.classTime : '',
            classFee: !!obj ? (obj.fee / 100) : 0,
            html: !!this.data.content ? this.data.content.content : '',
            image_src: !!this.data.cover ? (this.data.http + this.data.cover.url) : ''
        });
    },
    getTermIndex: function(tid) {
        let val = 0;
        this.data.classTypes.forEach((item, index) => {
            if (item.id == tid) {
                val = index;
                return;
            }
        });
        return val;
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
        app.file.choose({
            type: 'image',
            count: 1,
            success: res => {
                console.log(res);
                that.setData({
                    image_src: res.path
                })
                // 文件选择成功，查询远程服务器上是否有相同记录
                app.file.checkRemoteFile({
                    signature: res.signature,
                    success: data => {
                        console.log("远程服务器上存在相同文件可以直接使用，不需要上传");
                        that.setData({
                            cover: data,
                            image_src: this.data.http + data.url
                        });
                    },
                    fail: () => {
                        console.log("远程服务器上不存在相同文件，需要上传");
                        app.api.upload(res, data => {
                            console.log(data);
                            that.setData({
                                cover: data,
                                image_src: this.data.http + data.url
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
        var id = e.currentTarget.id;
        var value = e.detail.value;
        switch (id) {
            case "name":
                this.setData({
                    name: value
                });
                break;
            case "fee":
                this.setData({
                    classFee: parseInt(value)
                });
                break;
            case "time":
                this.setData({
                    time: value
                });
                break;
        }
    },
    fireToContent: function() {
        // 设置当前准备接受编辑器传回的内容
        this.setData({
            isEditorReturn: 0
        });
        app.editor.goingToEditor("课程简介", (!!this.data.content ? this.data.content.id : 0), this.data.html);
    },
    fireToSave: function() {
        if (app.api.isEmpty(this.data.name)) {
            app.api.toast("名称不能为空", "none");
            return;
        }
        let isNew = !!this.data.course ? false : true;
        app.api.post(isNew ? app.api.courseAdd : app.api.courseEdit, {
            id: !!this.data.course ? this.data.course.id : 0,
            name: this.data.name,
            cover: !!this.data.cover ? this.data.cover.id : 0,
            classType: this.data.classTypes[this.data.classIndex].id,
            classTime: this.data.time,
            classFee: this.data.classFee * 100,
            content: !!this.data.content ? this.data.content.id : 0
        }, res => {
            // 设置上一页的内容
            app.page.setPreviousData({
                item: res.data,
                isEditorReturn: 1
            });
            // 返回上一页
            app.page.back();
        });
    }
})
// pages/speciality/edit/edit.js

var file = require('../../../file.js');
var api = require('../../../config.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        name: '舞蹈',
        time: '周一到周日',
        description: '哈哈',
        image_src: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {

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
                        that.insertUploaded(api.http + "/" + data.url);
                    },
                    fail: () => {
                        console.log("远程服务器上不存在相同文件，需要上传");
                        api.upload(res, data => {
                            console.log(data);
                            //that.insertUploaded(api.http + "/" + data.url);
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
    }
})
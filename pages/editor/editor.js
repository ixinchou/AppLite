// pages/editor/editor.js
const storage = require("../../storage.js");
var sMD5 = require('../../utils/spark-md5.js')
Page({

    /**
     * 页面的初始数据
     */
    data: {
        formats: {},
        readOnly: false,
        placeholder: '开始输入...',
        editorHeight: 300,
        keyboardHeight: 0,
        isIOS: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        const platform = wx.getSystemInfoSync().platform
        const isIOS = platform === 'ios'
        this.setData({
            isIOS
        })
        const that = this
        this.updatePosition(0)
        let keyboardHeight = 0
        wx.onKeyboardHeightChange(res => {
            if (res.height === keyboardHeight) return
            const duration = res.height > 0 ? res.duration * 1000 : 0
            keyboardHeight = res.height
            setTimeout(() => {
                wx.pageScrollTo({
                    scrollTop: 0,
                    success() {
                        that.updatePosition(keyboardHeight)
                        that.editorCtx.scrollIntoView()
                    }
                })
            }, duration)
        });
        wx.setNavigationBarTitle({
            title: storage.get(storage.EDITOR_TITLE)
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

    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {},

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

    readOnlyChange() {
        this.setData({
            readOnly: !this.data.readOnly
        })
    },

    updatePosition(keyboardHeight) {
        const toolbarHeight = 50
        const {
            windowHeight,
            platform
        } = wx.getSystemInfoSync()
        let editorHeight = keyboardHeight > 0 ? (windowHeight - keyboardHeight - toolbarHeight) : windowHeight
        this.setData({
            editorHeight,
            keyboardHeight
        })
    },
    calNavigationBarAndStatusBar() {
        const systemInfo = wx.getSystemInfoSync()
        const {
            statusBarHeight,
            platform
        } = systemInfo
        const isIOS = platform === 'ios'
        const navigationBarHeight = isIOS ? 44 : 48
        return statusBarHeight + navigationBarHeight
    },
    onEditorReady() {
        const that = this
        wx.createSelectorQuery().select('#editor').context(function(res) {
            that.editorCtx = res.context;
            that.resetHtmlContent();
        }).exec();
    },
    /**
     * 重设编辑器中的内容等待编辑
     */
    resetHtmlContent() {
        this.editorCtx.setContents({
            html: storage.get(storage.EDITOR_CONTENT),
            success: res => {
                console.log(res);
            },
            fail: res => {
                console.log(res);
            }
        });
    },
    saveContents() {
        let that = this;
        this.editorCtx.getContents({
            success: function(res) {
                storage.set(storage.EDITOR_CONTENT, res.html);
                that.setPreviewPage();
                // 返回上一页
                wx.navigateBack({
                    delta: 1
                });
            }
        });
    },
    setPreviewPage() {
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        prePage.setData({
            isEditorReturn: 1
        });
    },
    blur() {
        this.editorCtx.blur()
    },
    format(e) {
        let {
            name,
            value
        } = e.target.dataset
        if (!name) return
        // console.log('format', name, value)
        this.editorCtx.format(name, value)

    },
    onStatusChange(e) {
        const formats = e.detail
        this.setData({
            formats
        })
    },
    insertDivider() {
        this.editorCtx.insertDivider({
            success: function() {
                console.log('insert divider success')
            }
        })
    },
    clear() {
        this.editorCtx.clear({
            success: function(res) {
                console.log("clear success")
            }
        })
    },
    removeFormat() {
        this.editorCtx.removeFormat()
    },
    insertDate() {
        const date = new Date()
        const formatDate = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
        this.editorCtx.insertText({
            text: formatDate
        })
    },
    insertImage() {
        const that = this
        wx.chooseImage({
            count: 1,
            success: function(res) {
                // console.log(res);
                // wx.getFileSystemManager().readFile({
                //     filePath: res.tempFilePaths[0],
                //     success: res => {
                //         console.log(res);
                //         var spark = new sMD5.ArrayBuffer();
                //         spark.append(res.data);
                //         var hexHash = spark.end(false);
                //         console.log(hexHash);
                //     }
                // });
                var obj = {};
                wx.getFileInfo({
                    filePath: res.tempFilePaths[0],
                    digestAlgorithm: 'sha1',
                    success: res => {
                        obj.size = res.size;
                        obj.signature = res.digest;
                        console.log(obj);
                        wx.getImageInfo({
                            src: res.tempFilePaths[0],
                            success: res => {
                                obj.height = res.height;
                                obj.width = res.width;
                                console.log(obj);
                            }
                        });
                    }
                });
                that.editorCtx.insertImage({
                    src: res.tempFilePaths[0],
                    data: {
                        id: 'abcd',
                        role: 'god'
                    },
                    width: '80%',
                    success: function() {
                        //console.log('insert image success')
                    }
                })
            }
        })
    }
})
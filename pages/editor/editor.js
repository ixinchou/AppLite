// pages/editor/editor.js
const app = getApp().globalData;
Page({

    /**
     * 页面的初始数据
     */
    data: {
        content: null,
        formats: {},
        // 附件列表
        attachments: [],
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
        this.setData({
            content: app.editor.getContent()
        });
        const platform = wx.getSystemInfoSync().platform
        const isIOS = platform === 'ios'
        this.setData({
            isIOS
        });
        const that = this;
        this.updatePosition(0);
        let keyboardHeight = 0;
        wx.onKeyboardHeightChange(res => {
            if (res.height === keyboardHeight) return
            const duration = res.height > 0 ? res.duration * 1000 : 0;
            keyboardHeight = res.height;
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
            title: app.storage.get(app.storage.EDITOR_TITLE)
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
        let that = this;
        this.editorCtx.setContents({
            html: app.storage.get(app.storage.EDITOR_CONTENT),
            success: res => {
                //console.log(res);
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
                app.storage.set(app.storage.EDITOR_CONTENT, res.html);
                // 添加或更新图文内容
                let data = that.data.content;
                app.api.post(data.id > 0 ? app.api.contentEdit : app.api.contentAdd, {
                    id: data.id,
                    content: res.html
                }, res => {
                    app.page.setPreviousData({
                        content: res.data,
                        // 返回给前一页所有附件列表
                        attachments: that.data.attachments,
                        isEditorReturn: 1
                    });
                    // 返回上一页
                    app.page.back();
                });
            }
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
        const that = this;
        app.file.choose({
            type: 'image',
            count: 1,
            success: res => {
                console.log(res);
                // 文件选择成功，查询远程服务器上是否有相同记录
                app.file.checkRemoteFile({
                    signature: res.signature,
                    success: data => {
                        that.cacheAttachmentIds(data);
                        that.insertUploaded(data.url);
                    },
                    fail: () => {
                        console.log("远程服务器上不存在相同文件，需要上传");
                        app.api.upload(res, data => {
                            console.log(data);
                            that.cacheAttachmentIds(data);
                            that.insertUploaded(data.url);
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
    insertUploaded(url) {
        console.log(url);
        this.editorCtx.insertImage({
            src: app.api.http + "/" + url,
            width: '90%'
        });
    },
    cacheAttachmentIds: function(data) {
        let exists = this.data.attachments.filter(item => {
            return item == data.id;
        });
        if (null == exists || exists.length <= 0) {
            let array = this.data.attachments;
            array.push(data.id);
            this.setData({
                attachments: array
            });
        }
    }
})
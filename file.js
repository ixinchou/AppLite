var api = require('./config.js');
var file = {
    option: {
        type: 'image', // 文件选择类型，可选为 image/video
        count: 1,
        success: null,
        fail: null
    },
    /**
     * 选择文件
     */
    choose: function(opt) {
        this.option = opt;
        switch (this.option.type) {
            case "image":
                this.chooseImage(this.option);
                break;
            case "video":
                break;
        }
    },
    /**
     * 选择图片
     */
    chooseImage: function(opt) {
        let that = this;
        wx.chooseImage({
            count: opt.count,
            success: function(res) {
                var obj = {};
                obj.path = res.tempFilePaths[0];
                that.getFileInfo(res.tempFilePaths[0], data => {
                    // 获取文件的长度和 sha1 签名
                    obj.size = data.size;
                    obj.signature = data.signature;
                    // 然后再获取图片的宽高信息
                    that.getImageInfo(res.tempFilePaths[0], res => {
                        obj.width = res.width;
                        obj.height = res.height;
                        if (opt.success) {
                            opt.success(obj);
                        }
                    });
                });
            },
        })
    },
    /**
     * 获取文件的长度和 sha1 签名
     */
    getFileInfo(path, success) {
        let that = this;
        wx.getFileInfo({
            filePath: path,
            digestAlgorithm: 'sha1',
            success: res => {
                success({
                    size: res.size,
                    signature: res.digest
                });
            },
            fail: res => {
                console.log(res);
                if (that.option.fail) {
                    fail(res);
                }
            }
        });
    },
    /**
     * 获取图片的宽高信息
     */
    getImageInfo(path, success) {
        let that = this;
        wx.getImageInfo({
            src: path,
            success: res => {
                success({
                    height: res.height,
                    width: res.width
                });
            },
            fail: res => {
                console.log(res);
                if (that.option.fail) {
                    fail(res);
                }
            }
        });
    },
    /**
     * 检索远程文件是否存在
     */
    checkRemoteFile(option) {
        api.get(api.fileCheck + "/" + option.signature, null, data => {
            if (data.data) {
                // 有数据
                if (option.success) {
                    option.success(data.data);
                }
            } else {
                if (option.fail) {
                    option.fail();
                }
            }
        });
    },
}
module.exports = file;
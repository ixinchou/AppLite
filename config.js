// 主域名
var http = "http://192.168.80.173";
var host = `${http}:8082`; //"https://edu.ixchou.com";

// 配置对象
var config = {
    POST: `POST`,
    GET: `GET`,
    http,
    host,

    // 热点轮播图列表
    hotImgUrl: `${host}/api/hotImages`,

    // 分类列表
    classesList: `${host}/api/classesList`,

    // 微信信息
    wxInfo: `${host}/api/wx/registry`,

    // 解密微信绑定的手机号码
    wxPhone: `${host}/api/wx/phone`,

    // 通过 sessionId 查找用户信息
    findMemberBySessionId: `${host}/api/member/find/`,
    // 更新名字
    updateMemberName: `${host}/api/member/update/name`,

    // 添加孩子的信息
    childAdd: `${host}/api/child/add`,
    // 孩子信息列表
    childList: `${host}/api/child/list/`,
    // 删除孩子信息
    childDelete: `${host}/api/child/delete/`,
    /**
     * 添加校训
     */
    mottoAdd: `${host}/api/motto/insert`,
    /**
     * 编辑校训
     */
    mottoEdit: `${host}/api/motto/update`,
    /**
     * 获取校训
     */
    mottoGet: `${host}/api/motto/get`,
    /**
     * 查询远程服务器上是否有相同文件
     */
    fileCheck: `${host}/api/attachment/query`,
    /**
     * 上传文件
     */
    fileUpload: `${host}/api/attachment/upload`,
    /**
     * 富文本内容添加
     */
    contentAdd: `${host}/api/content/add`,
    /**
     * 富文本内容编辑
     */
    contentEdit: `${host}/api/content/update`,
    /**
     * 拉取课程列表
     */
    courseList: `${host}/api/course/list`,
    /**课程添加 */
    courseAdd: `${host}/api/course/add`,
    /**课程编辑 */
    courseEdit: `${host}/api/course/update`,

    // 显示加载中界面
    showLoading: function(title) {
        wx.showLoading({
            title: title,
            mask: true,
        });
    },

    // 隐藏加载对话框
    hideLoading: function() {
        wx.hideLoading();
    },

    // 显示短时间的提示信息
    toast: function(title, icon) {
        wx.showToast({
            title: title,
            icon: icon,
            duration: 2000
        });
    },
    // 判断对象是否为null
    isEmpty: function(obj) {
        if (null == obj) {
            return true;
        }
        let type = typeof(obj);
        if ("undefined" === type) {
            return true;
        }
        if ("string" === type) {
            return obj.length <= 0;
        }
        return false;
    },
    // 拉取远程服务器上的数据
    fetchingData: function(url, params, usedMethod, callback) {
        config.showLoading("加载数据，请稍候...");
        wx.request({
            url: url,
            method: usedMethod,
            data: params,
            success: res => {
                config.hideLoading();
                callback(res);
            },
            fail: res => {
                config.hideLoading();
            }
        });
    },
    // GET方式拉取远程服务器上的数据
    get: function(url, params, success, failure) {
        this.fetchingData(url, params, this.GET, function(res) {
            if (res.data.code === "000") {
                if (null != success) {
                    success(res.data);
                }
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none'
                });
                if (null != failure) {
                    failure(res.data);
                }
            }
        });
    },
    // POST方式获取远程服务器上的数据
    post: function(url, params, success, failure) {
        this.fetchingData(url, params, this.POST, function(res) {
            if (res.data.code === "000") {
                if (null != success) {
                    success(res.data);
                }
            } else {
                wx.showToast({
                    title: res.data.message,
                    icon: 'none'
                });
                if (null != failure) {
                    failure(res.data);
                }
            }
        });
    },
    /**
     * 上传文件
     */
    upload: function(file, success, failure) {
        config.showLoading("上传中，请稍候...");
        let that = this;
        wx.uploadFile({
            url: that.fileUpload,
            filePath: file.path,
            name: 'file',
            formData: {
                // 其他额外参数列表
                size: file.size,
                signature: file.signature,
                width: file.width,
                height: file.height
            },
            success: res => {
                config.hideLoading();
                var data = JSON.parse(res.data);
                if (data.code === "000") {
                    if (success) {
                        success(data.data);
                    }
                } else {
                    if (failure) {
                        failure(data);
                    }
                }
            },
            fail: res => {
                config.hideLoading();
                if (failure) {
                    failure(res);
                }
            }
        })
    }
}
module.exports = config;
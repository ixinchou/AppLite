/**
 * 微信本地缓存方法集成
 */
var storage = {
    /**
     * 本地缓存的 session 名字
     */
    IXCHOU_SESSION: `ixchou_session`,
    /**
     * 是否具有管理员功能
     */
    IXCHOU_ADMIN: `ixchou_upload_able`,
    /**
     * 编辑器标题
     */
    EDITOR_TITLE: `ixchou_editor_title`,
    /**
     * 编辑器内容
     */
    EDITOR_CONTENT: `ixchou_editor_content`,
    /**编辑器编辑对象id */
    EDITOR_ID: `ixchou_editor_id`,
    /**
     * 本地缓存的课程id
     */
    COURSE_ID: `ixchou_course_id`,
    /**
     * 获取本地存储的内容
     */
    get: function(key) {
        return wx.getStorageSync(key);
    },
    /**
     * 异步获取本地缓存的数据 
     * */
    getAsync: function(key, callback) {
        wx.getStorage({
            key: key,
            success(res) {
                if (null != callback) {
                    callback(res.data);
                }
                console.log(res.data)
            }
        });
    },
    /**
     * 设置本地存储内容
     */
    set: function(key, value) {
        wx.setStorageSync(key, value);
    },
    /**
     * 异步存储数据到缓存
     */
    setAsync: function(key, value, callback) {
        wx.setStorage({
            key: key,
            data: value,
            success(res) {
                if (null != callback) {
                    callback();
                }
            }
        })
    }
}
module.exports = storage;
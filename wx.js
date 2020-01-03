/**微信功能工具类 */
var api = require('./api.js')
var wx_utils = {
    showDialog: function(params) {
        let {
            text,
            confirmText,
            cancelText,
            onConfirm,
            onCancel
        } = params;

        wx.showModal({
            content: text,
            confirmText: api.isEmpty(confirmText) ? '确定' : confirmText,
            cancelText: api.isEmpty(cancelText) ? '取消' : cancelText,
            success(res) {
                if (res.confirm) {
                    if (null != onConfirm) {
                        onConfirm();
                    }
                } else {
                    if (null != onCancel) {
                        onCancel();
                    }
                }
            }
        });
    }
}

module.exports = wx_utils;
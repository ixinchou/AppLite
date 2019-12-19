var storage = require('./storage.js');
var editor = {
    /**
     * 转到编辑器并设置需要编辑的内容和标题
     */
    goingToEditor: function(title, content) {
        // 设置标题
        storage.set(storage.EDITOR_TITLE, title);
        // 设置已有的内容
        storage.set(storage.EDITOR_CONTENT, content);
        // 打开编辑器
        wx.navigateTo({
            url: '/pages/editor/editor',
        });
    },
    /**
     * 清空本地缓冲的大量 html 代码
     */
    clearEditorContent: function() {
        storage.set(storage.EDITOR_CONTENT, "");
        storage.set(storage.EDITOR_TITLE, "");
    }
}
module.exports = editor;
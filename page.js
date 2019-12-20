var page = {
    /**为前一页面设置缓存以传递内容 */
    setPreviousData: function(data) {
        var pages = getCurrentPages();
        var prePage = pages[pages.length - 2];
        prePage.setData(data);
    },
    /**返回上一页 */
    back: function() {
        wx.navigateBack({
            delta: 1
        });
    }
}
module.exports = page;
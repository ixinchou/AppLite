// components/childBindDialog/childBindDialog.js
const util = require('../../utils/util.js')

Component({
    /**
     * 组件的属性列表
     */
    properties: {
        dialogTitle: {
            type: String,
            value: "对话框标题"
        },
        dialogContent: {
            type: String,
            value: "对话框内容"
        },
        dialogConfirmText: {
            type: String,
            value: "确定"
        },
        dialogCancelText: {
            type: String,
            value: "取消"
        }
    },

    /**
     * 组件的初始数据
     */
    data: {
        isShowning: false,
        childName: "",
        childAge: "",
        childSex: 1,
        childNamePlaceHolder: "孩子的名字",
        childAgePlaceHolder: "孩子的年龄",
        childBirthday: util.formatDate(new Date()),
        pickerEndDate: util.formatDate(new Date())
    },

    /**
     * 组件的方法列表
     */
    methods: {
        /**
         * 隐藏对话框
         */
        hideDialog: function() {
            this.setData({
                isShowning: false
            });
        },
        /**
         * 显示对话框 
         */
        showDialog: function() {
            this.setData({
                isShowning: true,
                childName: "",
                childAge: "",
                childBirthday: util.formatDate(new Date()),
                childSex: 1
            });
        },
        /**
         * 确定事件
         */
        _confirmEvent: function() {
            if (this.data.childName == "") {
                wx.showToast({
                    title: '名字不能为空',
                    icon: 'none'
                });
            } else {
                this.triggerEvent("confirmEvent");
            }
        },
        /**
         * 取消事件
         */
        _cancelEvent: function() {
            this.triggerEvent("cancelEvent");
        },
        radioChange: function(e) {
            var v = e.detail.value;
            this.setData({
                childSex: v == "boy" ? 1 : 0
            });
        },
        getBindData: function() {
            return this.data;
        },
        bindDateChange: function(e) {
            var date = util.parseDate(e.detail.value);
            this.setData({
                childBirthday: e.detail.value,
                childAge: util.calcluateAge(date)
            })
        },
        bindInput: function(e) {
            var id = e.currentTarget.id;
            var value = e.detail.value;
            if (id == "name") {
                this.setData({
                    childName: value
                });
            } else if (id == "age") {
                try {
                    var age = parseInt(value);
                    this.setData({
                        childAge: age
                    });
                } catch (err) {
                    wx.showToast({
                        title: '请输入数字',
                        icon: 'none',
                        duration: 2000
                    });
                }
            }
        }
    }
})
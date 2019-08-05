// components/singleInputDialog/singleInputDialog.js
Component({
    /**
     * 组件的属性列表
     */
    properties: {
        dialogTitle: {
            type: String,
            value: "对话框标题"
        },
        inputPlaceHolder: {
            type: String,
            value: "对话框输入提示"
        },
        inputType: {
            type: String,
            value: "text"
        },
        maxLength: {
            type: Number,
            value: 10
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
        inputValue: ""
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
                inputValue: ""
            });
        },
        // bindblur: function(e) {
        //     console.log(e)
        //     var id = e.currentTarget.id;
        //     var value = e.detail.value;
        //     if (id == "input") {
        //         this.setData({
        //             inputValue: value
        //         });
        //     }
        // },
        bindInput: function(e) {
            this.setData({
                inputValue: e.detail.value
            })
        },
        /**
         * 确定事件
         */
        _confirmEvent: function() {
            this.triggerEvent("confirmEvent");
        },
        /**
         * 取消事件
         */
        _cancelEvent: function() {
            this.triggerEvent("cancelEvent");
        }
    }
})
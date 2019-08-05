const formatTime = date => {
    const year = date.getFullYear()
    const month = date.getMonth() + 1
    const day = date.getDate()
    const hour = date.getHours()
    const minute = date.getMinutes()
    const second = date.getSeconds()

    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = date => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();

    return [year, month, day].map(formatNumber).join('-');
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const parseDate = str => {
    var separator = str.indexOf('-') > 0 ? '-' : '/';
    var arr = str.split(separator);
    var year = parseInt(arr[0]);
    var month;
    //处理月份为04这样的情况                         
    if (arr[1].indexOf("0") == 0) {
        month = parseInt(arr[1].substring(1));
    } else {
        month = parseInt(arr[1]);
    }
    var day = parseInt(arr[2]);

    var date = new Date(year, month - 1, day);
    return date;
}

const calculateAge = date => {
    var now = new Date();
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    var that = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    var ages = 0;

    if (today.getFullYear() == that.getFullYear()) {
        // 年数相等则0岁
        ages = 0;
    } else {
        // 年数不想等
        ages = today.getFullYear() - that.getFullYear();
        if (today.getMonth() == that.getMonth()) {
            // 生日月，看日期
            var dayDiff = today.getDate() - that.getDate();
            if (dayDiff < 0) {
                // 不到生日，年龄-1
                ages -= 1;
            }
        } else {
            var monthDiff = today.getMonth() - that.getMonth();
            if (monthDiff < 0) {
                ages -= 1;
            }
        }
    }
    // var interval = today - that;
    // var days = Math.floor(Math.abs(interval) / 1000 / 60 / 60 / 24);
    // console.log(days);

    return ages;
}

module.exports = {
    formatTime: formatTime,
    formatDate: formatDate,
    parseDate: parseDate,
    calculateAge: calculateAge,
}
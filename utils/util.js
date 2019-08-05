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
    var today = new Date(now.getFullYear(), now.getMonth(), now.getDay());
    var that = new Date(date.getFullYear(), date.getMonth(), date.getDay());
    var days = parseInt(Math.abs(today - that) / 1000 / 60 / 60 / 24);

    return Math.floor(days / 365);
}

module.exports = {
    formatTime: formatTime,
    formatDate: formatDate,
    parseDate: parseDate,
    calculateAge: calculateAge,
}
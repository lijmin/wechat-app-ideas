const formatTime = (date, pattern) => {
    const year = formatNumber(date.getFullYear())
    const month = formatNumber(date.getMonth() + 1)
    const day = formatNumber(date.getDate())
    const hour = formatNumber(date.getHours())
    const minute = formatNumber(date.getMinutes())
    const second = formatNumber(date.getSeconds())

    return pattern.replace(new RegExp('yyyy', 'g'), year).replace(new RegExp('MM','g'), month).replace(new RegExp('dd','g'), day).replace(new RegExp('hh','g'), hour).replace(new RegExp('mm','g'),minute).replace(new RegExp('ss','g'), second)
}

const formatNumber = n => {
    n = n.toString()
    return n[1] ? n : '0' + n
}

const coverPhone = phone => {
    return phone.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
}

module.exports = {
    formatTime: formatTime,
    coverPhone: coverPhone
}
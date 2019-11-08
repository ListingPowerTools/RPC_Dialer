function parseTime(timeString) {
    try {
        return new Date(timeString);
    } catch (e) {
        return null;
    }
}
function validateOptions(options, types) {
    for (const key in options) {
        if (key in types && !types[key](options[key])) {
            throw new TypeError(`Option key: ${key} does not meet the required type.`);
        }
    }
    return true;
}

module.exports = {
    parseTime: parseTime,
    validateOptions: validateOptions
}
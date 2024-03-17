const getCurrentDateInDeviceFormat = () => {
    let x = new Date();
    return `0${x.getDay()}-0${x.getMonth()}-${x.getFullYear().toString().split('0')[1]} ${x.getHours()}:${x.getMinutes()}:${x.getSeconds()}`
};
exports.getUserFromToken = getCurrentDateInDeviceFormat;

const extractDateInMins = (date) => {
    //date format: dd-mm-yyyy hh
    
};
exports.extractDateInMins = extractDateInMins;
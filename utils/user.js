jwtContainer = require("../middleware/json_web_token");

const getUserFromToken = (data) => {
    const authHeader = data.headers['authorization'] 
    const accessToken = authHeader && authHeader.split(' ')[1]
    return currentUser = jwtContainer.getCurrentUser(accessToken);
};
exports.getUserFromToken = getUserFromToken;
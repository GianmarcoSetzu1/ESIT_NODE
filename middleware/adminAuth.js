const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization'); //req.headers['authorization'];
    if (!authHeader) {
        const error = new Error('Not authenticated!');
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken;
    try {
        decodedToken = jwt.verify(token, 'secretfortoken');
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }
    if (!decodedToken) {
        const error = new Error('Not authenticated!');
        error.statusCode = 401;
        throw error;
    }
    req.isLoggedIn = true;
    req.userId = decodedToken.userId;
    req.email = decodedToken.email;
    if (req.userId !== 0) {
        const error = new Error('Not Admin!');
        error.statusCode = 401;
        throw error;
    }
    next();
};
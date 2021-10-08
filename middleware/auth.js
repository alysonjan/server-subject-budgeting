const jwt = require('jsonwebtoken');
const CryptoJS = require('crypto-js');


module.exports = function(req,res,next) {

    //Get token from header
    const token = req.header('x-auth-token');

    //Check if not token 
    if (!token) {
        return res.status(401).json({ msg: 'No token, Authorization Denied' });
    }

    //Verify token
    try {
        const hashedToken = CryptoJS.AES.decrypt(token,process.env.hashKey);
        const decryptedToken = hashedToken.toString(CryptoJS.enc.Utf8)
        const decoded = jwt.verify( decryptedToken,process.env.jwtSecret);
        req.user = decoded;
        next();

    } catch (err) {
        res.status(401).json({ msg: 'Token is not Valid' })
        
    }
}
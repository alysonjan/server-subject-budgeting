const express = require('express');
const router = express.Router();
const bcrpyt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {check, validationResult} = require('express-validator');
const CryptoJS = require('crypto-js');
const db = require('../../../config/database');
//const auth = require('../../../middleware/auth');


// @route GET api/auth
// @desc Test Route
// @access Public
// router.get('/auth', auth, async (req,res) => {

//     const {id} = req.user.id
//     try {
//         //const user = await User.findById(req.user.id).select('-password');
//         //res.json(user);
//         const sqlAuth = "SELECT userid,lastname,firstname,middlename,birthdate,gender,address,contact_number,email_address,college FROM user_profile WHERE userid = ?";
//         db.query(sqlAuth,id, (err,result)=>{
//             if (err){
//                 res.status(400).json({ errors: [{ msg: 'Invalid Token'}] });
//             }else{
//                 res.json(result)
//             }
//         });
//     } catch (err) {
//         console.error(err.message);
//         res.status(500).send('Server Error');
//     }
// });






// @route POST api/users
// @description Login User
// @access Public
router.post('/login', [
    check('email', "Please include a valid email").isEmail(),
    check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8}),
],
async(req,res) =>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }
    const { email, password, college } = req.body;

    try {
        const sqlLogin = "SELECT * FROM user_profile WHERE email = ?";
        db.query(sqlLogin, [email,college], (err,result) => {

            if (err) res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}] });

            if (result.length > 0) {
                bcrpyt.compare(password, result[0].password, (error, response) =>{

                    if (error){
                        return res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}] });
                    }else{
                        if (response === true){
                            const payload = {
                                user: {
                                    response:response,
                                    userID: result[0].userid
                                }
                            }
                            const token = jwt.sign(payload, process.env.jwtSecret, {expiresIn: process.env.JWT_EXPIRES_IN} )
                            const encryptedToken = CryptoJS.AES.encrypt(token, process.env.hashKey).toString();
                            let role = result[0].role
                            res.json({role,encryptedToken}); 

                        }else if (response === false){
                            res.status(400).json({ errors: [{ msg: 'Password does not match'}] });
                        }
                        else{
                            res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}] });
                        }
                    }
                });
            }else{
                res.status(400).json({ errors: [{ msg: 'Invalid Credentials'}] });
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


module.exports = router;
const express = require('express');
const router = express.Router();
const bcrpyt = require('bcryptjs');
const {check, validationResult} = require('express-validator');
const db = require('../../../config/database');
const auth = require('../../../middleware/auth');
const saltRounds = 10;

// @route POST api/user-profile
// @description Read User Profile
// @access Private

router.get('/', async(req,res) => {
    try {
        const sqlSelectUserProfile = "SELECT * FROM user_profile";
        db.query(sqlSelectUserProfile, (err, result) => {
            if (err){
                res.status(400).json({ errors: [{ msg: 'Oops, Something went wrong'}] });  
            }else{
                res.json({result})  
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/user-profile
// @description Register User
// @access Private
router.post('/add',[auth, 
    [
        check('lastname', "Lastname is required").not().isEmpty(),
        check('firstname', "Firstname is required").not().isEmpty(),
        check('birthdate', "Birthdate is required").not().isEmpty(),
        check('gender', "Gender is required").not().isEmpty(),
        check('address', "Address is required").not().isEmpty(),
        check('contact_number', "Contact is required").not().isEmpty(),
        check('email_address', "Please include a valid email").isEmail(),
        check('password', 'Please enter a password with 8 or more characters').isLength({ min: 8}),
        check('role', "Role is required").not().isEmpty(),
    ]
],
async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }
    const {  lastname, firstname, middlename, birthdate, gender, address, contact_number, email_address, password, role } = req.body;
    const hashedPassword = await bcrpyt.hash(password, saltRounds);

    try {
        sqlRegister = "INSERT INTO user_profile (lastname,firstname,middlename,birthdate,gender,address,contact_number,email_address,password,role) VALUES (?,?,?,?,?,?,?,?,?,?)";
        db.query(sqlRegister, [lastname, firstname, middlename, birthdate, gender, address, contact_number, email_address, hashedPassword, role], (err, result) => {
            if (err){
                res.status(400).json({ errors: [{ msg: 'Please check your Credentials'}] });
            }else{
                res.status(200).json({ response: [{result, msg: 'Successfully added'}] });   
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/user-profile
// @description Update User Profile
// @access Private

router.put('/update', [auth, 
    [
        check('firstname', "Firstname is required").not().isEmpty(),
        check('lastname', "Lastname is required").not().isEmpty(),
        check('birthdate', "Birthdate is required").not().isEmpty(),
        check('gender', "Gender is required").not().isEmpty(),
        check('address', "Address is required").not().isEmpty(),
        check('contact_number', "Contact is required").not().isEmpty(),
        check('email_address', "Please include a valid email").isEmail(),
        check('role', "Role is required").not().isEmpty(),
    ]
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }
    const { userid, lastname, firstname, middlename, birthdate, gender, address, contact_number, email_address, role } = req.body;

    try {
        sqlUpdateUserProfile = "UPDATE user_profile SET lastname=?, firstname=?, middlename=?, birthdate=?, gender=?, address=?, contact_number=?, email_address=?, role=? WHERE userid =?"; 
        db.query(sqlUpdateUserProfile, [lastname, firstname, middlename, birthdate, gender, address, contact_number, email_address, role, userid], (err, result) => {
            if (err){
                res.status(400).json({ errors: [{ msg: 'Oops, something went wrong'}] });
            }else{
                res.status(200).json({ response: [{result, msg: 'Successfully added'}] });   
            }
        });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/user-profile
// @description Delete User Profile
// @access Private

router.delete('/delete',auth, async(req,res) =>{
    const { userid } = req.body;
    try {
        const sqlDeleteUserProfile = "DELETE FROM user_profile WHERE userid = ?";
        db.query(sqlDeleteUserProfile, userid, (err, result)=>{
            if (err){
                res.status(400).json({ errors: [{ msg: 'Oops, Something went wrong'}] });   
            }else{
                res.status(200).json({ response: [{result, msg: 'Successfully deleted'}] });   
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const db = require('../../../config/database');
const auth = require('../../../middleware/auth');

// @route POST api/Employee
// @description Read Employee
// @access Private
router.get('/', async(req,res) => {
    try {
        const sqlSelectEmployee = "SELECT * FROM employees";
        db.query(sqlSelectEmployee, (err, result) => {
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

// @route POST api/Employee
// @description Add Employee
// @access Private
router.post('/add',[auth, 
    [
        check('lastname', "Last name is required").not().isEmpty(),
        check('firstname', "First name is required").not().isEmpty(),
        check('middlename', "Middle name is required").not().isEmpty(),
        check('birthdate', "Birthdate is required").not().isEmpty(),
        check('gender', "Gender is required").not().isEmpty(),
        check('address', "Address is required").not().isEmpty(),
        check('educational_attainment', "Educational Attainment is required").not().isEmpty(),
        check('position', "Position is required").not().isEmpty(),
        check('contact_no', "Contact number is required").not().isEmpty(),
        check('email_address', "Email address is required").not().isEmpty(),
        check('status', "Status is required").not().isEmpty(),
    ]
], async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const { lastname, firstname, middlename, birthdate, gender, address, educational_attainment, position, contact_no, email_address, status } = req.body;
    try {
        sqlInsertEmployee = "INSERT INTO employees (lastname, firstname, middlename, birthdate, gender, address, educational_attainment, position, contact_no, email_address, status) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        db.query(sqlInsertEmployee, [lastname, firstname, middlename, birthdate, gender, address, educational_attainment, position, contact_no, email_address, status], (err, result) => {
            if (err){
                res.status(400).json({ errors: [{ msg: 'Oops, Something went wrong'}] });
            }else{
                res.status(200).json({ response: [{result, msg: 'Successfully added'}] });   
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }

});

// @route PUT api/update/subject
// @description Update Subject
// @access Private

router.put('/update',[auth,
    [
        check('lastname', "Last name is required").not().isEmpty(),
        check('lastname', "Last name is required").not().isEmpty(),
        check('firstname', "First name is required").not().isEmpty(),
        check('middlename', "Middle name is required").not().isEmpty(),
        check('birthdate', "Birthdate is required").not().isEmpty(),
        check('gender', "Gender is required").not().isEmpty(),
        check('address', "Address is required").not().isEmpty(),
        check('educational_attainment', "Educational Attainment is required").not().isEmpty(),
        check('position', "Position is required").not().isEmpty(),
        check('contact_no', "Contact number is required").not().isEmpty(),
        check('email_address', "Email address is required").not().isEmpty(),
        check('status', "Status is required").not().isEmpty(),
    ]
], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { employee_id, lastname, firstname, middlename, birthdate, gender, address, educational_attainment, position, contact_no, email_address, status } = req.body;

    try {
        const sqlUpdateEmployee = "UPDATE employees SET lastname=?, firstname=?, middlename=?, birthdate=?, gender=?, address=?, educational_attainment=?, position=?, contact_no=?, email_address=?, status=? WHERE employee_id = ?";
        db.query(sqlUpdateEmployee, [ lastname, firstname, middlename, birthdate, gender, address, educational_attainment, position, contact_no, email_address, status, employee_id ], (err, result) => {
            if (err){
                res.status(400).json({ errors: [{ msg: 'Oops, Something went wrong'}] });  
            }else{
                res.status(200).json({ response: [{result, msg: 'Successfully updated'}] });   
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route DELETE api/delete/Employee
// @description Delete Employee
// @access Private
router.delete('/delete',auth, async(req,res) =>{
    const { employee_id } = req.body;
    try {
        const sqlDeleteEmployee = "DELETE FROM employees WHERE employee_id = ?";
        db.query(sqlDeleteEmployee, employee_id, (err, result)=>{
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
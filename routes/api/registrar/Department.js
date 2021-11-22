const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const db = require('../../../config/database');
const auth = require('../../../middleware/auth');

// @route POST api/department
// @description Read Department
// @access Private
router.get('/', async(req,res) => {
    try {
        const sqlSelectDepartment = "SELECT * FROM department";
        db.query(sqlSelectDepartment, (err, result) => {
            if (err){
                res.status(400).json({ errors: [{msg: 'Oops, Something went wrong'}] });
            }else{
                res.json({result})  
            }
        });
    } catch (error) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route POST api/add/department
// @description Add Department
// @access Private
router.post('/add', [auth,
    [
        check('college_code', "College code is required").not().isEmpty(),
        check('department_name', "Department Name is required").not().isEmpty(),
        check('department_status', "Status is required").not().isEmpty(),
    ]
],  async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const { college_code, department_name, department_status } = req.body;
    try {
        sqlInsertDepartment = "INSERT INTO department ( college_code, department_name, department_status ) VALUES (?,?,?)";
        db.query(sqlInsertDepartment, [ college_code, department_name, department_status ], (err, result) => {
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

// @route PUT api/update/department
// @description Update Department
// @access Private
router.put('/update', [auth,
    [
        check('college_code', "College code is required").not().isEmpty(),
        check('department_name', "Department Name is required").not().isEmpty(),
        check('status', "Status is required").not().isEmpty(),
    ]
], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { department_id, college_code, department_name, status } = req.body;

    try {
        const sqlUpdateDepartment = "UPDATE department SET department_code=?, college_code=?, department_name=?, status=? WHERE department_id=?";
        db.query(sqlUpdateDepartment, [college_code, department_name, status, department_id], (err,result) => {
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

// @route PUT api/delete/department
// @description Delete Department
// @access Private
router.delete('/delete', auth, async(req,res) => {
    const { department_id } = req.body;
    try {
        const sqlDeleteDepartment = "DELETE FROM department WHERE department_id = ?";
        db.query(sqlDeleteDepartment, department_id, (err, result) => {
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
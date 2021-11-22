const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const db = require('../../../config/database');
const auth = require('../../../middleware/auth');


// @route POST api/college
// @description Read College
// @access Private

router.get('/', async(req,res) => {
    try {
        const sqlSelectCollege = "SELECT * FROM colleges";
        db.query(sqlSelectCollege, (err, result) => {
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

// @route POST api/add/college
// @description Add College
// @access Private
router.post('/add',[auth,
    [
        check('college_code', "College code is required").not().isEmpty(),
        check('college_name', "College name is required").not().isEmpty(),
        check('college_type', "College type is required").not().isEmpty(),
        check('college_status', "Status is required").not().isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }

    const { college_code, college_name, college_type, college_status } = req.body;

    try {
        const sqlInsertCollege = "INSERT INTO colleges (college_code, college_name, college_type, college_status ) VALUES ( ?, ?, ?, ?)";
        db.query(sqlInsertCollege, [college_code, college_name, college_type, college_status], (err,result) =>{
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


// @route PUT api/update/college
// @description Update College
// @access Private
router.put('/update',[auth,
    [
        check('college_code', "College code is required").not().isEmpty(),
        check('college_name', "College name is required").not().isEmpty(),
        check('college_type', "College type is required").not().isEmpty(),
        check('status', "Status is required").not().isEmpty(),
    ]
], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const { college_id, college_code, college_name, college_type, status } = req.body;
    try {
        const sqlUpdateCollege = "UPDATE colleges SET college_code=?, college_name=?, college_type=?, status=? WHERE college_id = ?";
        db.query(sqlUpdateCollege, [ college_code, college_name, college_type, status, college_id ], (err, result) => {
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

// @route DELETE api/delete/college
// @description Delete College
// @access Private
router.delete('/delete',auth, async(req,res) =>{
    const { college_id } = req.body;
    try {
        const sqlDeleteCollege = "DELETE FROM colleges WHERE college_id = ?";
        db.query(sqlDeleteCollege, college_id, (err, result)=>{
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
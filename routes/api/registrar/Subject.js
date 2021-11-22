const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const db = require('../../../config/database');
const auth = require('../../../middleware/auth');

// @route POST api/subjects
// @description Read Subjects
// @access Private
router.get('/', async(req,res) => {
    try {
        const sqlSelectSubject = "SELECT * FROM subjects";
        db.query(sqlSelectSubject, (err, result) => {
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

// @route POST api/subject
// @description Add Subject
// @access Private
router.post('/add',[auth, 
    [
        check('subject_code', "Subject code is required").not().isEmpty(),
        check('subject_name', "Subject name is required").not().isEmpty(),
        check('lec_units', "Lec units is required").not().isEmpty(),
        check('lab_units', "Lab units is required").not().isEmpty(),
        check('subject_type', "Subject type is required").not().isEmpty(),
        check('subject_category', "Subject category is required").not().isEmpty(),
        check('status', "Status is required").not().isEmpty(),
    ]
], async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const { subject_code, subject_name, lec_units, lab_units, subject_type, subject_category, status } = req.body;
    let total_units = parseInt(lec_units) + parseInt(lab_units);
    let lec_teaching_hours = parseInt(lec_units) * 1;
    let lab_teaching_hours = parseInt(lab_units) * 3;
    let total_teaching_hours = parseInt(lec_teaching_hours) + parseInt(lab_teaching_hours);
    try {
        sqlInsertSubject = "INSERT INTO subjects (subject_code, subject_name, lec_units, lab_units, total_units, subject_type, subject_category,lec_teaching_hours,lab_teaching_hours,total_teaching_hours,status) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        db.query(sqlInsertSubject, [subject_code, subject_name, lec_units, lab_units, total_units, subject_type, subject_category, lec_teaching_hours,lab_teaching_hours,total_teaching_hours, status], (err, result) => {
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
        check('subject_code', "Subject code is required").not().isEmpty(),
        check('subject_name', "Subject name is required").not().isEmpty(),
        check('lec_units', "Lec units is required").not().isEmpty(),
        check('lab_units', "Lab units is required").not().isEmpty(),
        check('subject_type', "Subject type is required").not().isEmpty(),
        check('subject_category', "Subject category is required").not().isEmpty(),
        check('lec_teaching_hours', "Lec Teaching hours is required").not().isEmpty(),
        check('lab_teaching_hours', "Lab Teaching hours is required").not().isEmpty(),
        check('status', "Status is required").not().isEmpty(),
    ]
], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {subject_id, subject_code, subject_name, lec_units, lab_units, total_units, subject_type, subject_category,lec_teaching_hours,lab_teaching_hours,total_teaching_hours, status } = req.body;
    try {
        const sqlUpdateSubject = "UPDATE subjects SET subject_code=?, subject_name=?, lec_units=?, lab_units=?, total_units=?, subject_type=?, subject_category=?, lec_teaching_hours=?,lab_teaching_hours=?,total_teaching_hours=?,status=? WHERE subject_id = ?";
        db.query(sqlUpdateSubject, [ subject_code, subject_name, lec_units, lab_units, total_units, subject_type, subject_category,lec_teaching_hours,lab_teaching_hours,total_teaching_hours, status, subject_id ], (err, result) => {
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
    const { subject_id } = req.body;
    try {
        const sqlDeleteSubject = "DELETE FROM subjects WHERE subject_id = ?";
        db.query(sqlDeleteSubject, subject_id, (err, result)=>{
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
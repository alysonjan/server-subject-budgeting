const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const db = require('../../../config/database');
const auth = require('../../../middleware/auth');


// @route POST api/curriculum
// @description Read curriculum
// @access Private
router.get('/', async(req,res) => {
    try {
        const sqlSelectCurriculum = "SELECT * FROM curriculum";
        db.query(sqlSelectCurriculum, (err, result) => {
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

// @route POST api/curriculum
// @description Add curriculum
// @access Private
router.post('/add',[auth, 
    [
        check('curriculum_code', "Curriculum code is required").not().isEmpty(),
        check('college_code', "College code is required").not().isEmpty(),
        check('subject_code', "Subject code is required").not().isEmpty(),
        check('subject_name', "Subject name is required").not().isEmpty(),
        check('lec_units', "Lec units is required").not().isEmpty(),
        check('lab_units', "Lab units is required").not().isEmpty(),
        check('year_level', "Year Level is required").not().isEmpty(),
        check('semester', "Semester is required").not().isEmpty(),
        check('school_yr_from', "School year from is required").not().isEmpty(),
        check('school_yr_to', "School year to is required").not().isEmpty(),
    ]
], async(req, res)=>{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()});
    }
    const { curriculum_code, college_code,subject_code, subject_name, lec_units, lab_units, total_units,year_level, semester, school_yr_from, school_yr_to } = req.body;
    try {
        sqlInsertCurriculum = "INSERT INTO curriculum (curriculum_code, college_code,subject_code, subject_name, lec_units, lab_units, total_units,year_level, semester, school_yr_from, school_yr_to) VALUES (?,?,?,?,?,?,?,?,?,?,?)";
        db.query(sqlInsertCurriculum, [curriculum_code, college_code, subject_code, subject_name, lec_units, lab_units, total_units, year_level, semester, school_yr_from, school_yr_to], (err, result) => {
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

// @route PUT api/update/curriculum
// @description Update curriculum
// @access Private
router.put('/update',[auth,
    [
        check('curriculum_code', "Curriculum code is required").not().isEmpty(),
        check('college_code', "College code is required").not().isEmpty(),
        check('subject_code', "Subject code is required").not().isEmpty(),
        check('subject_name', "Subject name is required").not().isEmpty(),
        check('lec_units', "Lec units is required").not().isEmpty(),
        check('lab_units', "Lab units is required").not().isEmpty(),
        check('year_level', "Year Level is required").not().isEmpty(),
        check('semester', "Semester is required").not().isEmpty(),
        check('school_yr_from', "School year from is required").not().isEmpty(),
        check('school_yr_to', "School year to is required").not().isEmpty(),
    ]
], async(req,res) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }
    const {curriculum_id, curriculum_code, college_code,subject_code, subject_name, lec_units, lab_units, total_units,year_level, semester, school_yr_from, school_yr_to } = req.body;

    try {
        const sqlUpdateCurriculum = "UPDATE curriculum SET curriculum_code=?, college_code=?, subject_code=?, subject_name=?, lec_units=?, lab_units=?, total_units=?,year_level=?, semester=?, school_yr_from=?, school_yr_to=?  WHERE curriculum_id = ?";
        db.query(sqlUpdateCurriculum, [curriculum_code, college_code, subject_code, subject_name, lec_units, lab_units, total_units,year_level, semester, school_yr_from, school_yr_to, curriculum_id], (err, result) => {
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

// @route DELETE api/delete/curriculum
// @description Delete curriculum
// @access Private
router.delete('/delete',auth, async(req,res) =>{
    const { curriculum_id } = req.body;
    try {
        const sqlDeleteCurriculum = "DELETE FROM curriculum WHERE curriculum_id = ?";
        db.query(sqlDeleteCurriculum, curriculum_id, (err, result)=>{
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
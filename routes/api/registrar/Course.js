const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const db = require('../../../config/database');
const auth = require('../../../middleware/auth');

// @route POST api/course
// @description Read Course
// @access Private
router.get('/', async(req,res) => {
    try {
        const sqlSelectCourse = "SELECT * FROM courses";
        db.query(sqlSelectCourse, (err, result) => {
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

// @route POST api/course
// @description Add Course
// @access Private
router.post('/add', [auth,
    [
        check('college_code', "College Code is required").not().isEmpty(),
        check('department_code', "Course Code is required").not().isEmpty(),
        check('course_name', "Course Name is required").not().isEmpty(),
        check('course_description', "Course description is required").not().isEmpty(),
        check('status', "Status is required").not().isEmpty(),
        check('no_of_years', "No of Years is required").not().isEmpty(),
    ]
], async(req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { college_code, department_code, course_name, course_description, status, no_of_years } = req.body;

    try {
        sqlInsertCourse = "INSERT INTO courses ( college_code, department_code, course_name, course_description, status, no_of_years) VALUES (?,?,?,?,?,?)";
        db.query(sqlInsertCourse, [ college_code, department_code, course_name, course_description, status, no_of_years], (err,result) => {
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

// @route PUT api/update/course
// @description Update Course
// @access Private

router.put('/update',[auth,
    [
        check('college_code', "College Code is required").not().isEmpty(),
        check('department_code', "Course Code is required").not().isEmpty(),
        check('course_name', "Course Name is required").not().isEmpty(),
        check('course_description', "Course description is required").not().isEmpty(),
        check('status', "Status is required").not().isEmpty(),
        check('no_of_years', "No of Years is required").not().isEmpty(),
    ]
], async(req, res)=> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array() });
    }
    const {course_id, college_code, department_code, course_name, course_description, status, no_of_years } = req.body;
    
    try {
        sqlUpdateCourse = "UPDATE courses SET college_code=?, department_code=?, course_name=?, course_description=?, status=?, no_of_years=? WHERE course_id=?";
        db.query(sqlUpdateCourse, [college_code, department_code, course_name, course_description, status, no_of_years, course_id ], (err, result) => {
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

// @route DELETE api/delete/course
// @description Delete Course
// @access Private
router.delete('/delete', auth, async(req,res) => {
    const { course_id } = req.body;
    try {
        const sqlDeleteCourse = "DELETE FROM courses WHERE course_id = ?";
        db.query(sqlDeleteCourse, course_id, (err, result) => {
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
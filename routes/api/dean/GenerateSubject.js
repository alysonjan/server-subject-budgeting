const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require('../../../config/database');
const auth = require('../../../middleware/auth');

// @route POST api/add/generate-subject
// @description Generate Subject
// @access Private

router.post('/add', [auth,
    [
        check('curriculum_code', "Curriculum code is required").not().isEmpty(),
        ///check('year_level', "Year Level is required").not().isEmpty(),
        // check('students', "Students are required").not().isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { curriculum_code, year_level, students, no_of_sections, total_teaching_hours, no_of_faculty } = req.body;

    const sqlCheckIfExist = "SELECT * FROM generate_subject WHERE year_level = ?";
    db.query(sqlCheckIfExist, [year_level], (err, checkIfExist) => {

        if (err) res.json(err);

        if (checkIfExist.length !== 0) {
            res.json({ msg: 'Year Level Already Exist in the Table' })
        }else{
            try {
                const sqlSelectGenerateSubject = "SELECT col.college_name AS collegeName,cur.curriculum_code AS programName,subj.subject_code AS courseCode,cur.semester AS sem,cur.year_level AS yearLevel,subj.subject_name AS subjectName,subj.subject_name AS subjectName,subj.lec_units AS lecUnits,subj.lab_units AS labUnits,subj.total_units AS totalUnits,subj.lec_teaching_hours AS lecTeachingHours,subj.lab_teaching_hours AS labTeachingHours,subj.total_teaching_hours AS totalTeachingHours FROM curriculum AS cur JOIN colleges AS col ON cur.college_code = col.college_code JOIN subjects AS subj ON cur.subject_code = subj.subject_code WHERE cur.curriculum_code = ? AND cur.year_level = ?";
                db.query(sqlSelectGenerateSubject, [curriculum_code, year_level], (err, result) => {
                    if (err) {
                        res.status(400).json({ errors: [{ msg: 'Oops, Something went wrong' }] });
                    } else {
                        result.forEach(subjectBudget => {
                            const sqlInsertGenerateSubject = "INSERT INTO generate_subject (college_name,curriculum_code,subject_code,semester,year_level,subject_name,lec_units,lab_units,total_units,lec_teaching_hours,lab_teaching_hours,total_teaching_hours,students,no_of_sections,no_of_faculty,rad_hours) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                            db.query(sqlInsertGenerateSubject, [subjectBudget.collegeName, subjectBudget.programName, subjectBudget.courseCode, subjectBudget.sem, subjectBudget.yearLevel, subjectBudget.subjectName, subjectBudget.lecUnits, subjectBudget.labUnits, subjectBudget.totalUnits, subjectBudget.lecTeachingHours, subjectBudget.labTeachingHours, subjectBudget.totalTeachingHours, students, no_of_sections, total_teaching_hours, no_of_faculty], (err, result1) => {                      })
                        });
                        return res.json('success');
                    }
                })
            } catch (err) {
                console.error(err.message);
                res.status(500).json('Server Error');
            }
        };

    });

});







module.exports = router;
const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const db = require('../../../config/database');
const auth = require('../../../middleware/auth');
const { TotalHoursPerWeek, RadHours } = require('../../../constants/SubjectBudgeting');
const { calculatedFields } = require('../../../functions/function');

router.post('/add', [auth,
    [
        check('curriculum_code', "Curriculum code is required").not().isEmpty(),
        check('first_year_students', "Students is required").not().isEmpty(),
        check('second_year_students', "Students is required").not().isEmpty(),
        check('third_year_students', "Students is required").not().isEmpty(),
        check('fourth_year_students', "Students is required").not().isEmpty(),
    ]
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const {
        curriculum_code,
        first_year_students,
        second_year_students,
        third_year_students,
        fourth_year_students } = req.body;

    const sqlCheckIfExist = "SELECT * FROM generate_subject WHERE curriculum_code = ?";
    db.query(sqlCheckIfExist, [curriculum_code], (err, checkIfExist) => {

        if (err) res.json(err);

        if (checkIfExist.length !== 0) {
            res.json({ msg: 'Program has Already Existed' })
        }else{
            try {
                calculatedFields(first_year_students,second_year_students,third_year_students,fourth_year_students, function(calculatedData){

                const sql_First_SelectGenerateSubject = "SELECT col.college_name AS collegeName,cur.curriculum_code AS programName,subj.subject_code AS courseCode,cur.semester AS sem,cur.year_level AS yearLevel,subj.subject_name AS subjectName,subj.subject_name AS subjectName,subj.lec_units AS lecUnits,subj.lab_units AS labUnits,subj.total_units AS totalUnits,subj.lec_teaching_hours AS lecTeachingHours,subj.lab_teaching_hours AS labTeachingHours,subj.total_teaching_hours AS totalTeachingHours FROM curriculum AS cur JOIN colleges AS col ON cur.college_code = col.college_code JOIN subjects AS subj ON cur.subject_code = subj.subject_code WHERE cur.curriculum_code = ? AND cur.year_level = ?";
                db.query(sql_First_SelectGenerateSubject, [curriculum_code, 1], (err, result) => {
                    if (err) {
                        res.status(400).json({ errors: [{ msg: 'Oops, Something went wrong' }] });
                    } else {
                        result.forEach(subjectBudget => {
                            let firstYr_overall_teaching_hours = calculatedData[0]*subjectBudget.totalTeachingHours;
                            let firstYr_no_of_faculty = firstYr_overall_teaching_hours/TotalHoursPerWeek;

                            const sql_FirstYear_Insert_Generate_Subject = "INSERT INTO generate_subject (college_name,curriculum_code,subject_code,semester,year_level,subject_name,lec_units,lab_units,total_units,lec_teaching_hours,lab_teaching_hours,total_teaching_hours,students,no_of_sections,overall_teaching_hours,no_of_faculty,rad_hours) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                            db.query(sql_FirstYear_Insert_Generate_Subject, [subjectBudget.collegeName, subjectBudget.programName, subjectBudget.courseCode, subjectBudget.sem, subjectBudget.yearLevel, subjectBudget.subjectName, subjectBudget.lecUnits, subjectBudget.labUnits, subjectBudget.totalUnits, subjectBudget.lecTeachingHours, subjectBudget.labTeachingHours, subjectBudget.totalTeachingHours, first_year_students, calculatedData[0], firstYr_overall_teaching_hours, firstYr_no_of_faculty.toFixed(1), RadHours], (err, result1) => { })
                        });
                    };
                });
                });
        
                const sql_Second_SelectGenerateSubject = "SELECT col.college_name AS collegeName,cur.curriculum_code AS programName,subj.subject_code AS courseCode,cur.semester AS sem,cur.year_level AS yearLevel,subj.subject_name AS subjectName,subj.subject_name AS subjectName,subj.lec_units AS lecUnits,subj.lab_units AS labUnits,subj.total_units AS totalUnits,subj.lec_teaching_hours AS lecTeachingHours,subj.lab_teaching_hours AS labTeachingHours,subj.total_teaching_hours AS totalTeachingHours FROM curriculum AS cur JOIN colleges AS col ON cur.college_code = col.college_code JOIN subjects AS subj ON cur.subject_code = subj.subject_code WHERE cur.curriculum_code = ? AND cur.year_level = ?";
                db.query(sql_Second_SelectGenerateSubject, [curriculum_code, 2],(err,result) =>{
                    result.forEach(subjectBudget => {

                        let secondYr_overall_teaching_hours =calculatedData[1]*subjectBudget.totalTeachingHours;
                        let secondYr_no_of_faculty = secondYr_overall_teaching_hours/TotalHoursPerWeek;

                        const sql_SecondYear_Insert_Generate_Subject = "INSERT INTO generate_subject (college_name,curriculum_code,subject_code,semester,year_level,subject_name,lec_units,lab_units,total_units,lec_teaching_hours,lab_teaching_hours,total_teaching_hours,students,no_of_sections,overall_teaching_hours,no_of_faculty,rad_hours) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        db.query(sql_SecondYear_Insert_Generate_Subject, [subjectBudget.collegeName, subjectBudget.programName, subjectBudget.courseCode, subjectBudget.sem, subjectBudget.yearLevel, subjectBudget.subjectName, subjectBudget.lecUnits, subjectBudget.labUnits, subjectBudget.totalUnits, subjectBudget.lecTeachingHours, subjectBudget.labTeachingHours, subjectBudget.totalTeachingHours, second_year_students, calculatedData[1], secondYr_overall_teaching_hours, secondYr_no_of_faculty.toFixed(1), RadHours], (err, result1) => {   })
                    });
                });

                const sql_Third_SelectGenerateSubject = "SELECT col.college_name AS collegeName,cur.curriculum_code AS programName,subj.subject_code AS courseCode,cur.semester AS sem,cur.year_level AS yearLevel,subj.subject_name AS subjectName,subj.subject_name AS subjectName,subj.lec_units AS lecUnits,subj.lab_units AS labUnits,subj.total_units AS totalUnits,subj.lec_teaching_hours AS lecTeachingHours,subj.lab_teaching_hours AS labTeachingHours,subj.total_teaching_hours AS totalTeachingHours FROM curriculum AS cur JOIN colleges AS col ON cur.college_code = col.college_code JOIN subjects AS subj ON cur.subject_code = subj.subject_code WHERE cur.curriculum_code = ? AND cur.year_level = ?";
                db.query(sql_Third_SelectGenerateSubject, [curriculum_code, 3],(err,result) =>{
                    result.forEach(subjectBudget => {

                        let thirdYr_overall_teaching_hours = calculatedData[2]*subjectBudget.totalTeachingHours;
                        let thirdYr_no_of_faculty = thirdYr_overall_teaching_hours/TotalHoursPerWeek;

                        const sql_ThirdYear_Insert_Generate_Subject = "INSERT INTO generate_subject (college_name,curriculum_code,subject_code,semester,year_level,subject_name,lec_units,lab_units,total_units,lec_teaching_hours,lab_teaching_hours,total_teaching_hours,students,no_of_sections,overall_teaching_hours,no_of_faculty,rad_hours) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        db.query(sql_ThirdYear_Insert_Generate_Subject, [subjectBudget.collegeName, subjectBudget.programName, subjectBudget.courseCode, subjectBudget.sem, subjectBudget.yearLevel, subjectBudget.subjectName, subjectBudget.lecUnits, subjectBudget.labUnits, subjectBudget.totalUnits, subjectBudget.lecTeachingHours, subjectBudget.labTeachingHours, subjectBudget.totalTeachingHours, third_year_students, calculatedData[2], thirdYr_overall_teaching_hours, thirdYr_no_of_faculty.toFixed(1), RadHours], (err, result1) => {   })
                    });
                });

                const sql_Fourth_SelectGenerateSubject = "SELECT col.college_name AS collegeName,cur.curriculum_code AS programName,subj.subject_code AS courseCode,cur.semester AS sem,cur.year_level AS yearLevel,subj.subject_name AS subjectName,subj.subject_name AS subjectName,subj.lec_units AS lecUnits,subj.lab_units AS labUnits,subj.total_units AS totalUnits,subj.lec_teaching_hours AS lecTeachingHours,subj.lab_teaching_hours AS labTeachingHours,subj.total_teaching_hours AS totalTeachingHours FROM curriculum AS cur JOIN colleges AS col ON cur.college_code = col.college_code JOIN subjects AS subj ON cur.subject_code = subj.subject_code WHERE cur.curriculum_code = ? AND cur.year_level = ?";
                db.query(sql_Fourth_SelectGenerateSubject, [curriculum_code, 4],(err,result) =>{
                    result.forEach(subjectBudget => {

                        let fourthYr_overall_teaching_hours = calculatedData[3]*subjectBudget.totalTeachingHours;
                        let fourthYr_no_of_faculty = fourthYr_overall_teaching_hours/TotalHoursPerWeek;

                        const sql_FourthYear_Insert_Generate_Subject = "INSERT INTO generate_subject (college_name,curriculum_code,subject_code,semester,year_level,subject_name,lec_units,lab_units,total_units,lec_teaching_hours,lab_teaching_hours,total_teaching_hours,students,no_of_sections,overall_teaching_hours,no_of_faculty,rad_hours) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
                        db.query(sql_FourthYear_Insert_Generate_Subject, [subjectBudget.collegeName, subjectBudget.programName, subjectBudget.courseCode, subjectBudget.sem, subjectBudget.yearLevel, subjectBudget.subjectName, subjectBudget.lecUnits, subjectBudget.labUnits, subjectBudget.totalUnits, subjectBudget.lecTeachingHours, subjectBudget.labTeachingHours, subjectBudget.totalTeachingHours, fourth_year_students, calculatedData[3], fourthYr_overall_teaching_hours, fourthYr_no_of_faculty.toFixed(1), RadHours], (err, result1) => {   })
                    });
                    return res.json('success')
                });
            } catch (err) {
                console.error(err.message);
                res.status(500).json('Server Error');
            }
        };
    });
});

module.exports = router;
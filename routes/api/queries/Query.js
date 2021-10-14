const express = require('express');
const router = express.Router();
// const { check, validationResult } = require('express-validator');
const db = require('../../../config/database');
const auth = require('../../../middleware/auth');

router.get('/curriculum', auth, async(req,res)=>{
    try {
        const sqlSelectCurriculum = "SELECT DISTINCT curriculum_code,year_level FROM curriculum";
        db.query(sqlSelectCurriculum, (err, result) =>{
            if (err){
                res.status(400).json({ errors: [{ msg: 'Oops, Something went wrong'}] });  
            }else{
                res.json(result)
            }
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});



module.exports = router;
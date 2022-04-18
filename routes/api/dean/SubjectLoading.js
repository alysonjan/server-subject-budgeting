// const express = require('express')
// const router = express.Router()
// const { check, validationResult } = require('express-validator')
// const db = require('../../../config/database')
// const auth = require('../../../middleware/auth')

// router.post(
//   '/add',
//   [
//     auth,
//     [
//       check('year_level', 'year level is required').not().isEmpty(),
//       check('course_code', 'course code is required').not().isEmpty(),
//       check('descriptive_title', 'descriptive title is required')
//         .not()
//         .isEmpty(),
//       check('total_teaching_hours', 'total teaching hours is required')
//         .not()
//         .isEmpty(),
//       check('section', 'section is required').not().isEmpty(),
//       check('teacher', 'teacher is required').not().isEmpty(),
//       check('schedule_id', 'schedule id level is required').not().isEmpty(),
//     ],
//   ],
//   async (req, res) => {
//     const errors = validationResult(req)
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() })
//     }

//     const {
//       year_level,
//       course_code,
//       descriptive_title,
//       total_teaching_hours,
//       section,
//       teacher,
//       schedule_id,
//     } = req.body

//     const sqlCheckIfAlreadyAssign = 'SELECT * FROM subject_loading WHERE '
//   }
// )

// module.exports = router

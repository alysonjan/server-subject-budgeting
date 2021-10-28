const { RegularSize, AllowanceSize } = require('../constants/SubjectBudgeting');

const calculatedFields = (first_year_students,second_year_students,third_year_students,fourth_year_students, callback) => {

    calculatedData = [];

    let firstYear_no_of_sections;
    let secondYear_no_of_sections;
    let thirdYear_no_of_sections;
    let fourthYear_no_of_sections;

    if (first_year_students >= RegularSize) {
        let firstYearSectionCapacity = Math.floor(first_year_students/RegularSize);
        if (first_year_students % RegularSize > AllowanceSize) {
            firstYearSectionCapacity += 1;
        }
        firstYear_no_of_sections = firstYearSectionCapacity;
    } else {
        firstYear_no_of_sections = 1;
    };
    calculatedData.push(firstYear_no_of_sections)

    if (second_year_students >= RegularSize) {
        let secondYearSectionCapacity = Math.floor(second_year_students/RegularSize);
        if (second_year_students % RegularSize > AllowanceSize) {
            secondYearSectionCapacity += 1;
        }
        secondYear_no_of_sections = secondYearSectionCapacity;
    } else {
        secondYear_no_of_sections = 1;
    };
    calculatedData.push(secondYear_no_of_sections)

    if (third_year_students >= RegularSize) {
        let thirdYearSectionCapacity = Math.floor(third_year_students/RegularSize);
        if (third_year_students % RegularSize > AllowanceSize) {
            thirdYearSectionCapacity += 1;
        }
        thirdYear_no_of_sections = thirdYearSectionCapacity;
    } else {
        thirdYear_no_of_sections = 1;
    };
    calculatedData.push(thirdYear_no_of_sections)

    if (fourth_year_students >= RegularSize) {
        let fourthYearSectionCapacity = Math.floor(fourth_year_students/RegularSize);
        if (fourth_year_students % RegularSize > AllowanceSize) {
            fourthYearSectionCapacity += 1;
        }
        fourthYear_no_of_sections = fourthYearSectionCapacity;
    } else {
        fourthYear_no_of_sections = 1;
    };
    calculatedData.push(fourthYear_no_of_sections)

    // let overall_teaching_hours = no_of_sections*subjectBudget.totalTeachingHours;
    // let no_of_faculty = overall_teaching_hours/TotalHoursPerWeek;
    return callback(calculatedData);
}

module.exports = { calculatedFields };
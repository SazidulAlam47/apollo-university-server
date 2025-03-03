import { TGrade } from './enrolledCourse.interface';

export const calculateGradeAndPoints = (totalMarks: number) => {
    let result: {
        grade: TGrade;
        gradePoints: number;
    } = {
        grade: 'NA',
        gradePoints: 0,
    };

    if (totalMarks >= 80) {
        result = {
            grade: 'A+',
            gradePoints: 4,
        };
    } else if (totalMarks >= 70) {
        result = {
            grade: 'A',
            gradePoints: 3.5,
        };
    } else if (totalMarks >= 60) {
        result = {
            grade: 'B',
            gradePoints: 3,
        };
    } else if (totalMarks >= 50) {
        result = {
            grade: 'C',
            gradePoints: 2.5,
        };
    } else if (totalMarks >= 40) {
        result = {
            grade: 'D',
            gradePoints: 2,
        };
    } else {
        result = {
            grade: 'F',
            gradePoints: 0,
        };
    }

    return result;
};

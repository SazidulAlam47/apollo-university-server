import {
    TMonth,
    TAcademicSemesterName,
    TAcademicSemesterCode,
    TAcademicSemesterNameCodeMapper,
} from './academicSemester.interface';

export const months: TMonth[] = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];

export const academicSemesterNames: TAcademicSemesterName[] = [
    'Autumn',
    'Summer',
    'Fall',
];

export const academicSemesterCodes: TAcademicSemesterCode[] = [
    '01',
    '02',
    '03',
];

export const academicSemesterNameCodeMapper: TAcademicSemesterNameCodeMapper = {
    Autumn: '01',
    Summer: '02',
    Fall: '03',
};

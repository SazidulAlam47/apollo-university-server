import { Types } from 'mongoose';

export type TPreRequisiteCourse = {
    course: Types.ObjectId;
    isDeleted: boolean;
};

export interface TCourse {
    title: string;
    prefix: string;
    code: number;
    credits: number;
    preRequisiteCourses: TPreRequisiteCourse[];
    isDeleted: boolean;
}

export interface TCourseFaculty {
    course: Types.ObjectId;
    faculties: Types.ObjectId[];
}

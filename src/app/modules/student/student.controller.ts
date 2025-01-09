import { Request, Response } from 'express';
import { StudentServices } from './student.service';
import StudentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student: studentData } = req.body;

        // Joi validation
        // const { error, value } = StudentJoiSchema.validate(studentData);
        // if (error) {
        //     return res.status(400).json({
        //         success: false,
        //         message: 'Validation error From Joi',
        //         error: error.details,
        //     });
        // }

        // Zod validation
        const zodParsedData = StudentValidationSchema.parse(studentData);

        const result = await StudentServices.createStudentIntoDB(zodParsedData);

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error,
        });
    }
};

const getAllStudents = async (req: Request, res: Response) => {
    try {
        const result = await StudentServices.getAllStudentsFromDB();
        res.status(200).json({
            success: true,
            message: 'All students fetched successfully',
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
            error: error,
        });
    }
};

export const StudentControllers = {
    createStudent,
    getAllStudents,
};

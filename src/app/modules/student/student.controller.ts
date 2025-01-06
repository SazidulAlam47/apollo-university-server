import { Request, Response } from 'express';
import { StudentServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
    try {
        const { student } = req.body;

        const result = await StudentServices.createStudentIntoDB(student);

        res.status(201).json({
            success: true,
            message: 'Student created successfully',
            data: result,
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
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
        console.log(error);
        res.status(500).json({
            success: false,
            message: 'Something went wrong',
        });
    }
};

export const StudentControllers = {
    createStudent,
    getAllStudents,
};

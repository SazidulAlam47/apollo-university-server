import { Request, Response } from "express";
import { UserServices } from "./user.service";

const createStudent = async (req: Request, res: Response) => {
    try {
        const { password, student: studentData } = req.body;

        // const zodParsedData = StudentValidationSchema.parse(studentData);
        const result = await UserServices.createStudentIntoDB(
            password,
            studentData,
        );
        res.status(201).json({
            success: true,
            message: "Student created successfully",
            data: result,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Something went wrong",
            error: error,
        });
    }
};

export const UserControllers = {
    createStudent,
};

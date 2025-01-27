import { NextFunction, Request, Response } from "express";
import { StudentServices } from "./student.service";
import { LoginValidationSchema } from "./student.validation";
import { TLoginData } from "./student.interface";

const getAllStudents = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await StudentServices.getAllStudentsFromDB();
        res.status(200).json({
            success: true,
            message: "All students fetched successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getStudentById = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { studentId } = req.params;
        const result = await StudentServices.getStudentByIdFromDB(studentId);
        if (!result) throw new Error(`id:${studentId} not found`);
        res.status(200).json({
            success: true,
            message: `id:${studentId} is fetched successfully`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const deleteStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { studentId } = req.params;
        const result = await StudentServices.deleteUserFromDB(studentId);
        res.status(200).json({
            success: true,
            message: `id:${studentId} is deleted successfully`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

const getLoginData = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { body } = req;
        const loginData: TLoginData = LoginValidationSchema.parse(body);
        const { email, password } = loginData;
        await StudentServices.getLoginDataFromDB(email, password);
        res.status(200).json({
            success: true,
            message: "User Logged in Successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const StudentControllers = {
    getAllStudents,
    getLoginData,
    getStudentById,
    deleteStudent,
};

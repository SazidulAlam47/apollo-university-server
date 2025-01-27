/* eslint-disable @typescript-eslint/no-explicit-any */
import { Request, Response } from "express";
import { StudentServices } from "./student.service";
import { LoginValidationSchema } from "./student.validation";
import { TLoginData } from "./student.interface";

const getAllStudents = async (req: Request, res: Response) => {
    try {
        const result = await StudentServices.getAllStudentsFromDB();
        res.status(200).json({
            success: true,
            message: "All students fetched successfully",
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

const getStudentById = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const result = await StudentServices.getStudentByIdFromDB(studentId);
        if (!result) throw new Error(`id:${studentId} not found`);
        res.status(200).json({
            success: true,
            message: `id:${studentId} is fetched successfully`,
            data: result,
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
            error: error,
        });
    }
};

const deleteStudent = async (req: Request, res: Response) => {
    try {
        const { studentId } = req.params;
        const result = await StudentServices.deleteUserFromDB(studentId);
        res.status(200).json({
            success: true,
            message: `id:${studentId} is deleted successfully`,
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

const getLoginData = async (req: Request, res: Response) => {
    try {
        const { body } = req;
        const loginData: TLoginData = LoginValidationSchema.parse(body);
        const { email, password } = loginData;
        await StudentServices.getLoginDataFromDB(email, password);
        res.status(200).json({
            success: true,
            message: "User Logged in Successfully",
        });
    } catch (error: any) {
        res.status(500).json({
            success: false,
            message: error.message || "Something went wrong",
        });
    }
};

export const StudentControllers = {
    getAllStudents,
    getLoginData,
    getStudentById,
    deleteStudent,
};

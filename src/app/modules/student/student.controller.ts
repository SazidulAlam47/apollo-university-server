import { NextFunction, Request, Response } from "express";
import { StudentServices } from "./student.service";
import sendStatus from "../../utils/sendStatus";
import status from "http-status";

const getAllStudents = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const result = await StudentServices.getAllStudentsFromDB();

        sendStatus(res, {
            statusCode: status.OK,
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

        sendStatus(res, {
            statusCode: status.OK,
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
        sendStatus(res, {
            statusCode: status.OK,
            success: true,
            message: `id:${studentId} is deleted successfully`,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const StudentControllers = {
    getAllStudents,
    getStudentById,
    deleteStudent,
};

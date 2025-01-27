import { NextFunction, Request, Response } from "express";
import { UserServices } from "./user.service";
import sendStatus from "../../utils/sendStatus";
import status from "http-status";

const createStudent = async (
    req: Request,
    res: Response,
    next: NextFunction,
) => {
    try {
        const { password, student: studentData } = req.body;

        // const zodParsedData = StudentValidationSchema.parse(studentData);
        const result = await UserServices.createStudentIntoDB(
            password,
            studentData,
        );

        sendStatus(res, {
            statusCode: status.CREATED,
            success: true,
            message: "Student created successfully",
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

export const UserControllers = {
    createStudent,
};

import { StudentServices } from "./student.service";
import sendStatus from "../../utils/sendStatus";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";

const getAllStudents = catchAsync(async (req, res) => {
    const result = await StudentServices.getAllStudentsFromDB();

    sendStatus(res, {
        statusCode: status.OK,
        success: true,
        message: "All students fetched successfully",
        data: result,
    });
});

const getStudentById = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.getStudentByIdFromDB(studentId);
    if (!result) throw new Error(`id:${studentId} not found`);

    sendStatus(res, {
        statusCode: status.OK,
        success: true,
        message: `id:${studentId} is fetched successfully`,
        data: result,
    });
});

const deleteStudent = catchAsync(async (req, res) => {
    const { studentId } = req.params;
    const result = await StudentServices.deleteUserFromDB(studentId);
    sendStatus(res, {
        statusCode: status.OK,
        success: true,
        message: `id:${studentId} is deleted successfully`,
        data: result,
    });
});

export const StudentControllers = {
    getAllStudents,
    getStudentById,
    deleteStudent,
};

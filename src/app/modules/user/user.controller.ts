import { UserServices } from "./user.service";
import sendStatus from "../../utils/sendStatus";
import status from "http-status";
import catchAsync from "../../utils/catchAsync";

const createStudent = catchAsync(async (req, res) => {
    const { password, student: studentData } = req.body;

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
});

export const UserControllers = {
    createStudent,
};

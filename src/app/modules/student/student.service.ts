import { TStudent } from "./student.interface";
import { Student } from "./student.model";
import bcrypt from "bcrypt";

const getAllStudentsFromDB = async () => {
    const result = await Student.find();
    return result;
};

const getStudentByIdFromDB = async (id: string) => {
    const result = await Student.findOne({ id });
    return result;
};

const deleteUserFromDB = async (id: string) => {
    const result = await Student.updateOne({ id }, { isDeleted: true });
    return result;
};

const getLoginDataFromDB = async (email: string, password: string) => {
    const user: TStudent | null = await Student.findOne({ email });
    if (user) {
        const { password: hashedPassword } = user;
        const result = await bcrypt.compare(password, hashedPassword);
        if (result) {
            return;
        }
        throw new Error("Password didn't matched");
    } else {
        throw new Error("Email not found");
    }
};

export const StudentServices = {
    getAllStudentsFromDB,
    getLoginDataFromDB,
    getStudentByIdFromDB,
    deleteUserFromDB,
};

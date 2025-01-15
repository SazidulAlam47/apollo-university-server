import { TStudent } from "./student.interface";
import { Student } from "./student.model";

const createStudentIntoDB = async (studentData: TStudent) => {
    // static method

    if (await Student.isUserExists(studentData.id)) {
        throw new Error("User already exists.");
    }

    const result = Student.create(studentData); // built-in static method

    // instance method

    // const student = new Student(studentData); // instance

    // if (await student.isUserExists(studentData.id)) {
    //     throw new Error("User already exists.");
    // }

    // const result = await student.save(); // built-in instance method

    return result;
};

const getAllStudentsFromDB = async () => {
    const result = await Student.find();
    return result;
};

export const StudentServices = {
    createStudentIntoDB,
    getAllStudentsFromDB,
};

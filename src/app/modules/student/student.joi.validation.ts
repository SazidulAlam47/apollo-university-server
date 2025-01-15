import Joi from "joi";

const userNameJoiSchema = Joi.object({
    firstName: Joi.string().required(),
    middleName: Joi.string(),
    lastName: Joi.string().required(),
});

const guardianJoiSchema = Joi.object({
    fatherName: Joi.string().required(),
    fatherOccupation: Joi.string().required(),
    fatherContact: Joi.string().required(),
    motherName: Joi.string().required(),
    motherOccupation: Joi.string().required(),
    motherContact: Joi.string().required(),
});

const localGuardianJoiSchema = Joi.object({
    name: Joi.string().required(),
    occupation: Joi.string().required(),
    contactNo: Joi.string().required(),
    address: Joi.string().required(),
});

const StudentJoiSchema = Joi.object({
    id: Joi.string().required(),
    name: userNameJoiSchema.required(),
    gender: Joi.string().required().valid("Male", "Female"),
    dateOfBirth: Joi.string().required(),
    email: Joi.string().email().required(),
    contactNumber: Joi.string().required(),
    emergencyContact: Joi.string().required(),
    bloodGroup: Joi.string().valid(
        "A+",
        "A-",
        "B+",
        "B-",
        "AB+",
        "AB-",
        "O+",
        "O-",
    ),
    presentAddress: Joi.string().required(),
    permanentAddress: Joi.string().required(),
    guardian: guardianJoiSchema.required(),
    localGuardian: localGuardianJoiSchema.required(),
    profileImg: Joi.string(),
    isActive: Joi.string().valid("Active", "Blocked").default("Active"),
});

export default StudentJoiSchema;

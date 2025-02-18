import { model, Schema } from 'mongoose';
import { TUser, TUserName, UserModel } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

export const userNameSchema = new Schema<TUserName>(
    {
        firstName: {
            type: String,
            required: true,
        },
        middleName: { type: String },
        lastName: {
            type: String,
            required: true,
        },
    },
    {
        _id: false,
    },
);

const userSchema = new Schema<TUser, UserModel>(
    {
        id: { type: String, required: true },
        password: { type: String, required: true },
        needsPasswordChange: { type: Boolean, default: true },
        role: {
            type: String,
            enum: ['student', 'faculty', 'admin'],
            required: true,
        },
        status: {
            type: String,
            enum: ['in-progress', 'blocked'],
            default: 'in-progress',
        },
        isDeleted: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    },
);

userSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(
        this.password,
        Number(config.bcrypt_salt_round),
    );
    next();
});

userSchema.post('save', function (doc, next) {
    doc.password = '';
    next();
});

userSchema.pre('find', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

userSchema.pre('findOne', function (next) {
    this.find({ isDeleted: { $ne: true } });
    next();
});

userSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({
        $match: { isDeleted: { $ne: true } },
    });
    next();
});

userSchema.statics.isUserExistsByCustomId = async function (id: string) {
    return await User.findOne({ id });
};

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword: string,
    hashedPassword: string,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

export const User = model<TUser, UserModel>('User', userSchema);

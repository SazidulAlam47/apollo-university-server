import { UserStatus } from './user.constant';
import bcrypt from 'bcrypt';
import { model, Schema } from 'mongoose';
import { TUser, TUserName, UserModel } from './user.interface';
import config from '../../config';

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
        id: { type: String, required: true, unique: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true, select: 0 },
        needsPasswordChange: { type: Boolean, default: true },
        passwordChangedAt: { type: Date },
        role: {
            type: String,
            enum: ['student', 'faculty', 'admin'],
            required: true,
        },
        status: {
            type: String,
            enum: UserStatus,
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
    return await User.findOne({ id }).select('+password');
};

userSchema.statics.isPasswordMatched = async function (
    plainTextPassword: string,
    hashedPassword: string,
) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
};

userSchema.statics.isJWTIssuedBeforePasswordChanged = function (
    passwordChangedTimestamp: Date,
    jwtIssuedTimestamp: number,
) {
    return passwordChangedTimestamp.getTime() / 1000 > jwtIssuedTimestamp;
};

export const User = model<TUser, UserModel>('User', userSchema);

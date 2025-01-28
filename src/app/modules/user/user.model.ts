import { model, Schema } from 'mongoose';
import { TUser } from './user.interface';
import config from '../../config';
import bcrypt from 'bcrypt';

const userSchema = new Schema<TUser>(
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

export const User = model<TUser>('User', userSchema);

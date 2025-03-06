import config from '../config';
import { UserRole } from '../modules/user/user.constant';
import { TUser } from '../modules/user/user.interface';
import { User } from '../modules/user/user.model';

const superUser: TUser = {
    id: '0001',
    email: 'super@example.com',
    password: config.super_admin_password as string,
    needsPasswordChange: false,
    role: 'superAdmin',
    status: 'in-progress',
    isDeleted: false,
};

const seedSuperAdmin = async () => {
    const isSuperAdminExists = await User.findOne({
        role: UserRole.superAdmin,
    });
    if (!isSuperAdminExists) {
        await User.create(superUser);
    }
};
export default seedSuperAdmin;

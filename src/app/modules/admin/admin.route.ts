import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { AdminControllers } from './admin.controller';
import { AdminValidations } from './admin.validation';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmin);
router.get('/:adminId', AdminControllers.getAdminById);

router.patch(
    '/:adminId',
    validateRequest(AdminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdminById,
);

router.delete('/:adminId', AdminControllers.deleteAdminById);

export const AdminRouters = router;

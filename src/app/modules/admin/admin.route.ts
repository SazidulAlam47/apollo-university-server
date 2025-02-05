import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { AdminControllers } from './admin.controller';
import { AdminValidations } from './admin.validation';

const router = express.Router();

router.get('/', AdminControllers.getAllAdmin);
router.get('/:id', AdminControllers.getAdminById);

router.patch(
    '/:id',
    validateRequest(AdminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdminById,
);

router.delete('/:id', AdminControllers.deleteAdminById);

export const AdminRouters = router;

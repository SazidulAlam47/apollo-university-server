import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { AdminControllers } from './admin.controller';
import { AdminValidations } from './admin.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', auth('admin'), AdminControllers.getAllAdmin);
router.get('/:id', auth('admin'), AdminControllers.getAdminById);

router.patch(
    '/:id',
    auth('admin'),
    validateRequest(AdminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdminById,
);

router.delete('/:id', auth('admin'), AdminControllers.deleteAdminById);

export const AdminRouters = router;

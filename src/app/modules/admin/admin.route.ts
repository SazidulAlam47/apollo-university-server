import express from 'express';
import validateRequest from '../../middlewares/validateRequest';

import { AdminControllers } from './admin.controller';
import { AdminValidations } from './admin.validation';
import auth from '../../middlewares/auth';
import { upload } from '../../utils/sendImageToCloudinary';
import FromDataToJson from '../../middlewares/FromDataToJson';

const router = express.Router();

router.get('/', auth('admin', 'superAdmin'), AdminControllers.getAllAdmin);
router.get('/:id', auth('admin', 'superAdmin'), AdminControllers.getAdminById);

router.patch(
    '/:id',
    auth('admin', 'superAdmin'),
    upload.single('file'),
    FromDataToJson,
    validateRequest(AdminValidations.updateAdminValidationSchema),
    AdminControllers.updateAdminById,
);

router.delete(
    '/:id',
    auth('admin', 'superAdmin'),
    AdminControllers.deleteAdminById,
);

export const AdminRouters = router;

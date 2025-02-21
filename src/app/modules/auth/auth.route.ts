import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidations } from './auth.validation';
import { AuthControllers } from './auth.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/login',
    validateRequest(AuthValidations.loginValidationSchema),
    AuthControllers.loginUser,
);

router.post(
    '/change-password',
    auth(),
    validateRequest(AuthValidations.changePasswordValidationSchema),
    AuthControllers.changePassword,
);

router.get(
    '/refresh-token',
    validateRequest(AuthValidations.refreshTokenValidationSchema),
    AuthControllers.refreshToken,
);

export const AuthRoutes = router;

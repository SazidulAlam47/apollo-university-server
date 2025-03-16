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

router.get('/logout', AuthControllers.logoutUser);

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

router.post(
    '/forget-password',
    validateRequest(AuthValidations.forgetPasswordValidationSchema),
    AuthControllers.forgetPassword,
);

router.post(
    '/reset-password',
    validateRequest(AuthValidations.resetPasswordValidationSchema),
    AuthControllers.resetPassword,
);

export const AuthRoutes = router;

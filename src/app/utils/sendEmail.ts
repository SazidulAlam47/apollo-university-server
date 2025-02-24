import nodemailer from 'nodemailer';
import config from '../config';
import AppError from '../errors/AppError';
import status from 'http-status';

export const sendEmail = async (to: string, subject: string, html: string) => {
    try {
        const transporter = nodemailer.createTransport({
            host: config.node_mailer_host,
            port: parseInt(config.node_mailer_port as string),
            secure: config.NODE_ENV === 'production',
            auth: {
                user: config.node_mailer_user,
                pass: config.node_mailer_password,
            },
        });

        await transporter.sendMail({
            from: `"Ph University" <${config.node_mailer_email}>`,
            to,
            subject,
            html,
        });
    } catch (err) {
        // eslint-disable-next-line no-console
        console.log(err);
        throw new AppError(
            status.INTERNAL_SERVER_ERROR,
            'Failed to send Email',
        );
    }
};

import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
    NODE_ENV: process.env.NODE_ENV,
    port: process.env.PORT,
    database_url: process.env.DATABASE_URL,
    client_url: process.env.CLIENT_URL,
    bcrypt_salt_round: process.env.BCRYPT_SALT_ROUND,
    default_password: process.env.DEFAULT_PASSWORD,
    jwt_access_secret: process.env.JWT_ACCESS_SECRET,
    jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
    jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
    jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
    node_mailer_host: process.env.NODE_MAILER_HOST,
    node_mailer_port: process.env.NODE_MAILER_PORT,
    node_mailer_email: process.env.NODE_MAILER_EMAIL,
    node_mailer_user: process.env.NODE_MAILER_USER,
    node_mailer_password: process.env.NODE_MAILER_PASSWORD,
};

import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
    STATE: env.get('STAGE').required().asString,
    PORT: env.get('PORT').required().asPortNumber,
    POSTGRE_USER : env.get('POSTGRES_USER').required().asString, 
    POSTGRE_HOST : env.get('POSTGRES_HOST').required().asString, 
    POSTGRE_DB : env.get('POSTGRES_DB').required().asString,
    POSTGRE_PASSWORD : env.get('POSTGRES_PASSWORD').required().asString,
    POSTGRE_PORT : env.get('POSTGRES_PORT').required().asPortNumber,
    MAIL_HOST: env.get('MAIL_HOST').required().asString,
    MAIL_PORT : env.get('MAIL_PORT').required().asPortNumber,
    MAIL_USER: env.get('MAIL_USER').required().asString,
    MAIL_PASS: env.get('MAIL_PASS').required().asString,
    JWT_SEED: env.get('JWT_SEED').required().asString,
    REDIS_HOST: env.get('REDIS_HOST').required().asString,
    REDIS_PORT: env.get('REDIS_PORT').required().asPortNumber,
    URL: env.get('URL').required().asString, 
    EXPIRED_SESSION: 30 * 24 * 60 * 60, // se tranforma en un mes,
    EXPIRED_CACHE_SESSION: 30 * 60 // se transforma a 30 min.
}
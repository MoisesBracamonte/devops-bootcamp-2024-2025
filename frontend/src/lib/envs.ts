import 'dotenv/config';
import * as env from 'env-var';

export const envs = {
    API_URL: env.get('NEXT_PUBLIC_API_URL').required().asString(),
};
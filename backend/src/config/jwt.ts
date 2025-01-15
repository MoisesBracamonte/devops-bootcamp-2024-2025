import jwt from 'jsonwebtoken';
import { envs } from './envs';

export class JwtConfig{
    static async  generate(payload:any, duration:number){
        return new Promise(( resolve) => {
            jwt.sign(
                payload,
                envs.JWT_SEED(),
                { expiresIn: duration },
                (errors, token) => {
                    if(errors) return null
                    return resolve(token)
                }
            )
        });
    }

    static validate(token: string): Promise<any> {
        return new Promise((resolve, reject) => {
            jwt.verify(token, envs.JWT_SEED(), (errors, decoded) => {
                if (errors) {
                    console.error("Error al verificar el token:", errors);
                    return reject(errors); // Rechaza la promesa si hay un error
                }
                resolve(decoded); // Resuelve la promesa si el token es válido
            });
        });
    }
}
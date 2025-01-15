import { compareSync, genSaltSync, hashSync } from 'bcryptjs';
export const Bcrypt = {
    generate(payload:string){
        const saltRound = genSaltSync();
        const hashed = hashSync(payload, saltRound);
        return hashed;
    },
    compare(payload:string, hashed: string){
        return compareSync(payload, hashed);
    }
}
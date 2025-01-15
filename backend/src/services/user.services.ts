import { CustomSuccess } from "../config/CustomSuccess";
import { Bcrypt } from "../config/bcrypt";
import { CustomError } from "../config/CustomError";
import { Connection } from "../config/database";
import { PsqlDto } from "../dtos/psql.dto";
import { UserDto } from "../dtos/user.dto";
import { v4 as uuidv4 } from 'uuid';
import { JwtConfig } from "../config/jwt";
import { UserEntity } from "../entity/user.entity";
import { envs } from "@src/config/envs";

export class UserService{
    constructor(){}


    static async user(userId:number){
        try {
            const response = await Connection.knexPool('users').select(
                'users.id',
                'users.name',
                'users.email',
                'users.type_of_user',
                'users.is_active',
                'users.created_at',
                'users.password',
                'organizations.id as id_organization',
                'organizations.name  as name_organization',
                'organizations.industry  as industry_organization',
                'organizations.phone  as phone_organization',
                'organizations.address as address_organization',
                'organizations.num_employees as num_employees_organization'
            ).leftJoin('organization_users','users.id','organization_users.user_id')
            .leftJoin('organizations','organizations.id','organization_users.organization_id')
            .where('users.id', userId);
            if(!response.length){
                throw CustomError.unauthorized("unauthorized",{});
            }
            return response[0];
        } catch (error) {
            throw error;
        }
    }
    async register(response:UserDto){
        const { user } = response;
        const password = Bcrypt.generate(user.password);
        const hash_account = uuidv4();
        const trx = await Connection.knexPool.transaction();
        try{
            const [responseUser] = await trx('users')
            .insert({
                name: user.name,
                email: user.email,
                password: password,
                phone: user.phone,
                is_active: 'actived',
                hash_account: hash_account,
                is_validated: 'N',
                type_of_user: user.type_of_user,
                created_at: new Date(),
                updated_at: new Date()
            })
            .returning('id');
            if (user.type_of_user === 'organization') {
                const [responseOrganization] = await trx('organizations')
                  .insert({
                    name: user.name_organization,
                    industry: user.industry_organization,
                    phone: user.phone_organization,
                    address: user.address_organization,
                    num_employees: user.num_employees_organization,
                    created_at: new Date(),
                    updated_at: new Date()
                  })
                  .returning('id');
          
                // Relacionar usuario con organización
                await trx('organization_users')
                  .insert({
                    user_id: responseUser.id,
                    organization_id: responseOrganization.id,
                    role: 'owner',
                    created_at: new Date(),
                    updated_at: new Date()
                  });
              }
          
              // Confirmar transacción
              await trx.commit();
          
              const userEntity = UserEntity.toJson({...user, is_validated: 'N', hash_account});
              return CustomSuccess.ok('Your account is created', userEntity);
              
        }catch(error:any){
            await trx.rollback();
            const _dto = PsqlDto.error(error);
            throw CustomError.internalServer(_dto.detail === ''  ? 'Internal server error' : _dto.detail, {});
        }
        
    }

    validateAccount = async (id:string) => {
        try{
            // const isValidated = await Connection.postgresql?.query("select id,is_validated from users where hash_account=$1",[id]);
            const isValidated = await Connection.knexPool('users').select('id', 'is_validated').where('hash_account', id);
            if(!isValidated.length){
                throw CustomError.notFound("Account not found",{});
            }

            const user = isValidated[0];
            if( user.is_validated === "Y"){
                throw CustomError.conflict("your account has already been validated", {});
            }

            // const updateUser = await Connection.postgresql?.query(`update users set is_validated='Y', updated_at=$1 where hash_account=$2 returning *`,[new Date(),id]);
            const updateUser = await Connection.knexPool('users')
            .where('hash_account', id)
            .update({
                is_validated:'Y',
                updated_at: new Date()
            }).returning('*');
            if(!updateUser.length){
                throw CustomError.badRequest("failed to update account",{});
            }
            const userEntity = UserEntity.toJson(updateUser[0]);
            return CustomSuccess.ok('your account is validated',userEntity);
        }catch(error){
            throw error;
        }
    }

    static verifySession = async (token:string) => {
        try{
            const response = await Connection.knexPool('user_sessions').select('*').where('session_token', token);
            if(!response.length){
                throw CustomError.unauthorized("unauthorized",{});
            }
            return response[0];
        }catch(error){
            throw error;
        }
    }

    login = async (email:string, password:string) => {
        try{
            const response = await Connection.knexPool('users as u').select(
                'u.id',
                'u.name',
                'u.email',
                'u.type_of_user',
                'u.is_active',
                'u.created_at',
                'u.password',
                'o.id as id_organization',
                'o.name  as name_organization',
                'o.industry  as industry_organization',
                'o.phone  as phone_organization',
                'o.address as address_organization',
                'o.num_employees as num_employees_organization'
            ).leftJoin('organization_users as ou','u.id','ou.user_id')
            .leftJoin('organizations as o','o.id','ou.organization_id')
            .where('u.email', email);
            if(response.length == 0 ){
                throw CustomError.notFound("Account not found",{email:["your account does not exist"]});
            }
            const user = response[0];
            const compare = Bcrypt.compare(password, user.password);
            if(!compare){
                throw CustomError.badRequest("Password is invalid", {password:"Password is invalid"});
            }
            
            let _uuid = uuidv4();
            await Connection.knexPool('user_sessions').insert({
                user_id: user.id,
                session_token: _uuid
            })
            const token = await JwtConfig.generate({ id:user.id, token: _uuid }, envs.EXPIRED_SESSION);
            if(!token) throw CustomError.internalServer('Error while creating jwt');

            const userEntity = UserEntity.toJson({...user,accessToken:token});

            // almacenamos los datos del usuario en redis;
            Connection.redisClient.set(`[user][${user.id}]`,JSON.stringify(userEntity), {'EX': envs.EXPIRED_CACHE_SESSION });
            return CustomSuccess.ok('Login is success',userEntity);
        }catch(error){
            throw error;
        }
    }
}
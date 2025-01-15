import { Request, Response } from "express";
import { UserDto } from "../dtos/user.dto";
import { CustomError } from "../config/CustomError";
import { UserService } from "../services/user.services";
import { MailService } from "../services/mail.service";
import { LoginDto } from "../dtos/login.dto";
import { envs } from "@src/config/envs";
import { Auth } from "@src/services/auth.service";
import { Connection } from "@src/config/database";
import { CustomSuccess } from "@src/config/CustomSuccess";

export class UserController{
    private readonly userService:UserService;

    constructor(){
        this.userService = new UserService();
    }

    user = (request:Request, response:Response) => {
        let _user = Auth.user;
        response.json(CustomSuccess.ok('user',_user));
    }

    register = (request: Request,response:Response) =>{
        const [ errors, userDto ] = UserDto.validate(request.body);
        if(errors){
            return CustomError.handleError(CustomError.badRequest(errors.message, errors), response);
        }
        this.userService.register(userDto!).then( resp => {
            const { data } = resp  as any;
            // Gatillamos envío de correo
            MailService.sendMail({
                from: "Agenda app <moisesrob@gmail.com>",
                to: data?.user.email!,
                subject: "Registro usuario | Validar cuenta",
                html: `<h3>Gracias por registrarte en <strong>Agenda App</strong></h3>
                <p>Para continuar por favor confirma tu cuenta.</p>
                <a href='${envs.URL()}/api/user/validate/${data?.user.hash_account}'>Confirmar cuenta</a>
                `
            });
            response.json(resp);
        })
        .catch( error => {
            return CustomError.handleError(error, response );
        })
    }

    validateAccount = async (request:Request, response:Response) => {
        const { id } = request.params;
        if(!id){
            return CustomError.handleError(CustomError.badRequest('Id account is required',{}), response);
        }
        try {
            const validated = await this.userService.validateAccount(id);
            response.status(validated.statusCode).json(validated);
        } catch (error) {
            return CustomError.handleError(error,response);
        }
    }

    login = async(request:Request, response:Response) => {
        const { body } = request;
        const [errors, loginDto] = LoginDto.validate(body);
        if(errors){
            return CustomError.handleError(errors, response);
        }
        try {
            const login = await this.userService.login(body.email, body.password);
            response.json(login);
        } catch (error) {
            return CustomError.handleError(error,response);

        }
    }
}
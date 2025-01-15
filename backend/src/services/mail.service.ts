import nodemailer,{ Transporter } from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

interface SendMailI{
    from:string,
    to:string,
    subject:string,
    html:string
}
export class MailService{
    
    private  static transporter: Transporter;
    constructor(
        host: string, 
        port: number,
        secure:boolean,
        user: string,
        pass: string
    ){
        const options: SMTPTransport.Options = {
            host,
            port,
            secure,
            auth:{
                user,
                pass
            }
        }
        MailService.transporter = nodemailer.createTransport(options);
    }

    verify = async ():Promise<void> => {
        try {
            await MailService.transporter.verify();
            console.log('Server email is ready');
        } catch (error) {
            console.log('Server email is not ready');
        }
    } 

    static sendMail = async ({
        from,
        to,
        subject,
        html
    }:SendMailI) => {
        try {
            await this.transporter.sendMail({
                from,
                to,
                subject,
                html
            })
            return true
        } catch (error) {
            return false
        }
    }
}
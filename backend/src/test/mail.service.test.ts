import {describe, expect, it} from '@jest/globals';
import { MailService } from "../services/mail.service";
import { envs } from "../config/envs";

describe("Prueba de envio de correo", () => {
    const mailer = new MailService(envs.MAIL_HOST(),envs.MAIL_PORT(),false,envs.MAIL_USER(),envs.MAIL_PASS());

    it("Probando conexión con el servidor de correo", async () => {
        await expect(mailer.verify()).resolves.not.toThrow();
    });

    it("Envio de correo de prueba", async () => {
        await expect(MailService.sendMail({
            from: "Agenda app <moisesrob@gmail.com>",
            to: "moisesrob@outlook.es",
            subject: "Registro usuario | Validar cuenta",
            html: `<h3>Gracias por registrarte en <strong>Agenda App</strong></h3>
            <p>Para continuar por favor confirma tu cuenta.</p>
            <a href='http://localhost:3000/api/user/validate'>Confirmar cuenta</a>
            `
        })).resolves.not.toThrow();
    });
})
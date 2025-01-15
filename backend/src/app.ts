import express, {Router} from 'express';
import { Connection } from './config/database';
import { envs } from './config/envs';
import { UserController } from './controllers/user.controller';
import { ApiRouter } from './router/api';
import { MailService } from './services/mail.service';
import cors from 'cors';
class  Application{
    private app = express();
    private readonly port:number;
    private readonly routes:Router;

    constructor({ port, routes }: { port: number, routes:Router }){
        this.port = port;
        this.routes = routes;
    }

    runApplication(){
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended: true }));
        this.app.use(cors({
            origin: '*', // Reemplaza con la URL de tu cliente
            methods: ['GET', 'POST', 'PUT', 'DELETE'],
        }));
        //Definición a la conexión a la base de datos 
        const connection = new Connection();

        connection.init('pg');
        connection.init('redis');
        //Inicializar servidores de correo
        const mailer = new MailService(envs.MAIL_HOST(),envs.MAIL_PORT(),false,envs.MAIL_USER(),envs.MAIL_PASS());
        mailer.verify();
        
        //Definición de rutas
        this.app.use(this.routes);
        this.app.listen(this.port, () => {
            console.log('server is running in port ' + this.port)
        })

    }
}

const app = new Application({
    port: envs.PORT(),
    routes: ApiRouter.route
})

app.runApplication();
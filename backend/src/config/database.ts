import { Pool } from 'pg';
import { envs } from './envs';
import { createClient } from 'redis';
import Knex, { Knex as typeKnex } from 'knex';
export class Connection{

    public static typeConnection: 'pg' | 'mysql' | 'redis';
    public static postgresql:Pool;
    public static knexPool : typeKnex | any;
    public static redisClient:any;

    public async init(typeConnection:'pg' | 'mysql' | 'redis'){ 
        if(typeConnection === 'pg'){
            await this.postgresSql();
        }
        if(typeConnection === 'redis'){
            await this.redisDb();
        }
    }

    private async postgresSql(){

        const knex = Knex({
            client: 'pg',
            connection: {
              host: envs.POSTGRE_HOST(),
              user: envs.POSTGRE_USER(),
              password: envs.POSTGRE_PASSWORD(),
              database: envs.POSTGRE_DB(),
              port:envs.POSTGRE_PORT()
            },
            pool: {
                min: 2,  // Número mínimo de conexiones
                max: 10, // Número máximo de conexiones
              },
              debug:true
          });
          try {
                const a =  await knex.raw('SELECT  1');
                console.log('Conectado a pg establecida');
                Connection.knexPool = knex;
          } catch (error) {
                console.error('Connection error:', error);
          }

    }

    private async redisDb(){
        let url = `redis://${envs.REDIS_HOST()}:${envs.REDIS_PORT()}`;
        const client = createClient({
            url
        });

        client.on('connect', () => {
            console.log('Conectado a Redis');
          });
        
        client.on('error', (err) => {
            console.error('Error al conectar a Redis:', err);
        });
        try {
            await client.connect();
            Connection.redisClient = client;
        } catch (error) {
            console.log('Error redis', error);            
        }
    }
}
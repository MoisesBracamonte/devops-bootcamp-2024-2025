import { PsqlDto } from "@src/dtos/psql.dto";
import { Response, response } from "express";

export class CustomError extends Error {

    constructor(
      public readonly statusCode: number,
      public readonly message: string,
      public readonly data:Record<string,any> | undefined,
    ){
      super(message);
    }
  
    static badRequest(message: string, data:Record<string,any> = {}) {
      return new CustomError(400, message, data);
    }
  
    static unauthorized(message: string, data:Record<string,any>) {
      return new CustomError(401, message, data);
    }
  
    static forbidden(message: string, data:Record<string,any>) {
      return new CustomError(403, message, data);
    }
  
    static notFound(message: string, data:Record<string,any>) {
      return new CustomError(404, message, data);
    }
  
    static internalServer(message: string, data:Record<string,any> = {}) {
      return new CustomError(500, message, data);
    }

    static conflict(message: string, data:Record<string,any> = {}) {
      return new CustomError(409, message, data);
    }
  
    static handleError = (error: unknown, res: Response = response ) => {
      if ( error instanceof CustomError) {
        return res.status(error.statusCode).json({
          message: error.message,
          errors: error.data
        });
      }
      return res.status(500).json({ error: 'Internal server error' })
  } 
  
  }

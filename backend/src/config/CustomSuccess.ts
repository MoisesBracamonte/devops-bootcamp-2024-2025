export class CustomSuccess {
    constructor(
      public readonly statusCode: number,
      public readonly message: string,
      public readonly data: Record<string, any> | undefined,
    ) {}
  
    static created(message: string, data: Record<string, any> = {}) {
      return new CustomSuccess(201, message, data); // Código 201 para Created
    }
  
    static ok(message: string, data: Record<string, any> = {}) {
      return new CustomSuccess(200, message, data); // Código 200 para OK
    }
  
    static noContent(message: string = "No content", data: Record<string, any> = {}) {
      return new CustomSuccess(204, message, data); // Código 204 para No Content
    }
  }
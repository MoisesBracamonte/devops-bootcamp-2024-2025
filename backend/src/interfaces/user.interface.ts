export interface IsessionVerify{
          id: number,
          user_id: number,
          session_token: string,
          session_start: Date,
          session_end: Date | undefined | null,
          revoked: boolean
}

export enum type_of_user_enum{
    individual= 'individual',
    organization= 'organization'
}
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"

export const authConfig = {
    providers: [
        Credentials({
          authorize: async (credentials, req) => {
              const {email, password} = credentials as { email:string, password:string };
              let url = process.env.NEXT_PUBLIC_API_URL || 'http://defaul-api:3000'
              try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/user/login`, {
                  method: 'POST',
                  headers: {
                    'content-type': 'application/json',
                  },
                  body: JSON.stringify({ email, password })
                });
                const r = await response.json();
                if(!response.ok){
                  throw { status: response.status, data: r};
                }
                return r.data.user;
              } catch (error) {
                throw new Error(JSON.stringify(error));
              }
          },
        }),
    ]
} satisfies NextAuthConfig
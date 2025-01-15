import NextAuth from "next-auth"
import { authConfig } from "./auth.config"
export const { handlers, signIn, signOut, auth } = NextAuth({
    ...authConfig,
    secret: process.env.AUTH_SECRET,
    pages:{
      signIn:'/auth/login'
    },
    callbacks: {
      // este se ejecuta cuando se crea la sesion, acá se agrega información adicional.
      jwt({ token, user }){
        if(user){
          token = { ...user, ...token};
        }
        return token;
      },

      // acá se agrega información del token a la sesión del usuario.
      session({ session, token }){
        if(session.user){
          session.user = { ...token, ...session.user };
        }
        return session;
      }
    }
})
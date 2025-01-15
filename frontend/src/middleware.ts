import NextAuth from 'next-auth';
import { authConfig } from './auth.config';
import { NextResponse } from 'next/server';
import next from 'next';
 
// export default NextAuth(authConfig).auth;
 
const publicRouter = ["/register", "/login", "/"];

const { auth } = NextAuth(authConfig);

export default auth( (req) => {
 const { nextUrl } = req;
 const isLoggedIn = !!req.auth;

 // si tiene sesión iniciada y  va a una de las rutas públicas. Se redirecciona al dashboard
 if(publicRouter.includes(nextUrl.pathname) && isLoggedIn){
    return NextResponse.redirect(new URL("/dashboard", nextUrl));
 }
 // si trata de acceder a una ruta distinta a las públicas y no tiene sesión iniciada, lo enviamos al login.
 if(!publicRouter.includes(nextUrl.pathname) && !isLoggedIn){
    return NextResponse.redirect(new URL("/login", nextUrl));
 }
 return NextResponse.next();
});

export const config = {
  // https://nextjs.org/docs/app/building-your-application/routing/middleware#matcher
  matcher: ['/((?!api|_next/static|_next/image|.png).*)'],
};
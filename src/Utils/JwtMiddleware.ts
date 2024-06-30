import { Context } from "hono";
import { getCookie } from "hono/cookie";
import { createMiddleware } from "hono/factory";
import ResponseHandler from "./ResponseHandler";
import { verify } from "hono/jwt";

const JwtMiddleware = createMiddleware(async (c:Context , next)=>{
    const token = getCookie(c , 'token');
    if(!token){
        return c.json(new ResponseHandler(false , "Forbidden" , {}) , 401);
    }

    const payload = await verify(token , c.env.JWT_SECRET);
    if(!payload){
        return c.json(new ResponseHandler(false , "Something went Wrong! Login Again" , {}) , 401);
    }

    c.set('jwtPayload' , payload);

    await next();
});

export default JwtMiddleware;
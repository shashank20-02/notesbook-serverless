import { Hono } from "hono";
import { LoginUser, RegisterUser , LogoutUser, getUser } from "../Controllers/UserController";
import { JWTPayload } from "hono/utils/jwt/types";
import JwtMiddleware from "../Utils/JwtMiddleware";


const app = new Hono<{
    Bindings:{
        DATABASE_URL : string;
        JWT_SECRET : string;
    },
    Variables : {
        jwtPayload : JWTPayload;
    }
}>();

app.post('/signup' ,RegisterUser);
app.post('/signin' , LoginUser);
app.delete('/logout' , LogoutUser);
app.get('/me' , JwtMiddleware ,getUser);

export default app;
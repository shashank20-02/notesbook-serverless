import ResponseHandler from "../Utils/ResponseHandler";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import bcrypt from 'bcryptjs';
import {sign} from 'hono/jwt';
import {deleteCookie, setCookie} from 'hono/cookie';
import { Context } from "hono";

export const RegisterUser = async (c:Context)=>{
    try {
        const prisma = new PrismaClient({datasourceUrl : c.env.DATABASE_URL}).$extends(withAccelerate());
        type reqBody = {
            name : string;
            email : string;
            password : string;
        }
        let {name , email ,password} : reqBody = await c.req.json();
        if(!name || !email || !password){
            return c.json(new ResponseHandler(false , "All fields are required" , {}) , 400);
        }

        const userExists = await prisma.user.findUnique({
            where : {
                email,
            }
        });

        if(userExists){
            return c.json(new ResponseHandler(false , "Please check email or password. Something went wrong!!" , {}) , 400);
        }
        password = await bcrypt.hash(password , 10);
        const user = await prisma.user.create({
            data : {
                name,
                email,
                password
            }
        });
        const token = await sign({email : user.email} , c.env.JWT_SECRET);
        setCookie(c , 'token' , token , {httpOnly : true , sameSite : 'None' , secure : false , expires : new Date(new Date().setDate(new Date().getDate() + 7))});

        return c.json(new ResponseHandler(true , "User Created Successfully" , {}) , 201);
    } catch (e) {
        return c.json(new ResponseHandler(false , JSON.stringify(e) , {}) , 500);
    }
}

export const LoginUser = async (c:Context) => {
    try {
        const prisma = new PrismaClient({datasourceUrl : c.env.DATABASE_URL}).$extends(withAccelerate());
        type reqBody = {
            email : string;
            password : string;
        }
        let { email ,password} : reqBody = await c.req.json();
        if(!email || !password){
            return c.json(new ResponseHandler(false , "All fields are required" , {}) , 400);
        }

        const userExists = await prisma.user.findUnique({
            where : {
                email,
            }
        });

        if(!userExists){
            return c.json(new ResponseHandler(false , "Please check email or password. Something went wrong!!" , {}) , 400);
        }
        const passMatches = await bcrypt.compare(password , userExists.password);
        if(!passMatches){
            return c.json(new ResponseHandler(false , "Please check email or password. Something went wrong!!" , {}) , 400);
        }

        const token = await sign({email : userExists.email} , c.env.JWT_SECRET);
        setCookie(c , 'token' , token , {httpOnly : true , sameSite : 'None' , secure : false , expires : new Date(new Date().setDate(new Date().getDate() + 7))});

        return c.json(new ResponseHandler(true , "User LoggedIn Successfully" , {}) , 200);
    } catch (e) {
        return c.json(new ResponseHandler(false , JSON.stringify(e) , {}) , 500);
    }
}

export const LogoutUser = async (c : Context) =>{
    try {
        deleteCookie(c , 'token' , {httpOnly : true , sameSite : 'None' , secure : false , expires : new Date(new Date().setDate(new Date().getDate() + 7))});
        return c.json(new ResponseHandler(true , "User Logout Successfully!" , {}) , 200);
    } catch (e) {
        return c.json(new ResponseHandler(false , JSON.stringify(e) , {}) , 500);
    }
}

export const getUser = async (c:Context) =>{
    try {
        const prisma = new PrismaClient({datasourceUrl : c.env.DATABASE_URL}).$extends(withAccelerate());
        const payload = c.get('jwtPayload');
        let email = payload?.email;
        if(!payload || !email)    return c.json(new ResponseHandler(false , "Forbidden" , {}) , 401);
        
        const user = await prisma.user.findFirst({
            where : {
                email,
            },
            select:{
                name : true,
                email : true,
                createdAt : true,
                updatedAt : true,
            }
        });
        return c.json(new ResponseHandler(true , "User Fetched Successfully" , {user}) , 200);
        
    } catch (e) {
        return c.json(new ResponseHandler(false , JSON.stringify(e) , {}) , 500);
    }
}
import ResponseHandler from "../Utils/ResponseHandler";
import { PrismaClient } from '@prisma/client/edge'
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context } from "hono";

export const createNote = async (c:Context) =>{
    try {
        const prisma = new PrismaClient({datasourceUrl : c.env.DATABASE_URL}).$extends(withAccelerate());
        const email = c.get('jwtPayload')?.email;
        if(!email)  return c.json(new ResponseHandler(false , "Forbidden" , {}) , 401)
        let user = await prisma.user.findUnique({
            where : {
                email
            }
        });
        if(!user){
            return c.json(new ResponseHandler(false , "Forbidden" , {}) , 401)
        }

        
        type Body = {
            title : string;
            description : string;
        }

        const {title , description} : Body = await c.req.json();
        if(!title || !description){
            return c.json(new ResponseHandler(false , "All fields are required" , {}) , 400);
        }

        const createdNote = await prisma.note.create({
            data : {
                title,
                description,
                authorId : user.id
            }
        });

        return c.json(new ResponseHandler(true , "Note Created Successfully" , {note : createdNote}) , 201);
    } catch (e) {
        return c.json(new ResponseHandler(false , JSON.stringify(e) , {}) , 500);
    }
};

export const updateNote = async (c:Context) =>{
    try {
        const prisma = new PrismaClient({datasourceUrl : c.env.DATABASE_URL}).$extends(withAccelerate());
        const email = c.get('jwtPayload')?.email;
        const id = c.req.param('id');
        if(!email || !id)  return c.json(new ResponseHandler(false , "Forbidden" , {}) , 401)
        let user = await prisma.user.findUnique({
            where : {
                email
            }
        });
        if(!user){
            return c.json(new ResponseHandler(false , "Forbidden" , {}) , 401)
        }

        
        type Body = {
            title : string;
            description : string;
        }

        const {title , description} : Body = await c.req.json();
        if(!title || !description){
            return c.json(new ResponseHandler(false , "All fields are required" , {}) , 400);
        }

        const updatedNote = await prisma.note.update({
            where : {
                id,
                authorId : user.id,
            },
            data:{
                title,
                description,
            }
        });

        return c.json(new ResponseHandler(true , "Note Updated Successfully" , {note : updatedNote}) , 200);

    } catch (e) {
        return c.json(new ResponseHandler(false , JSON.stringify(e) , {}) , 500);
    }
};

export const deleteNote = async (c:Context) =>{
    try {
        const prisma = new PrismaClient({datasourceUrl : c.env.DATABASE_URL}).$extends(withAccelerate());
        const email = c.get('jwtPayload')?.email;
        const id = c.req.param('id');
        if(!email || !id)  return c.json(new ResponseHandler(false , "Forbidden" , {}) , 401)
        let user = await prisma.user.findUnique({
            where : {
                email
            }
        });
        if(!user){
            return c.json(new ResponseHandler(false , "Forbidden" , {}) , 401)
        }
        
        const deletedNote = await prisma.note.delete({
            where : {
                id,
                authorId : user.id
            },
        })
        if(!deletedNote){
            return c.json(new ResponseHandler(false , "Note was not Found" , {}) , 502);
        }
        return c.json(new ResponseHandler(true , "Note Deleted Successfully" , {}) , 200);
    } catch (e) {
        return c.json(new ResponseHandler(false , JSON.stringify(e) , {}) , 500);
    }
};

export const getNote = async (c:Context) => {
    try {
        const prisma = new PrismaClient({datasourceUrl : c.env.DATABASE_URL}).$extends(withAccelerate());
        const email = c.get('jwtPayload')?.email;
        const id = c.req.param('id');
        if(!email || !id)  return c.json(new ResponseHandler(false , "Forbidden" , {}) , 401)
        let user = await prisma.user.findUnique({
            where : {
                email
            }
        });
        if(!user){
            return c.json(new ResponseHandler(false , "Forbidden" , {}) , 401)
        }
        const note = await prisma.note.findUnique({
            where : {
                id,
                authorId : user.id
            },
        })
        if(!note){
            return c.json(new ResponseHandler(false , "Note was not Found" , {}) , 502);
        }
        return c.json(new ResponseHandler(true , "Note Fetched Successfully" , {note}) , 200);
    } catch (e) {
        return c.json(new ResponseHandler(false , JSON.stringify(e) , {}) , 500);
    }
}

export const getAllNotes = async (c:Context) => {
    try {
        const prisma = new PrismaClient({datasourceUrl : c.env.DATABASE_URL}).$extends(withAccelerate());
        const email = c.get('jwtPayload')?.email;
        if(!email)  return c.json(new ResponseHandler(false , "Forbidden" , {}) , 401)
            let user = await prisma.user.findUnique({
                where : {
                    email
                }
            });
            if(!user){
                return c.json(new ResponseHandler(false , "Forbidden" , {}) , 401)
            }
            const notes = await prisma.note.findMany({
                where : {
                    authorId : user.id
                },
            })
            return c.json(new ResponseHandler(true , "Note Fetched Successfully" , {notes}) , 200);
    } catch (e) {
        return c.json(new ResponseHandler(false , JSON.stringify(e) , {}) , 500);
    }
}
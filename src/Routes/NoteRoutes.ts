import { Hono } from "hono";
import { JWTPayload } from "hono/utils/jwt/types";
import { createNote, deleteNote, getAllNotes, getNote, updateNote } from "../Controllers/NoteController";
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

app.get('/all' , JwtMiddleware ,getAllNotes);
app.get('/:id' , JwtMiddleware , getNote);
app.post('/' ,JwtMiddleware , createNote);
app.patch('/:id' , JwtMiddleware , updateNote);
app.delete('/:id' , JwtMiddleware ,deleteNote);

export default app;
import { Hono } from 'hono'
import UserRoutes from './Routes/UserRoutes';
import NoteRoutes from './Routes/NoteRoutes';
const app = new Hono()

app.route('/api/v1/user' , UserRoutes);
app.route('/api/v1/note' , NoteRoutes);

app.get('/', (c) => {
  return c.text('Hello Hono!')
})

export default app

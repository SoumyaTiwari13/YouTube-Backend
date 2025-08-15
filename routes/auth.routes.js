import { register, login, me } from '../controllers/auth.controller.js';
import { auth } from '../middleware/auth.js';

export function authRoutes(app){

app.post('/register', register);
app.post('/login', login);
app.get('/me', auth, me);
}
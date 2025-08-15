import { auth } from '../middleware/auth.js';
import { updateComment, deleteComment } from '../controllers/comment.controller.js';
export function commentRoutes(app){

app.put('/:commentId', auth, updateComment);
app.delete('/:commentId', auth, deleteComment);

}

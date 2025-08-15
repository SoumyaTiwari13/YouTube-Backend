import { auth } from '../middleware/auth.js';
import { listVideos, getVideo, createVideo, updateVideo, deleteVideo, toggleLike } from '../controllers/video.controller.js';
import { addComment, listComments } from '../controllers/comment.controller.js';

export function videoRoutes(app){

app.get('/videos', listVideos);
app.get('/videos/:id', getVideo);
app.post('/videos', auth, createVideo);
app.put('/videos/:id', auth, updateVideo);
app.delete('/videos/:id', auth, deleteVideo);

app.post('/:id/like', auth, toggleLike);      // ?action=like|dislike
app.get('/:id/comments', listComments);
app.post('/:id/comments', auth, addComment);

}
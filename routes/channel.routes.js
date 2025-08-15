import { auth } from '../middleware/auth.js';
import { createChannel, getChannel, getChannelVideos } from '../controllers/channel.controller.js';
export function channelRoutes(app){

app.post('/channel', auth, createChannel);
app.get('/channel/:id', getChannel);
app.get('/channel/:id/videos', getChannelVideos);

}

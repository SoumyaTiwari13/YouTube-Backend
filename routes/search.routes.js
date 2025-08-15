import { listVideos } from '../controllers/video.controller.js';

export function searchRoutes(app){
// Proxy to videos list with search/filter params
app.get('/videos', listVideos);

}

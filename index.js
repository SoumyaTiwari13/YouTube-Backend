import express from 'express';
import {authRoutes} from './routes/auth.routes.js';
import {channelRoutes} from './routes/channel.routes.js';
import {videoRoutes} from './routes/video.routes.js';
import {commentRoutes} from './routes/comment.routes.js';
import {searchRoutes} from './routes/search.routes.js';
import mongoose from "mongoose";
import cors from "cors";

const app = express();

mongoose.connect('mongodb+srv://engrsoumyatiwari:gaZ8m9I4mwuixRfW@cluster3.yb6anm6.mongodb.net/')//connect reurns a promise
.then(() =>{
    console.log("MongoDB connected");
})
.catch(()=>{
    console.log("DB failed", err);
})

app.use(express.json({ limit: '1mb' }));
app.use(cors({ origin: 'http://localhost:5180' || '*' }));

//Routes
authRoutes(app);
channelRoutes(app);
videoRoutes(app);
commentRoutes(app);
searchRoutes(app);

app.get('/', (req,res)=>{
    res.send(["My YouTube Clone"])
})

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`SERVER CONNECTED AT PORT: ${PORT}`);
});



//engrsoumyatiwari
//9GY8aXn9WjIqtFaq
//mongodb+srv://engrsoumyatiwari:gaZ8m9I4mwuixRfW@cluster3.yb6anm6.mongodb.net/
import { Video } from '../models/Video.js';
import { Comment } from '../models/Comment.js';

export const listVideos = async (req, res) => {
  const { search = '', category } = req.query;
  const q = {};
  if (search) q.title = { $regex: search, $options: 'i' };
  if (category && category !== 'All') q.category = category;
  const vids = await Video.find(q).populate('channel', 'channelName').sort({ createdAt: -1 });
  res.json(vids);
};

export const getVideo = async (req, res) => {
  const v = await Video.findById(req.params.id).populate('channel', 'channelName');
  if (!v) return res.status(404).json({ message: 'Not found' });
  res.json(v);
};


export const createVideo = async (req, res) => {
  const { title, description, url, thumbnailUrl, channelId, category = 'All' } = req.body;
  const video = await Video.create({
    videoId: `video_${Date.now()}`,
    title, description, url, thumbnailUrl,
    channel: channelId,
    uploader: req.user?.id,
    category
  });
  res.status(201).json(video);
};

export const updateVideo = async (req, res) => {
  const v = await Video.findById(req.params.id);
  if (!v) return res.status(404).json({ message: 'Not found' });
  if (String(v.uploader) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  Object.assign(v, req.body);
  await v.save();
  res.json(v);
};

export const deleteVideo = async (req, res) => {
  const v = await Video.findById(req.params.id);
  if (!v) return res.status(404).json({ message: 'Not found' });
  if (String(v.uploader) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  await Comment.deleteMany({ video: v._id });
  await v.deleteOne();
  res.json({ message: 'Deleted' });
};

export const toggleLike = async (req, res) => {
  const v = await Video.findById(req.params.id);
  if (!v) return res.status(404).json({ message: 'Not found' });
  const uid = req.user.id;
  v.likedBy = v.likedBy.filter((id) => String(id) !== uid);
  v.dislikedBy = v.dislikedBy.filter((id) => String(id) !== uid);
  if (req.query.action === 'like') v.likedBy.push(uid);
  if (req.query.action === 'dislike') v.dislikedBy.push(uid);
  await v.save();
  res.json({ likes: v.likedBy.length, dislikes: v.dislikedBy.length });
};


 export const handleCategory = async (req, res) => {
  try {
    const { category } = req.query;  // <-- query instead of body
    let videos;

    if (category === "all") {
      videos = await youtubeCollection.find({});
    } else {
      videos = await youtubeCollection.find({ category });
    }

    res.status(200).json({ success: true, data: videos });
  } catch (error) {
    console.error("Error fetching videos:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};


export const handleSearch = async (req, res)=> {
  try {
    const { search } = req.body;

    if (!search || typeof search !== 'string') {
      return res.status(400).json({ error: 'Search term is required and must be a string.' });
    }

    const searchItem = await youtubeCollection.find({
      title: { $regex: search, $options: 'i' } // case-insensitive search
    });


    return res.status(200).json(searchItem);
  } catch (error) {
    console.error('Search error:', error);
    return res.status(500).json({ error: 'Internal server error.' });
  }
}



export const handleLike = async (req, res)=> {
  try {
    const { videoId, userId } = req.body;

    if (!videoId || !userId) {
      return res.status(400).json({ message: "videoId and userId are required" });
    }

    const video = await youtubeCollection.findOne({ videoId });
    const user = await User.findById(userId);

    if (!video) {
      return res.status(404).json({ message: "Video not found" });
    }

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Initialize arrays if they don't exist
    if (!user.likedVideos) user.likedVideos = [];
    if (!video.likedBy) video.likedBy = [];

    const alreadyLiked = user.likedVideos.includes(videoId);

    if (alreadyLiked) {
      // Unlike: remove videoId from user and userId from video
      user.likedVideos = user.likedVideos.filter(id => id !== videoId);
      video.likedBy = video.likedBy.filter(id => id !== userId);
      video.likes = Math.max(0, video.likes - 1); // Prevent negative likes

      await user.save();
      await video.save();

      return res.status(200).json({ message: "Video unliked successfully" });
    } else {
      // Like: add videoId to user and userId to video
      user.likedVideos.push(videoId);
      video.likedBy.push(userId);
      video.likes = (video.likes || 0) + 1;

      await user.save();
      await video.save();

      return res.status(200).json({ message: "Video liked successfully" });
    }

  } catch (error) {
    console.error("Error liking video:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
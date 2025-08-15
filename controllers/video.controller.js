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

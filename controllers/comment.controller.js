import { Comment } from '../models/Comment.js';

export const listComments = async (req, res) => {
  const comments = await Comment.find({ video: req.params.videoId }).populate('user', 'username');
  res.json(comments);
};

export const addComment = async (req, res) => {
  const c = await Comment.create({
    commentId: `comment_${Date.now()}`,
    video: req.params.videoId,
    user: req.user.id,
    text: req.body.text
  });
  const populated = await c.populate('user', 'username');
  res.status(201).json(populated);
};

export const updateComment = async (req, res) => {
  const c = await Comment.findById(req.params.commentId);
  if (!c) return res.status(404).json({ message: 'Not found' });
  if (String(c.user) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  c.text = req.body.text ?? c.text;
  await c.save();
  res.json(c);
};

export const deleteComment = async (req, res) => {
  const c = await Comment.findById(req.params.commentId);
  if (!c) return res.status(404).json({ message: 'Not found' });
  if (String(c.user) !== req.user.id) return res.status(403).json({ message: 'Forbidden' });
  await c.deleteOne();
  res.json({ message: 'Deleted' });
};

import { Channel } from '../models/Channel.js';
import { Video } from '../models/Video.js';

export const createChannel = async (req, res) => {
  const { channelName, description, channelBanner } = req.body;
  const channel = await Channel.create({
    channelId: `channel_${Date.now()}`,
    channelName, description, channelBanner, owner: req.user.id
  });
  res.status(201).json(channel);
};

export const getChannel = async (req, res) => {
  const ch = await Channel.findById(req.params.id).populate('owner', 'username');
  if (!ch) return res.status(404).json({ message: 'Channel not found' });
  res.json(ch);
};

export const getChannelVideos = async (req, res) => {
  const vids = await Video.find({ channel: req.params.id }).sort({ createdAt: -1 });
  res.json(vids);
};

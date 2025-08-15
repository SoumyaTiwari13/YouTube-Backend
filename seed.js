import User  from '../models/User.js';
import { Channel } from '../models/Channel.js';
import { Video } from '../models/Video.js';
import { Comment } from '../models/Comment.js';

const run = async () => {
  mongoose.connect('mongodb+srv://engrsoumyatiwari:Uxlhg6fxTM7gaRxM@cluster1.xojxw5s.mongodb.net/')
  await Promise.all([User.deleteMany({}), Channel.deleteMany({}), Video.deleteMany({}), Comment.deleteMany({})]);

  const user = await User.create({
    userId: 'user01',
    username: 'JohnDoe',
    email: 'john@example.com',
    password: 'hashedPassword123', // will be hashed by pre-save
    avatar: 'https://example.com/avatar/johndoe.png'
  });

  const channel = await Channel.create({
    channelId: 'channel01',
    channelName: 'Code with John',
    owner: user._id,
    description: 'Coding tutorials and tech reviews by John Doe.',
    channelBanner: 'https://example.com/banners/john_banner.png',
    subscribers: 5200
  });

  const video = await Video.create({
    videoId: 'video01',
    title: 'Learn React in 30 Minutes',
    description: 'A quick tutorial to get started with React.',
    url: 'https://example.com/videos/react30min.mp4',
    thumbnailUrl: 'https://example.com/thumbnails/react30min.png',
    channel: channel._id,
    uploader: user._id,
    views: 15200,
    category: 'Education',
    uploadDate: new Date('2024-09-20T00:00:00Z')
  });

  await Comment.create({
    commentId: 'comment01',
    video: video._id,
    user: user._id,
    text: 'Great video! Very helpful.',
    timestamp: new Date('2024-09-21T08:30:00Z')
  });

  console.log('Seeded!');
  process.exit(0);
};

run().catch((e) => { console.error(e); process.exit(1); });

import mongoose from 'mongoose';

const videoSchema = new mongoose.Schema({
  videoId: { type: String, unique: true },
  title: { type: String, required: true, index: 'text' },
  description: String,
  url: { type: String, required: true },         // video file URL (CDN/local)
  thumbnailUrl: { type: String, required: true },
  channel: { type: mongoose.Schema.Types.ObjectId, ref: 'Channel', required: false },
  uploader: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  category: { type: String, default: 'All' },
  views: { type: Number, default: 0 },
  likedBy: Number,
  dislikedBy: Number,
  uploadDate: { type: Date, default: Date.now }
}, { timestamps: true });

export const Video = mongoose.model('Video', videoSchema);

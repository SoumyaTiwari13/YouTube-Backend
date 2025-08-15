import mongoose from 'mongoose';

const channelSchema = new mongoose.Schema({
  channelId: { type: String, unique: true },
  channelName: { type: String, required: true, trim: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  description: String,
  channelBanner: String,
  subscribers: { type: Number, default: 0 }
}, { timestamps: true });

export const Channel = mongoose.model('Channel', channelSchema);

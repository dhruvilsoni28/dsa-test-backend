import mongoose from 'mongoose';

const topicSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, default: '' },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

topicSchema.index({ order: 1 });

export const Topic = mongoose.model('Topic', topicSchema);

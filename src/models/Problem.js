import mongoose from 'mongoose';

const difficultyValues = ['easy', 'medium', 'hard'];

const problemSchema = new mongoose.Schema(
  {
    topic: { type: mongoose.Schema.Types.ObjectId, ref: 'Topic', required: true, index: true },
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    difficulty: { type: String, enum: difficultyValues, required: true },
    youtubeUrl: { type: String, trim: true, default: '' },
    practiceUrl: { type: String, trim: true, default: '' },
    articleUrl: { type: String, trim: true, default: '' },
    order: { type: Number, required: true, default: 0 },
  },
  { timestamps: true }
);

problemSchema.index({ topic: 1, order: 1 });
problemSchema.index({ topic: 1, slug: 1 }, { unique: true });

export const Problem = mongoose.model('Problem', problemSchema);
export { difficultyValues };

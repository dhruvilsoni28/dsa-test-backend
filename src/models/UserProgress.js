import mongoose from 'mongoose';

const userProgressSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem', required: true },
    completed: { type: Boolean, default: false },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

userProgressSchema.index({ user: 1, problem: 1 }, { unique: true });
userProgressSchema.index({ user: 1, completed: 1 });

export const UserProgress = mongoose.model('UserProgress', userProgressSchema);

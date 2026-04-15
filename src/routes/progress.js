import { Router } from 'express';
import mongoose from 'mongoose';
import { Problem } from '../models/Problem.js';
import { UserProgress } from '../models/UserProgress.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (req, res) => {
  try {
    const rows = await UserProgress.find({ user: req.userId, completed: true })
      .select('problem')
      .lean();
    const completedProblemIds = rows.map((r) => String(r.problem));
    return res.json({ completedProblemIds });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load progress' });
  }
});

router.put('/:problemId', async (req, res) => {
  try {
    const { problemId } = req.params;
    const { completed } = req.body ?? {};
    if (typeof completed !== 'boolean') {
      return res.status(400).json({ error: 'Body must include completed: boolean' });
    }
    if (!mongoose.isValidObjectId(problemId)) {
      return res.status(400).json({ error: 'Invalid problem id' });
    }
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ error: 'Problem not found' });
    }
    const update = {
      completed,
      completedAt: completed ? new Date() : null,
    };
    const doc = await UserProgress.findOneAndUpdate(
      { user: req.userId, problem: problemId },
      { $set: update },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    return res.json({
      problemId: String(doc.problem),
      completed: doc.completed,
      completedAt: doc.completedAt,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to update progress' });
  }
});

export default router;

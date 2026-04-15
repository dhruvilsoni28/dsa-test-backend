import { Router } from 'express';
import { Topic } from '../models/Topic.js';
import { Problem } from '../models/Problem.js';
import { authMiddleware } from '../middleware/auth.js';

const router = Router();

router.use(authMiddleware);

router.get('/', async (_req, res) => {
  try {
    const topics = await Topic.find().sort({ order: 1 }).lean();
    const counts = await Problem.aggregate([
      { $group: { _id: '$topic', count: { $sum: 1 } } },
    ]);
    const countByTopic = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
    const payload = topics.map((t) => ({
      id: t._id,
      title: t.title,
      slug: t.slug,
      description: t.description,
      order: t.order,
      problemCount: countByTopic[String(t._id)] ?? 0,
    }));
    return res.json({ topics: payload });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load topics' });
  }
});

router.get('/:slug', async (req, res) => {
  try {
    const topic = await Topic.findOne({ slug: req.params.slug }).lean();
    if (!topic) {
      return res.status(404).json({ error: 'Topic not found' });
    }
    const problems = await Problem.find({ topic: topic._id }).sort({ order: 1 }).lean();
    return res.json({
      topic: {
        id: topic._id,
        title: topic.title,
        slug: topic.slug,
        description: topic.description,
        order: topic.order,
      },
      problems: problems.map((p) => ({
        id: p._id,
        title: p.title,
        slug: p.slug,
        difficulty: p.difficulty,
        youtubeUrl: p.youtubeUrl,
        practiceUrl: p.practiceUrl,
        articleUrl: p.articleUrl,
        order: p.order,
      })),
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to load topic' });
  }
});

export default router;

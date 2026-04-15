import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDb } from './db.js';
import { Topic } from './models/Topic.js';
import { Problem } from './models/Problem.js';

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Missing MONGODB_URI');
  process.exit(1);
}

function slugify(s) {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const sheet = [
  {
    title: 'Arrays & Hashing',
    description: 'Foundations for frequency maps, prefix sums, and two-sum style patterns.',
    problems: [
      {
        title: 'Contains Duplicate',
        difficulty: 'easy',
        youtubeUrl: 'https://www.youtube.com/results?search_query=leetcode+contains+duplicate',
        practiceUrl: 'https://leetcode.com/problems/contains-duplicate/',
        articleUrl: 'https://leetcode.com/problems/contains-duplicate/solution/',
      },
      {
        title: 'Two Sum',
        difficulty: 'easy',
        youtubeUrl: 'https://www.youtube.com/results?search_query=two+sum+leetcode',
        practiceUrl: 'https://leetcode.com/problems/two-sum/',
        articleUrl: 'https://leetcode.com/problems/two-sum/solution/',
      },
      {
        title: 'Group Anagrams',
        difficulty: 'medium',
        youtubeUrl: 'https://www.youtube.com/results?search_query=group+anagrams',
        practiceUrl: 'https://leetcode.com/problems/group-anagrams/',
        articleUrl: 'https://leetcode.com/problems/group-anagrams/solution/',
      },
    ],
  },
  {
    title: 'Two Pointers',
    description: 'Sorted array techniques and opposite-end scanning.',
    problems: [
      {
        title: 'Valid Palindrome',
        difficulty: 'easy',
        youtubeUrl: 'https://www.youtube.com/results?search_query=valid+palindrome+leetcode',
        practiceUrl: 'https://leetcode.com/problems/valid-palindrome/',
        articleUrl: 'https://leetcode.com/problems/valid-palindrome/solution/',
      },
      {
        title: '3Sum',
        difficulty: 'medium',
        youtubeUrl: 'https://www.youtube.com/results?search_query=3sum+leetcode',
        practiceUrl: 'https://leetcode.com/problems/3sum/',
        articleUrl: 'https://leetcode.com/problems/3sum/solution/',
      },
      {
        title: 'Watermelon',
        difficulty: 'easy',
        youtubeUrl: 'https://www.youtube.com/results?search_query=codeforces+watermelon',
        practiceUrl: 'https://codeforces.com/problemset/problem/4/A',
        articleUrl: 'https://codeforces.com/blog/entry/514',
      },
    ],
  },
  {
    title: 'Sliding Window',
    description: 'Fixed and variable window subarray problems.',
    problems: [
      {
        title: 'Best Time to Buy and Sell Stock',
        difficulty: 'easy',
        youtubeUrl: 'https://www.youtube.com/results?search_query=best+time+buy+sell+stock',
        practiceUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/',
        articleUrl: 'https://leetcode.com/problems/best-time-to-buy-and-sell-stock/solution/',
      },
      {
        title: 'Longest Substring Without Repeating Characters',
        difficulty: 'medium',
        youtubeUrl: 'https://www.youtube.com/results?search_query=longest+substring+without+repeating',
        practiceUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/',
        articleUrl: 'https://leetcode.com/problems/longest-substring-without-repeating-characters/solution/',
      },
    ],
  },
  {
    title: 'Stack',
    description: 'Parentheses, monotonic stack, and parsing.',
    problems: [
      {
        title: 'Valid Parentheses',
        difficulty: 'easy',
        youtubeUrl: 'https://www.youtube.com/results?search_query=valid+parentheses+leetcode',
        practiceUrl: 'https://leetcode.com/problems/valid-parentheses/',
        articleUrl: 'https://leetcode.com/problems/valid-parentheses/solution/',
      },
      {
        title: 'Daily Temperatures',
        difficulty: 'medium',
        youtubeUrl: 'https://www.youtube.com/results?search_query=daily+temperatures+monotonic+stack',
        practiceUrl: 'https://leetcode.com/problems/daily-temperatures/',
        articleUrl: 'https://leetcode.com/problems/daily-temperatures/solution/',
      },
    ],
  },
  {
    title: 'Binary Search',
    description: 'Sorted search, bounds, and answer-space binary search.',
    problems: [
      {
        title: 'Binary Search',
        difficulty: 'easy',
        youtubeUrl: 'https://www.youtube.com/results?search_query=binary+search+leetcode+704',
        practiceUrl: 'https://leetcode.com/problems/binary-search/',
        articleUrl: 'https://leetcode.com/problems/binary-search/solution/',
      },
      {
        title: 'Search in Rotated Sorted Array',
        difficulty: 'medium',
        youtubeUrl: 'https://www.youtube.com/results?search_query=search+rotated+sorted+array',
        practiceUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/',
        articleUrl: 'https://leetcode.com/problems/search-in-rotated-sorted-array/solution/',
      },
    ],
  },
];

await connectDb(MONGODB_URI);

await Problem.deleteMany({});
await Topic.deleteMany({});

let topicOrder = 0;
for (const block of sheet) {
  const topicSlug = slugify(block.title);
  const topic = await Topic.create({
    title: block.title,
    slug: topicSlug,
    description: block.description,
    order: topicOrder++,
  });
  let pOrder = 0;
  for (const p of block.problems) {
    const base = slugify(p.title);
    await Problem.create({
      topic: topic._id,
      title: p.title,
      slug: `${topicSlug}-${base}-${pOrder}`,
      difficulty: p.difficulty,
      youtubeUrl: p.youtubeUrl,
      practiceUrl: p.practiceUrl,
      articleUrl: p.articleUrl,
      order: pOrder++,
    });
  }
}

console.log('Seed complete:', sheet.length, 'topics');
await mongoose.disconnect();

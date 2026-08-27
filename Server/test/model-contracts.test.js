const test = require('node:test');
const assert = require('node:assert/strict');
const Bookmark = require('../models/Bookmark');
const Multimedia = require('../models/Multimedia');
const QuizQuestion = require('../models/QuizQuestion');

 test('bookmark uniqueness is enforced per user and item', () => {
  const indexes = Bookmark.schema.indexes();
  assert.ok(indexes.some(([fields, options]) => (
    fields.userId === 1 && fields.itemType === 1 && fields.itemId === 1 && options.unique === true
  )));
});

test('multimedia ratings support one rating per user', () => {
  const ratingsPath = Multimedia.schema.path('ratings');
  assert.equal(ratingsPath.schema.path('rating').options.min, 1);
  assert.equal(ratingsPath.schema.path('rating').options.max, 5);
});

test('quiz question model supports every documented interaction type', () => {
  assert.deepEqual(QuizQuestion.schema.path('type').enumValues, [
    'single_choice',
    'slider',
    'likert_scale',
    'multi_select'
  ]);
});

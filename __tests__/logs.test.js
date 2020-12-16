const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Log = require('../lib/models/log');
const Recipe = require('../lib/models/recipe');

describe('log routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./SQL/setup.sql', 'utf-8'));
  });
    
  afterAll(() => {
    return pool.end();
  });

  it('creates a log', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    const log = await Log.insert({
      dateOfEvent: '12/24/20',
      notes: 'here are some notes',
      rating: '10/10',
      recipeId: recipe.id
    });

    return request(app)
      .post('/api/v1/logs')
      .send(log)
      .then(res => {
        expect(res.body).toEqual({ ...log, id: '2' });
      });
  });
});

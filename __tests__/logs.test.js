const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Log = require('../lib/models/log');
const Recipe = require('../lib/models/recipe');

describe('log routes', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));
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

  it('returns all logs', async() => {
    const recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });

    const logs = await Promise.all([
      {
        dateOfEvent: '12/24/20',
        notes: 'here are some notes',
        rating: '10/10',
        recipeId: recipe.id
      },
      {
        dateOfEvent: '12/24/20',
        notes: 'here are some notes',
        rating: '10/10',
        recipeId: recipe.id
      },
      {
        dateOfEvent: '12/24/20',
        notes: 'here are some notes',
        rating: '10/10',
        recipeId: recipe.id
      }
    ].map(log => Log.insert(log)));

    return request(app)
      .get('/api/v1/logs')
      .then(res => {
        logs.forEach(log => {
          expect(res.body).toContainEqual(log);
        });
      });
  });

  it('returns a log by id', async() => {

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

    const res = await request(app)
      .get(`/api/v1/logs/${log.id}`);

    expect(res.body).toEqual(log);
  });
  
  it('updates a log by id', async() => {

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

    const updatedLog = await Log.insert({
      dateOfEvent: '01/01/21',
      notes: 'here are some different notes',
      rating: '8/10',
      recipeId: recipe.id
    });

    return request(app)
      .put(`/api/v1/logs/${log.id}`)
      .send(updatedLog)
      .then(res => {
        expect(res.body).toEqual({ ...updatedLog, id: '1' });
      });
  });

  it('deletes a log by id', async() => {

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

    const res = await request(app)
      .delete(`/api/v1/logs/${log.id}`);

    expect(res.body).toEqual(log);
  });
});

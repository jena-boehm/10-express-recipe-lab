const fs = require('fs');
const pool = require('../lib/utils/pool');
const request = require('supertest');
const app = require('../lib/app');
const Recipe = require('../lib/models/recipe');

describe('recipe-lab routes', () => {
  let recipe;

  beforeEach(async() => {
    await pool.query(fs.readFileSync('./sql/setup.sql', 'utf-8'));

    recipe = await Recipe.insert({
      name: 'cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    });
  });

  afterAll(() => {
    return pool.end();
  });


  it('creates a recipe', () => {
    return request(app)
      .post('/api/v1/recipes')
      .send(recipe)
      .then(res => {
        expect(res.body).toEqual({ ...recipe, id: '2' });
      });
  });


  it('returns all recipes', async() => {
    const recipes = await Promise.all([
      { name: 'cookies', directions: [] },
      { name: 'cake', directions: [] },
      { name: 'pie', directions: [] }
    ].map(recipe => Recipe.insert(recipe)));

    return request(app)
      .get('/api/v1/recipes')
      .then(res => {
        recipes.forEach(recipe => {
          expect(res.body).toContainEqual(recipe);
        });
      });
  });


  it('returns a recipe by id', async() => {

    const res = await request(app)
      .get(`/api/v1/recipes/${recipe.id}`);

    expect(res.body).toEqual(recipe);
  });


  it('updates a recipe by id', async() => {
    const updatedRecipe = {
      name: 'good cookies',
      directions: [
        'preheat oven to 375',
        'mix ingredients',
        'put dough on cookie sheet',
        'bake for 10 minutes'
      ]
    };

    return request(app)
      .put(`/api/v1/recipes/${recipe.id}`)
      .send(updatedRecipe)
      .then(res => {
        expect(res.body).toEqual({ ...updatedRecipe, id: '1' });
      });
  });

  it('deletes a recipe by id', async() => {

    const res = await request(app)
      .delete(`/api/v1/recipes/${recipe.id}`);

    expect(res.body).toEqual(recipe);
  });
});

const fs = require('fs');
const request = require('supertest');
const app = require('../lib/app');
const Cookbook = require('../lib/models/cookbooks');
const Recipe = require('../lib/models/recipes');
const pool = require('../lib/utils/pool');

describe('my cookbook app endpoints', () => {
  beforeEach(() => {
    return pool.query(fs.readFileSync('./lib/utils/setup.sql', 'utf-8'));
  });

  afterAll(() => {
    return pool.end();
  });

  it('creates a new Cookbook - POST', async() => {
    const res = await request(app)
      .post('/cookbooks')
      .send({
        title: 'Amazing Spaghetti for Dummies',
        type: 'Italian'
      });
    
    expect(res.body).toEqual({
      id: expect.any(String),
      title: 'Amazing Spaghetti for Dummies',
      type: 'Italian'
    });
  });

  it('gets a new cookbook by ID with receipes', async() => {
    const newCookbook = await Cookbook
      .insert({
        title: 'Amazing Spaghetti for Dummies',
        type: 'Italian'
      });

    const recipes = await Promise.all([
      { name: 'SPaghetti a la alchemy', cookbookId: newCookbook.id },
      { name: 'Alchemy Rigatoni', cookbookId: newCookbook.id },
      { name: 'Alche-violi', cookbookId: newCookbook.id },
    ].map(recipe => Recipe.insert(recipe)));

    const res = await request(app)
      .get(`/cookbooks/${newCookbook.id}`);

    expect(res.body).toEqual({
      ...newCookbook, recipes: expect.arrayContaining(recipes)
    });  
      
  });

  it('gets all cookbooks', async() => {
    const cookbooks = await Promise.all([
      { title: 'Why not eat dirt?', type: 'scary' },
      { title: 'Sandwiches dammit', type: 'bready' },
      { title: 'Silly Rabbit, Vegetables are for vegtarians', type: 'vegetarian' }
    ].map(cookbook => Cookbook.insert(cookbook)));

    const res = await request(app)
      .get('/cookbooks');

    expect(res.body).toEqual(expect.arrayContaining(cookbooks)); 
    expect(res.body).toHaveLength(cookbooks.length);
  });
  
  it('updates  a cookbook with PUT', async() => {
    const cookbook = await Cookbook.insert({ 
      title: 'Why not eat dirt?', 
      type: 'scary' });

    const res = await request(app)
      .put(`/cookbooks/${cookbook.id}`)
      .send({
        title: 'Why not eat dirt?',
        type: 'mineral-filled diets'
      });

    expect(res.body).toEqual({
      id: cookbook.id,
      title: 'Why not eat dirt?',
      type: 'mineral-filled diets'
    });
  });

  it('deletes a cookbook', async() => {
    const cookbook = await Cookbook.insert({ 
      title: 'Why not eat dirt?', 
      type: 'scary'
    });
    
    const res = await request(app)
      .delete(`/cookbooks/${cookbook.id}`);
        
    expect(res.body).toEqual(cookbook);
  });
});


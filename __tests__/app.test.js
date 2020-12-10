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

});


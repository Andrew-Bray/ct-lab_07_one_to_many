const express = require('express');
const Cookbook = require('./models/cookbooks');
const app = express();

app.use(express.json());

app.post('/cookbooks', (req, res, next)  => {
  Cookbook 
    .insert(req.body)
    .then(cookbook => res.send(cookbook))
    .catch(next);
});

app.get('/cookbooks', (req, res, next) => {
  Cookbook
    .find()
    .then(cookbooks => res.send(cookbooks))
    .catch(next);
});

app.get('/cookbooks/:id', (req, res, next) => {
  Cookbook
    .findById(req.params.id)
    .then(cookbook => res.send(cookbook))
    .catch(next);
});

app.put('/cookbooks/:id', (req, res, next) => {
  Cookbook
    .update(req.params.id, req.body)
    .then(cookbook => res.send(cookbook))
    .catch(next);
});

app.delete('/cookbooks/:id', (req, res, next) => {
  Cookbook
    .delete(req.params.id)
    .then(cookbook => res.send(cookbook))
    .catch(next);
});

module.exports = app;

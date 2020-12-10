const pool = require('../utils/pool');

module.exports = class Recipe {
  id;
  name;
  cookbook_id;

  constructor(row) {
    this.id = row.id;
    this.name = row.name;
    this.cookbook_id = row.cookbookId;
  }

  // INSERT
  static async insert({ name, cookbookId }) {
    const { rows } = await pool.query(
      `INSERT INTO recipes (name, cookbook_id) 
      VALUES ($1, $2) RETURNING *`,
      [name, cookbookId]
    );

    return new Recipe(rows[0]);
  }
};


// FIND BY ID


//FIND

//UPDATE

//DELETE

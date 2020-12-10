const pool = require('../utils/pool');
const Recipe = require('./recipes');

module.exports = class Cookbook {
  id;
  title;
  type;

  constructor(row) {
    this.id = row.id;
    this.title = row.title;
    this.type = row.type;
  }

  // INSERT
  static async insert({ title, type }) {
    const { rows } = await pool.query(
      `INSERT INTO cookbooks (title, type) 
      VALUES ($1, $2) RETURNING *`,
      [title, type]
    );

    return new Cookbook(rows[0]);
  }

  // FIND BY ID
  static async findById(id) {
    const { rows } = await pool.query(
      `SELECT
        cookbooks.*,
        array_to_json(array_agg(recipes.*)) AS recipes
      FROM
        cookbooks
      JOIN cookbooks
      ON cookbooks.i = recipes.cookbook_id
      WHERE cookbooks.id=$1
      GROUP BY cookbooks.id`,
      [id]
    );

    if(!rows[0]) throw new Error(` no cookbooks with id ${id}`);

    return {
      ...new Cookbook(rows[0]),
      recipes: rows[0].recipes.map(recipe => new Recipe(recipe))
    };
  }

  //FIND
  static async find() {
    const { rows } = await pool.query('SELECT * FROM cookbooks');

    return rows.map(row => new Cookbook(row));
  }

  //UPDATE
  static async update(id, { title, type }) {
    const { rows } = await pool.query(
      `UPDATE cookbooks
        SET title=$1,
          type=$2
        WHERE id=$3
        RETURNING *`,
      [title, type, id]
    );

    if(!rows[0]) throw new Error (`no cookbook with id ${id}`);
    return new Cookbook(rows[0]);
  }

  //DELETE

  static async delete(id) {
    const { rows } = await pool.query(
      `DELETE FROM cookbooks 
      WHERE id=$1 RETURNING *`,
      [id]
    );

    return new Cookbook(rows[0]);
  }
};

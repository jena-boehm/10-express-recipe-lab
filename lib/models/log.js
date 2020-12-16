const pool = require('../utils/pool');

module.exports = class Log {
    id;
    dateOfEvent;
    notes;
    rating;
    recipeId;

    constructor(row) {
      this.id = row.id;
      this.dateOfEvent = row.date_of_event;
      this.notes = row.notes;
      this.rating = row.rating;
      this.recipeId = row.recipe_id;
    }

    static async insert(log) {
      const { rows } = await pool.query(`
        INSERT INTO logs (date_of_event, notes, rating, recipe_id) 
        VALUES ($1, $2, $3, $4) 
        RETURNING *
        `, [log.dateOfEvent, log.notes, log.rating, log.recipe_id]
      );
    
      return new Log(rows[0]);
    }

    static async find() {
      const { rows } = await pool.query(
        'SELECT * FROM logs'
      );
    
      return rows.map(row => new Log(row));
    }

    static async findById(id) {
      const { rows } = await pool.query(
        'SELECT * FROM logs WHERE id=$1',
        [id]
      );
    
      if(!rows[0]) throw new Error(`No log with id ${id}.`);
    
      return new Log(rows[0]);
    }

    static async update(id, log) {
      const { rows } = await pool.query(
        `UPDATE logs
           SET date_of_event=$1,
               notes=$2,
               rating=$3,
               recipe_id=$4
           WHERE id=$5
           RETURNING *
          `,
        [log.dateOfEvent, log.notes, log.rating, log.recipe_id, id]
      );
    
      if(!rows[0]) throw new Error(`No log with id ${id}.`);
        
      return new Log(rows[0]);
    }
};

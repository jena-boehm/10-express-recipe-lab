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
};

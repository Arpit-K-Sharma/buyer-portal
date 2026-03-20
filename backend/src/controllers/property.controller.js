const pool = require('../db/pool');
const { createError } = require('../middleware/error.middleware');

/**
 * GET /api/properties
 * Returns all properties ordered by id.
 */
const getAll = async (req, res, next) => {
  try {
    const result = await pool.query('SELECT * FROM properties ORDER BY id ASC');
    res.status(200).json({ properties: result.rows });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/properties/:id
 * Returns a single property by its id. Returns 404 if not found.
 */
const getById = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Validate that id is a positive integer
    if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
      return next(createError(400, 'Invalid property ID.'));
    }

    const result = await pool.query('SELECT * FROM properties WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return next(createError(404, 'Property not found.'));
    }

    res.status(200).json({ property: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAll, getById };

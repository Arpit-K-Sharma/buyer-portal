const pool = require('../db/pool');
const { createError } = require('../middleware/error.middleware');

/**
 * GET /api/favourites
 * Returns all properties favourited by the authenticated user.
 */
const getFavourites = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT p.*, f.created_at AS favourited_at
       FROM favourites f
       JOIN properties p ON f.property_id = p.id
       WHERE f.user_id = $1
       ORDER BY f.created_at DESC`,
      [req.user.id]
    );
    res.status(200).json({ favourites: result.rows });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/favourites
 * Body: { property_id }
 * Adds a property to the user's favourites.
 * Returns 404 if the property doesn't exist.
 * Returns 409 if already favourited (UNIQUE constraint violation caught gracefully).
 */
const addFavourite = async (req, res, next) => {
  try {
    const { property_id } = req.body;

    if (!property_id || !Number.isInteger(Number(property_id))) {
      return res.status(400).json({ error: 'A valid property_id is required.' });
    }

    // Verify property exists
    const prop = await pool.query('SELECT id FROM properties WHERE id = $1', [property_id]);
    if (prop.rows.length === 0) {
      return next(createError(404, 'Property not found.'));
    }

    // Insert — will throw 23505 if already favourited
    const result = await pool.query(
      `INSERT INTO favourites (user_id, property_id)
       VALUES ($1, $2)
       RETURNING *`,
      [req.user.id, property_id]
    );

    res.status(201).json({
      message: 'Property added to favourites.',
      favourite: result.rows[0],
    });
  } catch (err) {
    // Handle UNIQUE violation gracefully (don't let it bubble as 500)
    if (err.code === '23505') {
      return res.status(409).json({ error: 'This property is already in your favourites.' });
    }
    next(err);
  }
};

/**
 * DELETE /api/favourites/:property_id
 * Removes a property from the user's favourites.
 */
const removeFavourite = async (req, res, next) => {
  try {
    const { property_id } = req.params;

    if (!Number.isInteger(Number(property_id)) || Number(property_id) <= 0) {
      return next(createError(400, 'Invalid property ID.'));
    }

    const result = await pool.query(
      'DELETE FROM favourites WHERE user_id = $1 AND property_id = $2 RETURNING id',
      [req.user.id, property_id]
    );

    if (result.rows.length === 0) {
      return next(createError(404, 'Favourite not found.'));
    }

    res.status(200).json({ message: 'Removed from favourites.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getFavourites, addFavourite, removeFavourite };

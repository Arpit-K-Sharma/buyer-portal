const bcrypt = require('bcryptjs');
const pool = require('../db/pool');
const { createError } = require('../middleware/error.middleware');

/**
 * GET /api/users/me
 * Returns the authenticated user's profile (no password).
 */
const getMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT id, name, email, created_at, updated_at FROM users WHERE id = $1',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return next(createError(404, 'User not found.'));
    }
    res.status(200).json({ user: result.rows[0] });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/users/me
 * Allows updating name, email, and/or password.
 * - Whitelists only allowed fields.
 * - If updating email: checks it's not already taken by another user.
 * - If updating password: requires currentPassword for confirmation.
 */
const updateMe = async (req, res, next) => {
  try {
    // Whitelist allowed fields
    const { name, email, currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    // Fetch current user
    const userResult = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);
    if (userResult.rows.length === 0) {
      return next(createError(404, 'User not found.'));
    }
    const currentUser = userResult.rows[0];

    let newName = currentUser.name;
    let newEmail = currentUser.email;
    let newHashedPassword = currentUser.password;

    // Update name
    if (name !== undefined) {
      if (!name.trim()) {
        return res.status(400).json({ error: 'Name cannot be empty.' });
      }
      newName = name.trim();
    }

    // Update email
    if (email !== undefined) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format.' });
      }
      const normalised = email.toLowerCase().trim();
      if (normalised !== currentUser.email) {
        const conflict = await pool.query(
          'SELECT id FROM users WHERE email = $1 AND id != $2',
          [normalised, userId]
        );
        if (conflict.rows.length > 0) {
          return res.status(409).json({ error: 'This email is already in use by another account.' });
        }
        newEmail = normalised;
      }
    }

    // Update password
    if (newPassword !== undefined) {
      if (!currentPassword) {
        return res.status(400).json({ error: 'Current password is required to set a new password.' });
      }
      const isMatch = await bcrypt.compare(currentPassword, currentUser.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Current password is incorrect.' });
      }
      if (newPassword.length < 8) {
        return res.status(400).json({ error: 'New password must be at least 8 characters.' });
      }
      newHashedPassword = await bcrypt.hash(newPassword, 12);
    }

    const result = await pool.query(
      `UPDATE users
       SET name = $1, email = $2, password = $3, updated_at = NOW()
       WHERE id = $4
       RETURNING id, name, email, updated_at`,
      [newName, newEmail, newHashedPassword, userId]
    );

    res.status(200).json({
      message: 'Profile updated successfully.',
      user: result.rows[0],
    });
  } catch (err) {
    next(err);
  }
};

/**
 * DELETE /api/users/me
 * Permanently deletes the authenticated user's account.
 * Favourites cascade-delete via FK.
 */
const deleteMe = async (req, res, next) => {
  try {
    const result = await pool.query(
      'DELETE FROM users WHERE id = $1 RETURNING id',
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return next(createError(404, 'User not found.'));
    }
    res.status(200).json({ message: 'Your account has been deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

module.exports = { getMe, updateMe, deleteMe };

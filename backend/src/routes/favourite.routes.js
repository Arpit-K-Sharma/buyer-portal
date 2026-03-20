const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { getFavourites, addFavourite, removeFavourite } = require('../controllers/favourite.controller');

// All favourite routes require a valid JWT
router.use(authenticate);

router.get('/', getFavourites);
router.post('/', addFavourite);
router.delete('/:property_id', removeFavourite);

module.exports = router;

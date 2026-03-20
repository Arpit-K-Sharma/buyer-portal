const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { getAll, getById } = require('../controllers/property.controller');

// All property routes require a valid JWT
router.use(authenticate);

router.get('/', getAll);
router.get('/:id', getById);

module.exports = router;

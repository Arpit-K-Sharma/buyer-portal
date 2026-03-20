const express = require('express');
const router = express.Router();
const { authenticate } = require('../middleware/auth.middleware');
const { getMe, updateMe, deleteMe } = require('../controllers/user.controller');

// All user routes require a valid JWT
router.use(authenticate);

router.get('/me', getMe);
router.put('/me', updateMe);
router.delete('/me', deleteMe);

module.exports = router;

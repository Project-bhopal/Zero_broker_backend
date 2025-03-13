const express = require('express');
const router = express.Router();
const requestedPropertyController = require('../controllers/requestedPropertyController');
const { accessTokenVerify, authorizeRoles } = require('../middleware/authMiddleware');

// Seller creates a request
router.post(
     '/create',
     accessTokenVerify,
     authorizeRoles('seller'),
     requestedPropertyController.createRequest
);

// Agents view all pending requests
router.get(
     '/pending',
     accessTokenVerify,
     authorizeRoles('agent'),
     requestedPropertyController.getAllRequestsForAgents
);

// Agent accepts a request
router.put(
     '/accept/:id',
     accessTokenVerify,
     authorizeRoles('agent'),
     requestedPropertyController.acceptRequest
);

module.exports = router;

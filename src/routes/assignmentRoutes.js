const express = require('express');
const router = express.Router();
const assignmentController = require('../controllers/assignmentController');
// const authMiddleware = require('../middlewares/authMiddleware');
// const roleMiddleware = require('../middlewares/roleMiddleware');
const {authorizeRoles,accessTokenVerify}=require("../middleware/authMiddleware")

// Agent routes
router.post(
  '/assign',
  accessTokenVerify,
  authorizeRoles('agent'),
  assignmentController.assignProperty
);

router.put(
  '/review',
  accessTokenVerify,
  authorizeRoles('agent'),
  assignmentController.reviewSubmission
);

// Driver routes
router.put(
  '/respond',
  accessTokenVerify,
  authorizeRoles('driver'),
  assignmentController.respondToAssignment
);

router.put(
  '/upload',
  accessTokenVerify,
  authorizeRoles('driver'),
  assignmentController.uploadMediaAndLocation
);

// Common routes
router.get(
  '/',
  accessTokenVerify,
  authorizeRoles('agent', 'driver'),
  assignmentController.getAssignments
);

module.exports = router;
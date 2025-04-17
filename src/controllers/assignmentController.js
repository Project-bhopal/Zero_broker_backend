const Assignment = require('../models/Assignment');
const Property = require('../models/Property');
const User = require('../models/User');

// Agent assigns property to driver
exports.assignProperty = async (req, res) => {
  try {
    const { propertyId, driverId } = req.body;
    const agentId = req.user.id;

    // Check if driver exists and is a driver
    const driver = await User.findById(driverId);
    if (!driver || driver.role !== 'driver') {
      return res.status(400).json({ message: 'Invalid driver' });
    }

    const assignment = new Assignment({
      propertyId,
      agentId,
      driverId,
      status: 'pending'
    });

    await assignment.save();
    res.status(201).json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Driver accepts/rejects assignment
exports.respondToAssignment = async (req, res) => {
  try {
    const { assignmentId, response } = req.body; // response: 'accept' or 'decline'
    const driverId = req.user.id;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      driverId
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    if (assignment.status !== 'pending') {
      return res.status(400).json({ message: 'Assignment already responded' });
    }

    assignment.status = response === 'accept' ? 'accepted' : 'declined';
    assignment.driverResponseAt = new Date();
    await assignment.save();

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Driver uploads media and location
exports.uploadMediaAndLocation = async (req, res) => {
     try {
       const { assignmentId, media, longitude, latitude } = req.body;
       const driverId = req.user.id;
   
       const assignment = await Assignment.findOne({
         _id: assignmentId,
         driverId,
         status: 'accepted'
       });
   
       if (!assignment) {
         return res.status(404).json({ message: 'Assignment not found or not accepted' });
       }
   
       assignment.media = media;
       assignment.location = {
         type: 'Point',
         coordinates: [longitude, latitude]
       };
       assignment.status = 'media_uploaded';
       await assignment.save();
   
       res.json(assignment);
     } catch (error) {
       res.status(500).json({ message: error.message });
     }
   };

// Agent reviews driver's submission
exports.reviewSubmission = async (req, res) => {
  try {
    const { assignmentId, status, feedback } = req.body; // status: 'approved' or 'rejected'
    const agentId = req.user.id;

    const assignment = await Assignment.findOne({
      _id: assignmentId,
      agentId,
      status: 'media_uploaded'
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found or not ready for review' });
    }

    assignment.status = status;
    assignment.agentFeedback = feedback;
    await assignment.save();

    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get assignments for user based on role
exports.getAssignments = async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;
    
    let assignments;
    
    if (role === 'agent') {
      assignments = await Assignment.find({ agentId: userId })
        .populate('driverId', 'name email phone')
        .populate('propertyId');
    } else if (role === 'driver') {
      assignments = await Assignment.find({ driverId: userId })
        .populate('agentId', 'name email phone')
        .populate('propertyId');
    } else {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};